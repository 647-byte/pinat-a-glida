import Joi from "joi";
const sizeSchema = Joi.object(
    {
        name: Joi.string().required().trim(),
        price: Joi.number().required().min(0),
        maxChoices: Joi.number().min(1).integer()
    });
const optionsSchema = Joi.object(
    {
        title: Joi.string().required().trim(),
        isMust: Joi.boolean().default(true),
        maxChoices: Joi.number().required().min(1).integer(),
        pricePer: Joi.number().default(0).min(0),
        choices: Joi.array().items(Joi.string().trim())
    });
const productSchema = Joi.object({
    name: Joi.string().required().trim(),
    price: Joi.number().required().default(0).min(0),
    description: Joi.string().trim(),
    category: Joi.string().required().trim(),
    imageUrl: Joi.string().required().trim(),
    isAvailable: Joi.boolean().default(true),
    quantity: Joi.number().min(0).allow(null).default(null).integer(),
    size: Joi.array().items(sizeSchema),
    options: Joi.array().items(optionsSchema)
})
export default productSchema;