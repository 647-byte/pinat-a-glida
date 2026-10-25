/**
 * @file Controllers for the /users routes: registration, login, the
 * signed-in user's own profile, and user management for admins.
 * Requests reach these handlers after validation (validate.middleware)
 * and, where required, authentication and role checks (auth.middleware).
 */
import User from "../models/user.model.js";
import { generateToken } from "../utils/token.js";
import { findUserByEmail, checkPassword } from "../services/user.service.js";
import Order from "../models/order.model.js";

/**
 * POST /users/register - creates a customer account and signs it in.
 * Rejects an email that is already registered (409).
 * The body is validated by registerSchema; the role is always "customer".
 * @param {import('express').Request} req - Body: { name, email, password, phone? }.
 * @param {import('express').Response} res - 201 with { user, token }.
 * @param {import('express').NextFunction} next - Receives errors.
 */
const register = async (req, res, next) => {
    try {
        const exists = await findUserByEmail(req.body.email);
        if (exists) {
            const error = new Error("כתובת המייל כבר רשומה במערכת");
            error.status = 409;
            error.type = "conflict";
            return next(error);
        }
        const newUser = new User(req.body);
        const user = await newUser.save();
        const token = generateToken(user);
        res.status(201).json({ user, token });
    } catch (err) {
        next(err);
    }
}

/**
 * POST /users/login - signs a user in with email and password.
 * The same message is returned for an unknown email and a wrong password,
 * so the response does not reveal which emails are registered.
 * @param {import('express').Request} req - Body: { email, password }.
 * @param {import('express').Response} res - 200 with { user, token }.
 * @param {import('express').NextFunction} next - Receives errors (401 on bad credentials).
 */
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await findUserByEmail(email);
        if (!user || !(await checkPassword(password, user.password))) {
            const error = new Error("מייל או סיסמה שגויים");
            error.status = 401;
            error.type = "unauthorized";
            return next(error);
        }
        const token = generateToken(user);
        res.status(200).json({ user, token });
    } catch (err) {
        next(err);
    }
}

/**
 * GET /users/me - returns the signed-in user's profile.
 * @param {import('express').Request} req - req.user is set by authenticate.
 * @param {import('express').Response} res - 200 with the user (without the password).
 * @param {import('express').NextFunction} next - Receives errors (404 if the user was deleted).
 */
const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            const error = new Error("המשתמש אינו נמצא");
            error.status = 404;
            error.type = "not_found";
            return next(error);
        }
        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
}

/**
 * PATCH /users/me - updates the signed-in user's own details.
 * A changed email must not belong to another user (409). A new password is
 * hashed by the model's pre-save hook. The role cannot be changed here:
 * updateUserSchema does not allow it.
 * @param {import('express').Request} req - Body: any of { name, email, password, phone }.
 * @param {import('express').Response} res - 200 with the updated user.
 * @param {import('express').NextFunction} next - Receives errors.
 */
const updateMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            const error = new Error("המשתמש אינו נמצא");
            error.status = 404;
            error.type = "not_found";
            return next(error);
        }
        if (req.body.email && req.body.email.toLowerCase() !== user.email) {
            const exists = await findUserByEmail(req.body.email);
            if (exists) {
                const error = new Error("כתובת המייל כבר רשומה במערכת");
                error.status = 409;
                error.type = "conflict";
                return next(error);
            }
        }
        Object.assign(user, req.body);
        await user.save();
        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
}

/**
 * GET /users - returns all users, newest first (admin only).
 * @param {import('express').Request} req - The request.
 * @param {import('express').Response} res - 200 with an array of users (without passwords).
 * @param {import('express').NextFunction} next - Receives errors.
 */
const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (err) {
        next(err);
    }
}

/**
 * GET /users/:id - returns one user (admin only).
 * @param {import('express').Request} req - req.params.id is the user's id.
 * @param {import('express').Response} res - 200 with the user.
 * @param {import('express').NextFunction} next - Receives errors (404 if not found).
 */
const getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            const error = new Error("המשתמש אינו נמצא");
            error.status = 404;
            error.type = "not_found";
            return next(error);
        }
        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
}

/**
 * DELETE /users/:id - deletes a customer (admin only).
 * Admins cannot be deleted (change their role first), and neither can users
 * with orders, so the order history stays complete.
 * @param {import('express').Request} req - req.params.id is the user's id.
 * @param {import('express').Response} res - 200 with the deleted user.
 * @param {import('express').NextFunction} next - Receives errors (404 / 400).
 */
const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            const error = new Error("המשתמש אינו נמצא");
            error.status = 404;
            error.type = "not_found";
            return next(error);
        }
        if (user.role === "admin") {
            const error = new Error("לא ניתן למחוק מנהל. יש לשנות קודם את תפקידו ללקוח");
            error.status = 400;
            error.type = "bad_request";
            return next(error);
        }
        const hasOrders = await Order.exists({ userId: id });
        if (hasOrders) {
            const error = new Error("לא ניתן למחוק משתמש שיש לו הזמנות");
            error.status = 400;
            error.type = "bad_request";
            return next(error);
        }
        await user.deleteOne();
        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
}

/**
 * PATCH /users/:id/role - changes a user's role (admin only).
 * Admins cannot change their own role, so the site always keeps at least
 * the admin who is making the change.
 * @param {import('express').Request} req - req.params.id is the user's id; body: { role }.
 * @param {import('express').Response} res - 200 with the updated user.
 * @param {import('express').NextFunction} next - Receives errors (400 / 404).
 */
const changeRole = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (id === req.user.id) {
            const error = new Error("לא ניתן לשנות את התפקיד של עצמך");
            error.status = 400;
            error.type = "bad_request";
            return next(error);
        }
        const user = await User.findById(id);
        if (!user) {
            const error = new Error("המשתמש אינו נמצא");
            error.status = 404;
            error.type = "not_found";
            return next(error);
        }
        user.role = req.body.role;
        await user.save();
        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
}

export { register, login, getMe, updateMe, getAllUsers, getUserById, deleteUser, changeRole };