// Simple CORS test endpoint for Vercel
const express = require('express');
const cors = require('cors');

const app = express();

// CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow innovax-ui.vercel.app specifically
    if (origin === 'https://innovax-ui.vercel.app' || 
        origin === 'http://localhost:3000' ||
        origin === 'http://localhost:8080') {
      return callback(null, true);
    }
    
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ 
    message: 'CORS test successful',
    origin: req.headers.origin,
    timestamp: new Date().toISOString()
  });
});

// Test login endpoint
app.post('/api/auth/login', (req, res) => {
  res.json({ 
    message: 'Login endpoint accessible',
    origin: req.headers.origin,
    timestamp: new Date().toISOString()
  });
});

// Handle OPTIONS requests
app.options('*', (req, res) => {
  res.status(200).end();
});

module.exports = app;
