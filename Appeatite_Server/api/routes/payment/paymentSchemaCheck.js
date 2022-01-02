const Joi = require('@hapi/joi');

module.exports.paymentCheckSchema = Joi.object({
    order_id: Joi.number().required()
});
