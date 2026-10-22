import rateLimit from "express-rate-limit";

const createLimiter = (windowMinutes, maxRequests, message, onlyFailed = false) => {
    return rateLimit({
        windowMs: windowMinutes * 60 * 1000,
        limit: maxRequests,
        skipSuccessfulRequests: onlyFailed,
        standardHeaders: true,
        legacyHeaders: false,
        handler: (req, res, next) => {
            const error = new Error(message);
            error.status = 429;
            error.type = "too_many_requests";
            next(error);
        }
    });
};

const generalLimiter = createLimiter(15, 300, "נשלחו יותר מדי בקשות, נסו שוב בעוד כמה דקות");
const authLimiter = createLimiter(15, 10, "יותר מדי ניסיונות כושלים, נסו שוב בעוד 15 דקות", true);

export { generalLimiter, authLimiter };