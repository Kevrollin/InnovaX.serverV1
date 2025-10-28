// Ultra-minimal test endpoint
const express = require('express');
const app = express();

// Basic CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Simple test endpoint
app.get('/test', (req, res) => {
  res.json({ 
    message: 'CORS test successful',
    timestamp: new Date().toISOString()
  });
});

// Test login endpoint
app.post('/api/auth/login', (req, res) => {
  res.json({ 
    message: 'Login endpoint accessible',
    timestamp: new Date().toISOString()
  });
});

// Catch-all handler
app.get('*', (req, res) => {
  res.json({ 
    message: 'Server is running',
    path: req.path,
    timestamp: new Date().toISOString()
  });
});

module.exports = app;
