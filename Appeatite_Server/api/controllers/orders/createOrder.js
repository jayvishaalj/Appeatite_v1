const { checkRestaurantExists } = require('../../helpers/Restaurants');
const restaurantModel = require('../../models/restaurant');
const { addNewOrderToMongo, createOrderInPostgres } = require('../../helpers/Orders');
const logger = require('../../../config/logger')(module);

module.exports = async (userId, restId, items) => {
    try {
        const restaurant = await checkRestaurantExists({ id: restId });
        if (restaurant !== null) {
            // Check if the item is present and available in the restaurant
            let itemTotal = 0;
            let makingTime = 0;
            const notAvailableItems = [];
            for (let i = 0; i < items.length; i++) {
                const item = await restaurantModel.findOne({
                    "id": restId,
                    "menu": { $elemMatch: { id: items[i].item_id, availablity: true } }
                }, { 'menu.$': 1, _id: 0 });
                if (item !== null && item.menu !== null) {
                    itemTotal += (item.menu[0].price * items[i].quantity);
                    if (item.menu[0].making_time > makingTime) {
                        makingTime = item.menu[0].making_time;
                    }
                }
                else {
                    notAvailableItems.push(items[i].item_name)
                }
            }
            if (notAvailableItems.length > 0) {
                throw new Error(` Sorry! ${notAvailableItems.toString() + (notAvailableItems.length > 1 ? " are" : " is")} not available`);
            }
            // add an entry in postgres and get the order_id
            const orderId = await createOrderInPostgres(userId, restId, itemTotal);
            // add the items, rest_id and order_id into the orderItems document in mongodb
            const orderedItems = await addNewOrderToMongo(orderId, items, restId, itemTotal);
            return orderedItems;
        } else {
            throw new Error('Restaurant Does Not Exist!')
        }
    } catch (error) {
        logger.log('error', `Adding Order, error: ${error}`);
        throw (error);
    }
}
