import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import routes from './routes';
import { notFoundHandler, globalErrorHandler } from './middleware/error.handler';

const app = express();

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: false // Allows serving uploaded static images across domains
}));

// CORS setup
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({
  origin: [clientUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: { success: false, message: 'Too many requests from this IP, please try again later.' }
});
app.use('/api', limiter);

// Request parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static uploads
const uploadsDir = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsDir));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'NEXORA COMPUTERS API', timestamp: new Date() });
});

// REST API routes
app.use('/api', routes);

// 404 & Global Error handling
app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
