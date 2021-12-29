const { checkRestaurantExists, getRestaurantCount } = require('../../helpers/Restaurants');
const restaurantModel = require('../../models/restaurant');
const { addNewOrderToMongo } = require('../../helpers/Orders');
const logger = require('../../../config/logger')(module);

module.exports = async (restId, items) => {
    try {
        const restaurant = await checkRestaurantExists({ id: restId });
        if (restaurant !== null) {
            // Check if the item is present and available in the restaurant
            let itemTotal = 0;
            for (let i = 0; i < items.length; i++) {
                const item = await restaurantModel.findOne({
                    "id": restId,
                    "menu": { $elemMatch: { id: items[i].item_id, availablity: true } }
                }, { 'menu.$': 1, _id: 0 });
                if (item !== null && item.menu !== null) {
                    console.log(item.menu[0])
                    itemTotal += (item.menu[0].price * items[i].quantity);
                }
                else {
                    console.log("Item Not Available")
                    throw new Error(` Sorry! ${items[i].item_name} is not available`);
                }
            }
            // add an entry in postgres and get the order_id
            // add the items, rest_id and order_id into the orderItems document in mongodb
            const orderedItems = await addNewOrderToMongo(2, items, restId, itemTotal);
            return orderedItems;
        } else {
            throw new Error('Restaurant Does Not Exist!')
        }
    } catch (error) {
        logger.log('error', `Adding Order, error: ${error}`);
        throw (error);
    }
}
