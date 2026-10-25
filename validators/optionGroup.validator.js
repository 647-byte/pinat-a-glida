import Joi from "joi";
const optionGroupJoiSchema = Joi.object({
    title: Joi.string().required().trim(),
    isMust: Joi.boolean().default(false),
    maxChoices: Joi.number().required().min(1).integer(),
    pricePer: Joi.number().default(0).min(0),
    limitedBySize: Joi.boolean().default(false),
    choices: Joi.array().items(Joi.string().trim()).required()
});

export default optionGroupJoiSchema;