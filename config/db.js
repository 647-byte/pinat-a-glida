/**
 * @file MongoDB connection.
 */
import dns from "node:dns";
/** Public DNS servers, so the Atlas address resolves on networks that block it. */
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import { connect } from "mongoose";
import { env } from "./env.js";

/**
 * Connects to MongoDB using MONGO_URL. Stops the process if the connection
 * fails, since the server cannot work without the database.
 */
const connectDB = async () => {
    try {
        await connect(env.MONGO_URL);
        console.log("success");
        
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}
export default connectDB;