import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        const error = new Error("יש להתחבר כדי לבצע פעולה זו");
        error.status = 401;
        error.type = "unauthorized";
        return next(error);
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, env.JWT_SECRET);
        req.user = { id: decoded.id, role: decoded.role };
        next();
    } catch (err) {
        const error = new Error("ההתחברות אינה תקפה, יש להתחבר מחדש");
        error.status = 401;
        error.type = "unauthorized";
        return next(error);
    }
};

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