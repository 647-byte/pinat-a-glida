import express from "express";
import connectDB from "./config/db.js";
import mainRouter from "./routes/index.route.js"
import { env } from "./config/env.js";
import errorHandler from "./middlewares/error.middlewares.js";
const app=express();
connectDB();
app.use(express.json());//מאפשר לקבל body-אובייקט
app.use('/',mainRouter);
app.use(errorHandler);
app.listen(env.PORT,()=>console.log("server running"));