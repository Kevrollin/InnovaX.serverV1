// Vercel serverless function entry point
try {
  const app = require('../src/app');
  
  // Export the Express app as a Vercel serverless function
  module.exports = app;
} catch (error) {
  console.error('Failed to load Express app:', error);
  
  // Fallback handler
  const express = require('express');
  const fallbackApp = express();
  
  fallbackApp.get('*', (req, res) => {
    res.status(500).json({
      error: 'Application failed to load',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  });
  
  module.exports = fallbackApp;
}
