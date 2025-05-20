import 'dotenv/config';

import cors from 'cors';

// Set up CORS options
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:9001",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Set-Cookie'],
};

export default cors(corsOptions);
