import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger for API calls
app.use((req, res, next) => {
  console.log(`[API ${req.method}] ${req.originalUrl}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Healthcare User Management API is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes - supports /api/auth, /auth, /api/users, /users, and singular /api/user, /user
app.use(['/api/auth', '/auth'], authRoutes);
app.use(['/api/users', '/users', '/api/user', '/user'], userRoutes);

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    availableEndpoints: [
      'POST /api/auth/register (or /api/users)',
      'POST /api/auth/login',
      'GET  /api/auth/me',
      'GET  /api/users',
      'GET  /api/users/:id',
      'PUT  /api/users/:id',
      'DELETE /api/users/:id'
    ]
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Global Error Handler]:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[Server] Express server running on port ${PORT}`);
  console.log(`[Server] API available at http://localhost:${PORT}/api`);
});
// Healthcare API server

