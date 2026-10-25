import mongoose from "mongoose";
import connectDB from "../config/db.js";
import OptionGroup from "../models/optionGroup.model.js";

const FLAVORS_TITLE = "טעמים";

const markSizeLimitedGroups = async () => {
    try {
        await connectDB();
        const result = await OptionGroup.updateMany(
            { title: FLAVORS_TITLE },
            { $set: { limitedBySize: true } }
        );
        console.log(`Matched ${result.matchedCount} group(s), updated ${result.modifiedCount}`);
    } catch (err) {
        console.log(err);
    } finally {
        await mongoose.disconnect();
    }
};

markSizeLimitedGroups();