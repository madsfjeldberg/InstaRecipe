import express from "express";

import authRouter from "./routers/authRouter.js";
import recipelistsRouter from "./routers/recipelistsRouter.js";
import recipesRouter from "./routers/recipesRouter.js";
import usersRouter from "./routers/usersRouter.js";
import categoriesRouter from "./routers/categoriesRouter.js";
import scrapeRouter from "./routers/scrapeRouter.js";

import cookieParser from "cookie-parser";
import helmet from "helmet";
import { limiter, authLimiter } from "./util/rateLimiter.js";
import logger from "./util/logger.js";
import cors from "./util/cors.js";


const app = express();
const PORT = process.env.PORT || 9000;

app.use(cors);
app.use(cookieParser());
app.use(logger);
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));

app.use(express.json());
app.use(limiter);
app.use(['/auth/login', '/auth/register'], authLimiter);

app.use(authRouter);

// authentication jwt token for all routes except authRouter
import { authenticateToken } from "./util/middleware/authenticateToken.js";
app.use(authenticateToken);

app.use(recipelistsRouter);
app.use(recipesRouter);
app.use(usersRouter);
app.use(categoriesRouter);
app.use(scrapeRouter);

app.listen(PORT, () => {console.log(`Server is running on port ${PORT}.`)});