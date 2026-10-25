/**
 * @file One-time migration that marks the flavors option group as limited
 * by size (limitedBySize: true), so the number of flavors a customer may
 * choose comes from the selected size. Safe to run more than once.
 * Run with: npm run migrate:size-limits
 */
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import OptionGroup from "../models/optionGroup.model.js";

/** Title of the option group whose choices are limited by the selected size. */
const FLAVORS_TITLE = "טעמים";

/**
 * Connects to the database, sets limitedBySize on every group with the
 * flavors title, prints how many groups were matched and updated, and
 * disconnects.
 */
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