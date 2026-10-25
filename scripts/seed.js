/**
 * @file One-time script that makes sure the site has an admin account.
 * Reads the admin's details from the environment (ADMIN_NAME, ADMIN_EMAIL,
 * ADMIN_PASSWORD) and creates the admin, or promotes an existing user with
 * that email. Safe to run more than once. Run it from the project root,
 * with the same environment variables as the server.
 */
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import User from "../models/user.model.js";
import { env } from "../config/env.js";
import { findUserByEmail } from "../services/user.service.js";

/**
 * Connects to the database, creates or promotes the admin, and disconnects.
 * Prints what it did: created, promoted or already exists.
 */
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