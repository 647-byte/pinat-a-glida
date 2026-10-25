/**
 * @file Entry point of the API server: creates the Express app, connects to
 * MongoDB, registers the middlewares and routes, and starts listening on PORT.
 */
import express from "express";
import cors from 'cors';
import connectDB from "./config/db.js";
import mainRouter from "./routes/index.route.js"
import { env } from "./config/env.js";
import errorHandler from "./middlewares/error.middlewares.js";
import {operatingHoursMiddleware} from "./middlewares/operatingHours.middleware.js";
import pageNotFound from "./middlewares/notFound.middleware.js";
import { generalLimiter } from "./middlewares/rateLimit.middleware.js";
const app=express();
/** Render (like most hosts) sits behind a proxy: trust it so rate limits see the real client IP. */
app.set("trust proxy", 1);
/** Only the client site (CLIENT_URL) may call the API from a browser. */
const corsOptions = {
    origin: env.CLIENT_URL,
    optionsSuccessStatus: 200
};
connectDB();

// Middleware order matters: CORS, rate limit and the Shabbat check run
// before any route; the 404 and error handlers must come last.
app.use(cors(corsOptions));
app.use(generalLimiter);
app.use(operatingHoursMiddleware);
app.use(express.json()); // Parses JSON request bodies into req.body
app.use('/',mainRouter);
app.use(pageNotFound);
app.use(errorHandler);
app.listen(env.PORT,()=>console.log("server running "+env.PORT));