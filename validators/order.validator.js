import Joi from "joi";
const sizeSchema = Joi.object(
    {
        name: Joi.string().required().trim(),
        price: Joi.number().required().min(0)
    });
const optionsSchema = Joi.object(
    {
        title: Joi.string().required().trim(),
        pricePer: Joi.number().default(0).min(0),
        selectedChoices: Joi.array().items(Joi.string().required().trim())
    });
const itemSchema = Joi.object(
    {
        productId: Joi.string().hex().length(24).required(),
        nameItem: Joi.string().required(),
        price: Joi.number().required().default(0).min(0),
        quantity: Joi.number().integer().min(1).default(1),
        size: sizeSchema,
        options: Joi.array().items(optionsSchema)
    })
const addressSchema = Joi.object(
    {
        city: Joi.string().required().trim(),
        street: Joi.string().required().trim(),
        numberHouse: Joi.string().required().trim()
    })
const customSchema = Joi.object(
    {
        firstName: Joi.string().required().trim(),
        lastName: Joi.string().required().trim(),
        address: addressSchema.required(),
        phone: Joi.string().required().trim()
    })
const orderSchema = Joi.object({
    userId: Joi.string().hex().length(24).required(),
    items: Joi.array().items(itemSchema).required().min(1),
    customerDetails: customSchema.required(),
    totalPrice: Joi.number().required().default(0).min(0),
    comments: Joi.string().allow('', null),
    statusOrder: Joi.string().valid('pending', 'preparing', 'on_the_way', 'delivered').default('pending')
})
export default orderSchema;