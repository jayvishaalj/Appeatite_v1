const { TAXES, CONVINIENCE_FEE } = require('../../config/data');
const orderItems = require('../models/orderItems');
const mongoose = require('mongoose');
const logger = require('../../config/logger')(module);
const db = require('../middlewares/db');


exports.createOrderInPostgres = async (userId, resId, amount, orderTime) => {
    const sql = 'INSERT INTO orders (user_id, rest_id, order_amount, order_timestamp, order_time) VALUES ($1, $2, $3, $4, $5) RETURNING id';
    const { rows } = await db.query(sql, [userId, resId, (amount + (TAXES / 100) * amount + (CONVINIENCE_FEE / 100) * amount), new Date(), orderTime]);
    return rows[0].id;
}

exports.addNewOrderToMongo = async (order_id, orderedItems, restId, itemTotal) => {
    try {

        let taxes = (TAXES / 100) * itemTotal;
        let convinience_fee = (CONVINIENCE_FEE / 100) * itemTotal;
        let grandTotal = Math.ceil(itemTotal + taxes + convinience_fee);
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
        logger.log('error', `Error at Creation of a new order ${JSON.stringify(order)}`)
        throw (error);
    }
};


exports.getOrderDetails = async (user_id, order_id) => {
    try {

        const sql = "SELECT * FROM orders WHERE id = $1 AND user_id = $2";
        const { rows } = await db.query(sql, [order_id, user_id]);
        if (rows.length > 0) {
            return rows[0];
        }
        else {
            throw new Error("Order not present!");
        }

    } catch (error) {
        console.log(error);
        logger.log('error', `Error at Getting an order details ${JSON.stringify(order)}`)
        throw (error);
    }
}
