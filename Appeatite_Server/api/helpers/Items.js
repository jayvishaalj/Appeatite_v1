const orderItems = require('../models/orderItems');

exports.checkItemExists = async (condition) => {
    const orderListExists = await orderItems.findOne(condition).exec();
    return orderListExists;
};
