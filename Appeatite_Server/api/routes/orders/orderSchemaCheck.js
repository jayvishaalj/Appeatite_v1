const Joi = require('@hapi/joi');


module.exports.itemsInOrderSchema = Joi.object({
    item_id: Joi.string().required(),
    quantity: Joi.number().required(),
    item_name: Joi.string().required(),
    item_price: Joi.number().required()
});

module.exports.orderAddSchema = Joi.object({
    rest_id: Joi.string().required(),
    items: Joi.array().items(this.itemsInOrderSchema),
});
