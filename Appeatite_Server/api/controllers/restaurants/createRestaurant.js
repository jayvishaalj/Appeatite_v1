const { checkRestaurantExists, getRestaurantCount, addNewRestaurant } = require('../../helpers/Restaurants');
const restaurantModel = require('../../models/restaurant');
const logger = require('../../../config/logger')(module);

module.exports = async (restData) => {
    try {
        const count = await getRestaurantCount();
        const user = await checkRestaurantExists({ phno: parseInt(restData.phno) });
        if (user === null) {
            const restaurant = await addNewRestaurant(restData, count);
            return restaurant;
        } else {
            throw new Error('Restaurant with this phone number already Exist!')
        }
    } catch (error) {
        logger.log('error', `Adding Restaurant, error: ${error}`);
        throw (error);
    }
}
