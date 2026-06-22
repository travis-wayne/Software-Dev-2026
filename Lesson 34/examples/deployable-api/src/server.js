import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// 1. PORT BINDING: This is the most critical part of backend deployment!
// Render, Heroku, and Railway will inject their own port into process.env.PORT.
// If you hardcode this to 3000, your app will crash in production.
const PORT = process.env.PORT || 3000;

// 2. CORS CONFIGURATION: Allow the Vercel frontend to talk to this API
// We use an environment variable so we don't have to hardcode the Vercel URL
const allowedOrigin = process.env.CORS_ORIGIN || '*';
app.use(cors({ origin: allowedOrigin }));

app.use(express.json());

// Basic health check route
app.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: "Deployable API is running!", 
    env: process.env.NODE_ENV || "development",
    cors_allowed: allowedOrigin
  });
});

// Example API route
app.get('/api/status', (req, res) => {
  res.json({
    status: "Online",
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 API running on port ${PORT}`);
});
