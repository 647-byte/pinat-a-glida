/**
 * @file Joi schemas for the /users request bodies, used with integrityCheck.
 * Unknown fields are rejected, so a customer cannot set their own role.
 */
import Joi from "joi";

/** POST /users/register: name, email and password required; phone optional (Israeli format). */
const registerSchema = Joi.object({
    name: Joi.string().required().trim().min(2),
    email: Joi.string().required().trim().email(),
    password: Joi.string().required().min(6),
    phone: Joi.string().trim().pattern(/^0\d{8,9}$/)
}).required();

/** POST /users/login: email and password. */
const loginSchema = Joi.object({
    email: Joi.string().required().trim().email(),
    password: Joi.string().required()
}).required();

/** PATCH /users/me: at least one of name, email, password or phone. */
const updateUserSchema = Joi.object({
    name: Joi.string().trim().min(2),
    email: Joi.string().trim().email(),
    password: Joi.string().min(6),
    phone: Joi.string().trim().pattern(/^0\d{8,9}$/)
}).min(1).required();

/** PATCH /users/:id/role: the new role, customer or admin. */
const roleSchema = Joi.object({
    role: Joi.string().valid('customer', 'admin').required()
}).required();

export { registerSchema, loginSchema, updateUserSchema, roleSchema };