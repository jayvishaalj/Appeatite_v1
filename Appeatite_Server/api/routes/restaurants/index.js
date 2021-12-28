const express = require('express');
const { createRestaurant } = require('../../controllers/restaurants');
const { restaurantRegisterSchema } = require('./restaurantSchemaCheck');
const router = express();
const logger = require('../../../config/logger')(module);

/**
 * @swagger
 * /api/restaurant/register:
 *   post:
 *      tags:
 *          - restaurant
 *      description: to create a new restaurant
 *      consumes:
 *       - application/json
 *      parameters:
 *       - in: body
 *         name: restaurant
 *         schema :
 *              type: object
 *              required:
 *                  - name
 *                  - address
 *                  - phno
 *                  - email
 *                  - img_url
 *                  - merchant_id
 *                  - password
 *                  - passwordRepeat
 *                  - lat
 *                  - long
 *              properties:
 *                  name:
 *                      type: string
 *                  address:
 *                      type: string
 *                  phno:
 *                      type: number
 *                  email:
 *                      type: string
 *                  img_url:
 *                      type: string
 *                  merchant_id:
 *                      type: number
 *                  password:
 *                      type: string
 *                  passwordRepeat:
 *                      type: string
 *                  lat:
 *                      type: number
 *                  long:
 *                      type: number
 *      responses:
 *          200:
 *             description: Succesfully restaurant registered
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
router.post('/register', async (req, res) => {
    try {
        const { error } = restaurantRegisterSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const result = await createRestaurant(req.body);
        if (result === null) {
            return res.status(500).json({ message: 'Oops! Sorry Some Error Occured Please Try Again Latter' });
        } else {
            return res.status(200).json({ id: result, message: 'User Created Successfully' });
        }
    } catch (error) {
        logger.log('error', `User Register Error Occured ${error.message}`);
        return res.status(500).json({ message: error.message })
    }
});


module.exports = router;
