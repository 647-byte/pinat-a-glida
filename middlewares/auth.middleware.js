/**
 * @file Authentication and authorization middlewares.
 * authenticate verifies the JWT and loads the user from the database;
 * authorize restricts a route to given roles. Use authenticate first.
 */
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

/**
 * Verifies the "Authorization: Bearer <token>" header and sets
 * req.user = { id, role }. The role is read from the database, not from the
 * token, so a role change takes effect immediately. Responds with 401 when
 * the header is missing, the token is invalid or expired, or the user no
 * longer exists.
 * @param {import('express').Request} req - The request.
 * @param {import('express').Response} res - The response.
 * @param {import('express').NextFunction} next - Continues, or receives a 401 error.
 */
const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        const error = new Error("יש להתחבר כדי לבצע פעולה זו");
        error.status = 401;
        error.type = "unauthorized";
        return next(error);
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, env.JWT_SECRET, { algorithms: ["HS256"] });
        const user = await User.findById(decoded.id);
        if (!user) {
            const error = new Error("המשתמש אינו קיים, יש להתחבר מחדש");
            error.status = 401;
            error.type = "unauthorized";
            return next(error);
        }
        req.user = { id: user._id.toString(), role: user.role };
        next();
    } catch (err) {
        const error = new Error("ההתחברות אינה תקפה, יש להתחבר מחדש");
        error.status = 401;
        error.type = "unauthorized";
        return next(error);
    }
};

/**
 * Creates a middleware that allows only users with one of the given roles.
 * Must run after authenticate. Responds with 403 for any other role.
 * @example routerUsers.get("/", authenticate, authorize("admin"), getAllUsers);
 * @param {...string} roles - Allowed roles, e.g. "admin".
 * @returns {import('express').RequestHandler} The authorization middleware.
 */
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            const error = new Error("אין לך הרשאה לבצע פעולה זו");
            error.status = 403;
            error.type = "forbidden";
            return next(error);
        }
        next();
    };
};

export { authenticate, authorize };