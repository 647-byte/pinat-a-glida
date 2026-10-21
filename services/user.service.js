import bcrypt from "bcrypt";
import User from "../models/user.model.js";

const findUserByEmail = (email) => {
    return User.findOne({ email: email.toLowerCase() });
};

const checkPassword = (plainPassword, hashedPassword) => {
    return bcrypt.compare(plainPassword, hashedPassword);
};

export { findUserByEmail, checkPassword };