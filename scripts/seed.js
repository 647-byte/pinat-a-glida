import mongoose from "mongoose";
import connectDB from "../config/db.js";
import User from "../models/user.model.js";
import { env } from "../config/env.js";
import { findUserByEmail } from "../services/user.service.js";

const seedAdmin = async () => {
    try {
        await connectDB();
        const existing = await findUserByEmail(env.ADMIN_EMAIL);
        if (!existing) {
            await User.create({
                name: env.ADMIN_NAME,
                email: env.ADMIN_EMAIL,
                password: env.ADMIN_PASSWORD,
                role: "admin"
            });
            console.log("Admin created");
        } else if (existing.role !== "admin") {
            existing.role = "admin";
            await existing.save();
            console.log("Existing user promoted to admin");
        } else {
            console.log("Admin already exists");
        }
    } catch (err) {
        console.log(err);
    } finally {
        await mongoose.disconnect();
    }
};

seedAdmin();