/**
 * @file Joi schema for POST /orders. The client sends only selections
 * (product ids, size names, choices); prices are calculated on the server.
 */
import Joi from "joi";

/** The chosen size, by name. */
const sizeSchema = Joi.object({
    name: Joi.string().required().trim()
});

/** The choices made in one option group. */
const optionsSchema = Joi.object({
    optionId: Joi.string().hex().length(24).required(),
    selectedChoices: Joi.array().items(Joi.string().trim()).required()
});

/** One requested item; each option group may appear once. */
const itemSchema = Joi.object({
    productId: Joi.string().hex().length(24).required(),
    quantity: Joi.number().integer().min(1).default(1),
    size: sizeSchema,
    options: Joi.array().items(optionsSchema).unique('optionId')
});

/** Delivery address. */
const addressSchema = Joi.object({
    city: Joi.string().required().trim(),
    street: Joi.string().required().trim(),
    numberHouse: Joi.string().required().trim()
});

/** The customer's delivery details. */
const customSchema = Joi.object({
    firstName: Joi.string().required().trim(),
    lastName: Joi.string().required().trim(),
    address: addressSchema.required(),
    phone: Joi.string().required().trim()
});

/** The order body: at least one item, the customer's details and optional comments. */
const orderSchema = Joi.object({
    items: Joi.array().items(itemSchema).required().min(1),
    customerDetails: customSchema.required(),
    comments: Joi.string().allow('', null)
}).required();

export default orderSchema;