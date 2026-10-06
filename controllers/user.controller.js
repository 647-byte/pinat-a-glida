import User from "../models/user.model.js";
import { generateToken } from "../utils/token.js";

const register = async (req, res, next) => {
    try {
        const exists = await User.findByEmail(req.body.email);
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

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findByEmail(email);
        if (!user || !(await user.comparePassword(password))) {
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
            const exists = await User.findByEmail(req.body.email);
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

const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        next(err);
    }
}

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

const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (id === req.user.id) {
            const error = new Error("לא ניתן למחוק את המשתמש שלך עקב היותך מנהל");
            error.status = 400;
            error.type = "bad_request";
            return next(error);
        }
        const user = await User.findByIdAndDelete(id);
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