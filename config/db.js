import { connect } from "mongoose";
import { env } from "./env.js";

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