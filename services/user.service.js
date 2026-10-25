/**
 * @file Database helpers for users, shared by the user controller,
 * the seed script and anywhere else that looks users up by email.
 */
import bcrypt from "bcrypt";
import User from "../models/user.model.js";

/**
 * Finds a user by email. Emails are stored in lowercase, so the search is
 * case-insensitive.
 * @param {string} email - The email to look up.
 * @returns {Promise<import('mongoose').Document|null>} The user, or null if none exists.
 */
const findUserByEmail = (email) => {
    return User.findOne({ email: email.toLowerCase() });
};

/**
 * Checks a plain-text password against a stored bcrypt hash.
 * @param {string} plainPassword - The password the user typed.
 * @param {string} hashedPassword - The hash stored on the user.
 * @returns {Promise<boolean>} True when the password matches.
 */
const checkPassword = (plainPassword, hashedPassword) => {
    return bcrypt.compare(plainPassword, hashedPassword);
};

export { findUserByEmail, checkPassword };