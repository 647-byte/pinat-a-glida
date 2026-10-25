/**
 * @file Request validation middlewares: integrityCheck validates the body
 * with a Joi schema and returns Hebrew messages; integrityId rejects
 * invalid MongoDB ids in route parameters.
 */
import { isValidObjectId } from "mongoose";
import { formatValidationError } from "../validators/validationMessages.js";

/**
 * Creates a middleware that validates the request body against a Joi schema.
 * On success, replaces the body with the validated value (trimmed, with
 * defaults applied). On failure, passes a 400 error with Hebrew messages
 * for every invalid field.
 * @param {import('joi').ObjectSchema} schema - The Joi schema of the body.
 * @returns {import('express').RequestHandler} The validation middleware.
 */
const integrityCheck = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const err = new Error(formatValidationError(error));
            err.status = 400;
            err.type = "validation_error";
            return next(err);
        }
        req.body = value;
        next();
    };
};

/**
 * Router param handler that rejects ids that are not valid MongoDB ObjectIds.
 * @param {import('express').Request} req - The request.
 * @param {import('express').Response} res - The response.
 * @param {import('express').NextFunction} next - The next middleware.
 * @param {string} id - The id from the route.
 */
const integrityId = (req, res, next, id) => {
    if (!isValidObjectId(id)) {
        const error = new Error("מזהה (ID) אינו תקין");
        error.status = 400;
        error.type = "bad_request";
        return next(error);
    }
    next();
};

export { integrityCheck, integrityId };