import { connect } from "mongoose";
import { env } from "./env.js";
import { exit } from "process";

const connectDB = async () => {
    try {
        await connect(env.MONGO_URL);
        console.log("success");
        
    } catch (err) {
        console.log(err);
        exit(1);
    }
}
export default connectDB;