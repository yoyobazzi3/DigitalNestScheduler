import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet'; // Secure HTTP headers
import rateLimit from 'express-rate-limit'; // Rate limiting
import routes from '../routes/routes.js';

const app = express();

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: 'Too many requests from this IP, please try again later',
});

app.use(helmet()); // Add secure HTTP headers
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(morgan('dev')); // Log HTTP requests
app.use(bodyParser.json()); // Parse JSON request body
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded request body
app.use(limiter); // Apply rate limiting

routes(app);


app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

export default app; 