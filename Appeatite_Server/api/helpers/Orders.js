const { TAXES, CONVINIENCE_FEE } = require('../../config/data');
const orderItems = require('../models/orderItems');
const mongoose = require('mongoose');
const logger = require('../../config/logger')(module);

exports.addNewOrderToMongo = async (order_id, orderedItems, restId, itemTotal) => {
    try {

        let taxes = (TAXES / 100) * itemTotal;
        let convinience_fee = (CONVINIENCE_FEE / 100) * itemTotal;
        let grandTotal = itemTotal + taxes + convinience_fee;
        const order = new orderItems({
            _id: mongoose.Types.ObjectId(),
            order_id: order_id,
            items_list: orderedItems,
            rest_id: restId,
            item_total: itemTotal,
            taxes,
            convinience_fee,
            grand_total: grandTotal,
            date: new Date()
        });
        await order.save();
        logger.log('info', `Created a new order ${JSON.stringify(order)}`)
        return order;
    } catch (error) {
        console.log(error);
        throw (error);
    }
};
