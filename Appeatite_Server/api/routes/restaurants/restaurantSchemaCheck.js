const Joi = require('@hapi/joi');

module.exports.restaurantRegisterSchema = Joi.object({
    name: Joi.string().required(),
    phno: Joi.number().integer().min(1000000000).max(9999999999).required(),
    email: Joi.string().email(),
    address: Joi.string().required(),
    img_url: Joi.string().required(),
    lat: Joi.number().required(),
    long: Joi.number().required(),
    merchant_id: Joi.number().required(),
    password: Joi.string().required(),
    passwordRepeat: Joi.string().required().valid(Joi.ref('password')).messages({
        'any.only': "Passwords Doesn't match !",
    }),
});
