import express from "express";

import authRouter from "./routers/authRouter.js";
import recipelistsRouter from "./routers/recipelistsRouter.js";

import cookieParser from "cookie-parser";
import helmet from "helmet";
import { limiter, authLimiter } from "./util/rateLimiter.js";
import logger from "./util/logger.js";
import cors from "./util/cors.js";
import { connectDB } from "./database/db.js";

const app = express();
const PORT = process.env.PORT || 9000;

app.use(cors);
app.use(cookieParser());
app.use(logger);
app.use(helmet());
app.use(express.json());
app.use(limiter);
app.use('/auth', authLimiter);

app.use(authRouter);
app.use(recipelistsRouter);

async function start() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
  } catch (error) {
    console.error('Error starting the server:', error.message);
    process.exit(1);
  }
}

start();
