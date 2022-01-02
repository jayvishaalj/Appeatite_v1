const { getOrderDetails } = require('../../helpers/Orders');
const { checkRestaurantExists } = require('../../helpers/Restaurants');
const { getSETUToken, createSetuUPILink } = require('../../middlewares');
const db = require('../../middlewares/db');
const { v4 } = require('uuid');
const logger = require('../../../config/logger')(module);

module.exports = async (userId, orderId) => {
    try {
        // get order details from postgres and get the restid
        const order = await getOrderDetails(userId, orderId);
        console.log(order);
        const restaurant = await checkRestaurantExists({ id: order.rest_id });
        if (restaurant !== null) {
            console.log(restaurant.merchant_id);
            // get the merchant id and create the payment link
            const setuToken = await getSETUToken();
            const uniquieId = v4();
            const upiDetails = await createSetuUPILink(setuToken, order, restaurant.merchant_id, uniquieId);
            // make an entry in the transaction table
            console.log(upiDetails.name, upiDetails.platformBillID, upiDetails.paymentLink.upiID, upiDetails.paymentLink.upiLink);
            await db.query("INSERT INTO transactions (id, order_id, upi_link, upi_id, platform_bill_id, paid_status) VALUES ($1, $2, $3, $4, $5, $6)", [uniquieId, orderId, upiDetails.paymentLink.upiLink, upiDetails.paymentLink.upiID, upiDetails.platformBillID, 0])
            // return the upi link and other extra details
            return upiDetails.paymentLink.upiLink;
        } else {
            throw new Error('Restaurant Does Not Exist!')
        }
    } catch (error) {
        logger.log('error', `Adding Order, error: ${error}`);
        throw (error);
    }
}
