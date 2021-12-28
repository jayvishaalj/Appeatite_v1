const { checkRestaurantExists, editRestaurantDetails } = require('../../helpers/Restaurants');
const logger = require('../../../config/logger')(module);

module.exports = async (resId, menuData) => {
    try {
        console.log(resId, menuData)
        const restaurant = await checkRestaurantExists({ id: resId });
        const count = restaurant.menu.length;
        if (restaurant !== null) {
            const restaurant = await editRestaurantDetails({ id: resId }, { $push: { menu: { ...menuData, id: `${resId}_ITEM_${count + 1}` } } });
            return restaurant;
        } else {
            throw new Error('Restaurant not Present!')
        }
    } catch (error) {
        logger.log('error', `Updating Restaurant, error: ${error}`);
        throw (error);
    }
}
