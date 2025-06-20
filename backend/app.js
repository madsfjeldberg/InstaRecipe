import http from "http";

import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { Server } from "socket.io";

import authRouter from "./routers/authRouter.js";
import categoriesRouter from "./routers/categoriesRouter.js";
import commentsRouter from "./routers/commentsRouter.js";
import groceryListRouter from "./routers/groceryListRouter.js";
import recipelistsRouter from "./routers/recipelistsRouter.js";
import recipesRouter from "./routers/recipesRouter.js";
import scrapeRouter from "./routers/scrapeRouter.js";
import tagsRouter from "./routers/tagsRouter.js";
import usersRouter from "./routers/usersRouter.js";

import rateLimiter from "./middleware/rateLimiter.js";
import logger from "./middleware/logger.js";
import cors from "./middleware/cors.js";
import authMiddleware from "./middleware/authMiddleware.js";

import { registerSocketHandlers } from "./sockets/registerSocketHandlers.js";


const app = express();

app.use(cors);
app.use(cookieParser());
app.use(logger);
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(express.json());
app.use(rateLimiter.limiter);
app.use(["/auth/login", "/auth/register"], rateLimiter.authLimiter);

app.use(authRouter);
app.use(categoriesRouter);
app.use(commentsRouter);
app.use(recipesRouter);
app.use(recipelistsRouter);
app.use(tagsRouter);
app.use(usersRouter);

app.use(authMiddleware.authenticateToken);

app.use(groceryListRouter);
app.use(scrapeRouter);

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:9001",
    credentials: true,
  },
});
registerSocketHandlers(io);

const PORT = process.env.PORT || 9000;
httpServer.listen(PORT);
