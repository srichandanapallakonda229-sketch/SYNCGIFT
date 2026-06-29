import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "../components/ClientLayout";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "SyncGifts | AI-Powered Smart Gift Recommendation Platform",
  description: "Find the perfect gift in seconds with our smart AI assistant. Custom Spotify neon plaques, galaxy projectors, eternal rose glass domes, and curated gift catalog. Fast auto WhatsApp tracking.",
  keywords: "gifts, gift shop, AI recommendation, smart gift finder, birthday gifts, anniversary, luxury gifts, personalized gifts",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${outfit.variable} ${inter.variable} h-full antialiased font-sans`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
