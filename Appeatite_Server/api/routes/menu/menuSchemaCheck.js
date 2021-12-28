const Joi = require('@hapi/joi');

module.exports.menuAddSchema = Joi.object({
    name: Joi.string().required(),
    category: Joi.array().items(Joi.string()),
    sub_category: Joi.array().items(Joi.string()),
    description: Joi.string().required(),
    img_url: Joi.string().required(),
    rating: Joi.number(),
    making_time: Joi.number().required(),
    calories: Joi.number(),
    price: Joi.number().required(),
    isVeg: Joi.boolean().required(),
    remaining_capacity: Joi.number().required(),
});
