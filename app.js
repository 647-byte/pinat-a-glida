import express from "express";
import cors from 'cors';
import connectDB from "./config/db.js";
import mainRouter from "./routes/index.route.js"
import { env } from "./config/env.js";
import errorHandler from "./middlewares/error.middlewares.js";
import {operatingHoursMiddleware} from "./middlewares/operatingHours.middleware.js";
import pageNotFound from "./middlewares/notFound.middleware.js";
const app=express();
const corsOptions = {
    origin: env.CLIENT_URL,
    optionsSuccessStatus: 200
};
connectDB();
app.use(cors(corsOptions));
app.use(operatingHoursMiddleware);
app.use(express.json());//מאפשר לקבל body-אובייקט
app.use('/uploads',express.static('uploads'));//מאפשר להציג את התמונות ללקוחות
app.use('/',mainRouter);
app.use(pageNotFound);
app.use(errorHandler);
app.listen(env.PORT,()=>console.log("server running "+env.PORT));