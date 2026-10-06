import Joi from "joi";

const registerSchema = Joi.object({
    name: Joi.string().required().trim().min(2),
    email: Joi.string().required().trim().email(),
    password: Joi.string().required().min(6),
    phone: Joi.string().trim().pattern(/^0\d{8,9}$/)
});

const loginSchema = Joi.object({
    email: Joi.string().required().trim().email(),
    password: Joi.string().required()
});

const updateUserSchema = Joi.object({
    name: Joi.string().trim().min(2),
    email: Joi.string().trim().email(),
    password: Joi.string().min(6),
    phone: Joi.string().trim().pattern(/^0\d{8,9}$/)
}).min(1);

const roleSchema = Joi.object({
    role: Joi.string().valid('customer', 'admin').required()
});

export { registerSchema, loginSchema, updateUserSchema, roleSchema };