const express = require('express');
const { createNewOrder } = require('../../controllers/orders');
const router = express();
const logger = require('../../../config/logger')(module);

/**
 * @swagger
 * /api/order/create:
 *   post:
 *      tags:
 *          - order
 *      description: to create a new order
 *      consumes:
 *       - application/json
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
router.post('/create', async (req, res) => {
  try {
    await createNewOrder("RES1", [{ item_id: "RES1_ITEM_1", quantity: 10, item_name: "Samosa", item_price: 10 }, { item_id: "RES1_ITEM_2", quantity: 10, item_name: "Veg Puffs", item_price: 15 }]);
    return res.status(200).json({ message: "Success" })
  } catch (error) {
    logger.log('error', `User Register Error Occured ${error.message}`);
    return res.status(500).json({ message: error.message })
  }
});


module.exports = router;


/**
 * *      parameters:
 *       - in: body
 *         name: order
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
 */
