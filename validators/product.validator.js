import Joi from "joi";
const sizeSchema = Joi.object(
    {
        name: Joi.string().required().trim(),
        price: Joi.number().required().min(0),
        maxChoices: Joi.number().min(1).integer()
    });
const productSchema = Joi.object({
    name: Joi.string().required().trim(),
    price: Joi.number().required().default(0).min(0),
    description: Joi.string().trim().allow(''),
    imageUrl: Joi.string().required().trim(),
    isAvailable: Joi.boolean().default(true),
    quantity: Joi.number().min(0).allow(null).default(null).integer(),
    size: Joi.array().items(sizeSchema),
    options: Joi.array().items(Joi.string().hex().length(24)),
    isPopular:Joi.boolean().default(false)
})
export default productSchema;