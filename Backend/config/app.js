import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import xss from 'xss-clean'; // Input sanitization
import csrf from 'csurf'; // CSRF protection
import cookieParser from 'cookie-parser'; // For parsing cookies
import routes from '../routes/routes.js';

const app = express();

// Middleware for rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: 'Too many requests from this IP, please try again later',
});

// Middleware for CSRF protection
const csrfProtection = csrf({ cookie: true });

// Apply middleware
app.use(helmet()); // Secure HTTP headers
app.use(cors()); // Enable CORS
app.use(morgan('dev')); // Logging
app.use(bodyParser.json()); // Parse JSON requests
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded requests
app.use(cookieParser()); // Parse cookies
app.use(xss()); // Sanitize inputs to prevent XSS attacks
app.use('/signup', limiter); // Apply rate limiter to the /signup endpoint
app.use(csrfProtection); // Apply CSRF protection to all routes

// Attach routes
routes(app);

// CSRF error handling middleware
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    // Handle CSRF token errors
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }
  next(err);
});

export default app;