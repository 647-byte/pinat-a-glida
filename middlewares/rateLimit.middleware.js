/**
 * @file Request rate limits. generalLimiter applies to every request;
 * authLimiter protects login and registration from password guessing.
 */
import rateLimit from "express-rate-limit";

/**
 * Creates a rate-limit middleware that passes a 429 error with a Hebrew
 * message to the error handler when the limit is reached.
 * @param {number} windowMinutes - Length of the counting window, in minutes.
 * @param {number} maxRequests - Requests allowed per IP address in each window.
 * @param {string} message - The message shown to the user when blocked.
 * @param {boolean} [onlyFailed=false] - Count only failed requests (e.g. wrong passwords).
 * @returns {import('express').RequestHandler} The rate-limit middleware.
 */
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

/** 300 requests per 15 minutes per IP address, for the whole API. */
const generalLimiter = createLimiter(15, 300, "נשלחו יותר מדי בקשות, נסו שוב בעוד כמה דקות");
/** 10 failed login or registration attempts per 15 minutes per IP address. */
const authLimiter = createLimiter(15, 10, "יותר מדי ניסיונות כושלים, נסו שוב בעוד 15 דקות", true);

export { generalLimiter, authLimiter };