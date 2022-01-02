const express = require('express');
const { createNewOrder } = require('../../controllers/orders');
const { auth } = require('../../middlewares');
const { orderAddSchema } = require('./orderSchemaCheck');
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
 *      parameters:
 *       - name: authorization
 *         description: auth token got from  login.
 *         in: header
 *         example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfdXNlciI6eyJvcmRlcnMiOltdLCJwYWlkT3JkZXJzIjpbXSwiX2lkIjoiNjFjOWJkNzdmYWJhMTQwNGVmNjBiYTgwIiwiaWQiOjEsIm5hbWUiOiJqYXl2aXNoYWFsaiIsInBobm8iOjczNTgxMjUxNTEsImVtYWlsIjoiamF5QGptYWlsLmNvbSIsInBhc3N3b3JkIjoiJDJhJDEwJGY2NUJLdUJSbDR5ckM2NTl2SU9COU9PeWF1MkRsRmZHRWxuSVRKSlVHUG9lQTRrUWRLYkJpIiwiZ2VuZGVyIjoibWFsZSIsImRvYiI6IjE0LTA0LTIwMDAiLCJ2ZXJpZmllZCI6dHJ1ZSwiY3JlYXRlZEF0IjoiMjAyMS0xMi0yN1QxMzoxOTo1MS4zMjJaIiwidXBkYXRlZEF0IjoiMjAyMS0xMi0yN1QxMzoyMDoxNC4zMTRaIiwiX192IjowfSwiaWF0IjoxNjQxMTAyMzUzfQ.pfjqiIZufu-WB9E4BPoeN_7I0GEcPPx_hDwbYsPbzq4
 *         type: string
 *       - in: body
 *         name: order
 *         schema :
 *              type: object
 *              required:
 *                  - rest_id
 *                  - items
 *              properties:
 *                  rest_id:
 *                      type: string
 *                      example: RES001
 *                  items:
 *                      type: array
 *                      items:
 *                        type: object
 *                        properties:
 *                          item_id:
*                             type: string
 *                          quantity:
 *                            type: number
 *                          item_name:
 *                            type: string
 *                          item_price:
*                              type: number
 *      responses:
 *          200:
 *             description: Succesfully Order Created
 *             schema:
 *                  type: object
 *                  properties:
 *                          message:
 *                              type: string
 *                          order_id:
 *                              type: number
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
router.post('/create', auth, async (req, res) => {
  try {
    const { error } = orderAddSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const order = await createNewOrder(req.user.id, req.body.rest_id, req.body.items);
    return res.status(200).json({ order: order, message: "Success" })
  } catch (error) {
    logger.log('error', `User Register Error Occured ${error.message}`);
    return res.status(500).json({ message: error.message })
  }
});


module.exports = router;
