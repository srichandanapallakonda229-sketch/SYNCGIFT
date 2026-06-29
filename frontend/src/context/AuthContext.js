'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as fbSignOut, 
  onAuthStateChanged,
  updateProfile,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification
} from 'firebase/auth';
import api from '../utils/api';

const AuthContext = createContext();

// Firebase Configuration template
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

let authInstance = null;
let isFirebaseConfigured = false;

// Initialize Firebase only if config fields exist
if (
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId
) {
  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    authInstance = getAuth(app);
    isFirebaseConfigured = true;
  } catch (error) {
    console.warn("Firebase initialization failed. Defaulting to mock auth:", error.message);
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [firebaseActive, setFirebaseActive] = useState(isFirebaseConfigured);

  // Sync user state on mount
  useEffect(() => {
    // 1. First check localStorage for cached session (useful for mocks or quick loads)
    const storedUser = localStorage.getItem('syncgifts_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        Promise.resolve().then(() => setUser(parsedUser));
      } catch (e) {
        console.error('Error parsing stored user', e);
      }
    }

    // 2. If Firebase is active, listen to auth state changes
    if (isFirebaseConfigured && authInstance) {
      const unsubscribe = onAuthStateChanged(authInstance, async (fbUser) => {
        if (fbUser) {
          try {
            // Register or sync user with backend
            const backendUser = await api.post('/auth/login', {
              id: fbUser.uid,
              name: fbUser.displayName || fbUser.email.split('@')[0],
              email: fbUser.email,
              imageUrl: fbUser.photoURL || ''
            });

            setUser(backendUser);
            localStorage.setItem('syncgifts_user', JSON.stringify(backendUser));
          } catch (err) {
            console.error('Failed to sync user with backend:', err.message);
            // Fallback: use Firebase details directly
            const fallbackUser = {
              id: fbUser.uid,
              name: fbUser.displayName,
              email: fbUser.email,
              imageUrl: fbUser.photoURL,
              role: fbUser.email === 'umasgifty01@gmail.com' ? 'admin' : 'user'
            };
            setUser(fallbackUser);
            localStorage.setItem('syncgifts_user', JSON.stringify(fallbackUser));
          }
        } else {
          // If logged out from Firebase, clear session
          const currentSession = localStorage.getItem('syncgifts_user');
          if (currentSession && !JSON.parse(currentSession).isMock) {
            setUser(null);
            localStorage.removeItem('syncgifts_user');
          }
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      Promise.resolve().then(() => setLoading(false));
    }
  }, []);

  // Firebase Google Login
  const loginWithGoogle = async () => {
    if (!isFirebaseConfigured || !authInstance) {
      throw new Error("Firebase is not configured. Please use Mock Sign-in.");
    }
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(authInstance, provider);
      // Backend sync happens in onAuthStateChanged
      return result.user;
    } catch (error) {
      setLoading(false);
      console.error("Firebase Auth Error:", error.message);
      throw error;
    }
  };

  // Mock Login for easy testing
  const loginMock = async (role = 'user') => {
    setLoading(true);
    const mockProfile = role === 'admin' 
      ? {
          id: 'mock_admin_123',
          name: 'Uma\'s Gifty Admin',
          email: 'umasgifty01@gmail.com',
          imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          role: 'admin',
          isMock: true
        }
      : {
          id: 'mock_user_456',
          name: 'Rohit Sharma',
          email: 'rohit@gmail.com',
          imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          role: 'user',
          isMock: true
        };

    try {
      // Sync mock user with backend if server is running
      const backendUser = await api.post('/auth/login', {
        id: mockProfile.id,
        name: mockProfile.name,
        email: mockProfile.email,
        imageUrl: mockProfile.imageUrl
      });

      setUser(backendUser);
      localStorage.setItem('syncgifts_user', JSON.stringify(backendUser));
      return backendUser;
    } catch (err) {
      console.warn("Backend unavailable during mock login, using client state only.");
      setUser(mockProfile);
      localStorage.setItem('syncgifts_user', JSON.stringify(mockProfile));
      return mockProfile;
    } finally {
      setLoading(false);
    }
  };

  // Email/Password Registration
  const registerWithEmail = async (name, email, phone, password, imageUrl = '') => {
    setLoading(true);
    try {
      if (isFirebaseConfigured && authInstance) {
        const result = await createUserWithEmailAndPassword(authInstance, email, password);
        await updateProfile(result.user, {
          displayName: name,
          photoURL: imageUrl
        });
        await sendEmailVerification(result.user);
        
        const backendUser = await api.post('/auth/login', {
          id: result.user.uid,
          name: name,
          email: email,
          imageUrl: imageUrl,
          mobile: phone
        });
        
        setUser(backendUser);
        localStorage.setItem('syncgifts_user', JSON.stringify(backendUser));
        return backendUser;
      } else {
        const mockId = 'mock_user_' + Date.now();
        const mockUser = {
          id: mockId,
          name,
          email,
          mobile: phone,
          imageUrl: imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          role: email === 'umasgifty01@gmail.com' ? 'admin' : 'user',
          isMock: true,
          emailVerified: false
        };
        
        const mockRegistry = JSON.parse(localStorage.getItem('syncgifts_mock_users') || '[]');
        if (mockRegistry.some(u => u.email.toLowerCase() === email.toLowerCase())) {
          throw new Error("User with this email already exists!");
        }
        mockRegistry.push({ ...mockUser, password });
        localStorage.setItem('syncgifts_mock_users', JSON.stringify(mockRegistry));
        
        try {
          const backendUser = await api.post('/auth/login', {
            id: mockUser.id,
            name: mockUser.name,
            email: mockUser.email,
            imageUrl: mockUser.imageUrl,
            mobile: mockUser.mobile
          });
          setUser(backendUser);
          localStorage.setItem('syncgifts_user', JSON.stringify(backendUser));
        } catch (err) {
          setUser(mockUser);
          localStorage.setItem('syncgifts_user', JSON.stringify(mockUser));
        }
        return mockUser;
      }
    } catch (error) {
      console.error("Registration error:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Email/Password Login
  const loginWithEmail = async (email, password) => {
    setLoading(true);
    try {
      if (isFirebaseConfigured && authInstance) {
        const result = await signInWithEmailAndPassword(authInstance, email, password);
        
        const backendUser = await api.post('/auth/login', {
          id: result.user.uid,
          name: result.user.displayName || email.split('@')[0],
          email: email,
          imageUrl: result.user.photoURL || ''
        });
        
        setUser(backendUser);
        localStorage.setItem('syncgifts_user', JSON.stringify(backendUser));
        return backendUser;
      } else {
        const mockRegistry = JSON.parse(localStorage.getItem('syncgifts_mock_users') || '[]');
        const mockUserRecord = mockRegistry.find(u => u.email.toLowerCase() === email.toLowerCase());
        
        if (!mockUserRecord || mockUserRecord.password !== password) {
          if (email === 'umasgifty01@gmail.com' && password === 'Admin@1234') {
            const adminUser = await loginMock('admin');
            return adminUser;
          } else if (email === 'rohit@gmail.com' && password === 'Rohit@1234') {
            const normalUser = await loginMock('user');
            return normalUser;
          }
          throw new Error("Invalid email or password!");
        }
        
        const { password: _, ...mockUserWithoutPassword } = mockUserRecord;
        
        try {
          const backendUser = await api.post('/auth/login', {
            id: mockUserWithoutPassword.id,
            name: mockUserWithoutPassword.name,
            email: mockUserWithoutPassword.email,
            imageUrl: mockUserWithoutPassword.imageUrl,
            mobile: mockUserWithoutPassword.mobile
          });
          setUser(backendUser);
          localStorage.setItem('syncgifts_user', JSON.stringify(backendUser));
        } catch (err) {
          setUser(mockUserWithoutPassword);
          localStorage.setItem('syncgifts_user', JSON.stringify(mockUserWithoutPassword));
        }
        return mockUserWithoutPassword;
      }
    } catch (error) {
      console.error("Login error:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Password Reset
  const sendPasswordReset = async (email) => {
    try {
      if (isFirebaseConfigured && authInstance) {
        await sendPasswordResetEmail(authInstance, email);
      } else {
        console.log(`[SIMULATED PASSWORD RESET] Sent link to ${email}`);
        const mockRegistry = JSON.parse(localStorage.getItem('syncgifts_mock_users') || '[]');
        const exists = mockRegistry.some(u => u.email.toLowerCase() === email.toLowerCase()) || 
                       email === 'umasgifty01@gmail.com' || email === 'rohit@gmail.com';
        if (!exists) {
          throw new Error("No user registered with this email address!");
        }
      }
    } catch (error) {
      console.error("Password reset error:", error.message);
      throw error;
    }
  };

  // Send Email Verification Link
  const sendEmailVerificationLink = async () => {
    try {
      if (isFirebaseConfigured && authInstance && authInstance.currentUser) {
        await sendEmailVerification(authInstance.currentUser);
      } else {
        console.log(`[SIMULATED EMAIL VERIFICATION] Dispatched verification mail`);
        if (user) {
          const updatedUser = { ...user, emailVerified: true };
          setUser(updatedUser);
          localStorage.setItem('syncgifts_user', JSON.stringify(updatedUser));
        }
      }
    } catch (error) {
      console.error("Email verification send error:", error.message);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    setLoading(true);
    try {
      if (isFirebaseConfigured && authInstance) {
        await fbSignOut(authInstance);
      }
    } catch (e) {
      console.error('Error signing out of Firebase', e);
    }
    setUser(null);
    localStorage.removeItem('syncgifts_user');
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      firebaseActive, 
      loginWithGoogle, 
      loginWithEmail,
      registerWithEmail,
      sendPasswordReset,
      sendEmailVerificationLink,
      loginMock, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
