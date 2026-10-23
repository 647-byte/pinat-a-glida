import Joi from "joi";

const sizeSchema = Joi.object({
    name: Joi.string().required().trim()
});

const optionsSchema = Joi.object({
    optionId: Joi.string().hex().length(24).required(),
    selectedChoices: Joi.array().items(Joi.string().trim()).required()
});

const itemSchema = Joi.object({
    productId: Joi.string().hex().length(24).required(),
    quantity: Joi.number().integer().min(1).default(1),
    size: sizeSchema,
    options: Joi.array().items(optionsSchema).unique('optionId')
});

const addressSchema = Joi.object({
    city: Joi.string().required().trim(),
    street: Joi.string().required().trim(),
    numberHouse: Joi.string().required().trim()
});

const customSchema = Joi.object({
    firstName: Joi.string().required().trim(),
    lastName: Joi.string().required().trim(),
    address: addressSchema.required(),
    phone: Joi.string().required().trim()
});

const orderSchema = Joi.object({
    items: Joi.array().items(itemSchema).required().min(1),
    customerDetails: customSchema.required(),
    comments: Joi.string().allow('', null)
}).required();

export default orderSchema;