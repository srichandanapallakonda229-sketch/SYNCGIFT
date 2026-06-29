const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors({
  origin: '*', // In production, restrict this to the frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'x-user-id', 'Authorization']
}));

// Body Parsers
app.use(express.json());
// Twilio sends urlencoded data to webhooks
app.use(express.urlencoded({ extended: true }));

// Serve static assets if needed
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes mapping
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/assistant', require('./routes/assistant'));
app.use('/api/twilio', require('./routes/twilio'));
app.use('/api/shop', require('./routes/shop'));

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'Running',
    database: db.isMock() ? 'Local JSON Fallback File Store' : 'MongoDB (Mongoose)',
    timestamp: new Date().toISOString()
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// Start Server after DB setup
async function startServer() {
  await db.connect();
  app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`SyncGifts Express API server is running!`);
    console.log(`Port: ${PORT}`);
    console.log(`Database Mode: ${db.isMock() ? 'LOCAL JSON STORE (FALLBACK)' : 'MONGODB ATLAS'}`);
    console.log(`Health Check: http://localhost:${PORT}/api/health`);
    console.log(`=========================================`);
  });
}

startServer();
