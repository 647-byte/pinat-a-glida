/**
 * @file Creates the JWT that the client stores after login or registration.
 */
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

/**
 * Signs a JWT with the user's id and role. The secret and lifetime come from
 * the environment (JWT_SECRET, JWT_EXPIRES_IN).
 * @param {{ _id: import('mongoose').Types.ObjectId, role: string }} user - The user to sign in.
 * @returns {string} The signed token.
 */
export const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        env.JWT_SECRET,
        { expiresIn: env.JWT_EXPIRES_IN }
    );
};