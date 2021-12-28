const express = require('express');
const updateRestaurantMenu = require('../../controllers/restaurants/updateRestaurantMenu');
const { menuAddSchema } = require('./menuSchemaCheck');
const router = express();
const logger = require('../../../config/logger')(module);

/**
 * @swagger
 * /api/menu/add/{rest_id}:
 *   post:
 *      tags:
 *          - menu
 *      description: to add a new menu for restaurant
 *      consumes:
 *       - application/json
 *      parameters:
 *       - name: rest_id
 *         description: id for restaurent whose menu needs to be updated
 *         in: path
 *         type: string
 *         required: true
 *       - in: body
 *         name: menu
 *         schema :
 *              type: object
 *              required:
 *                  - name
 *                  - category
 *                  - sub_category
 *                  - description
 *                  - img_url
 *                  - rating
 *                  - making_time
 *                  - calories
 *                  - price
 *                  - isVeg
 *                  - remaining_capacity
 *              properties:
 *                  name:
 *                      type: string
 *                  category:
 *                      type: array
 *                      items:
 *                          type: string
 *                  sub_category:
 *                      type: array
 *                      items:
 *                          type: string
 *                  description:
 *                      type: string
 *                  img_url:
 *                      type: string
 *                  rating:
 *                      type: number
 *                  making_time:
 *                      type: number
 *                  calories:
 *                      type: number
 *                  price:
 *                      type: number
 *                  isVeg:
 *                      type: boolean
 *                  remaining_capacity:
 *                      type: number
 *      responses:
 *          200:
 *             description: Succesfully menu added to restaurant
 *             schema:
 *                  type: object
 *                  properties:
 *                          message:
 *                              type: string
 *          400:
 *             description: Error Occured due to bad request cause of validation
 *             schema:
 *                  type: object
 *                  properties:
 *                          message:
 *                              type: string
 *          500:
 *             description: Restaurant Already Exists / Restaurant Already Exists but needs to be verified / Error Occured in the server while processing the request
 *             schema:
 *                  type: object
 *                  properties:
 *                          message:
 *                              type: string
 *
 */
router.post('/add/:rest_id', async (req, res) => {
    try {
        const { error } = menuAddSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        console.log("REST ID ", req.params.rest_id)
        const result = await updateRestaurantMenu(req.params.rest_id, req.body);
        if (result === null) {
            return res.status(500).json({ message: 'Oops! Sorry Some Error Occured Please Try Again Latter' });
        } else {
            return res.status(200).json({ id: result, message: 'Menu Added Successfully' });
        }
    } catch (error) {
        logger.log('error', `User Register Error Occured ${error.message}`);
        return res.status(500).json({ message: error.message })
    }
});

module.exports = router;
