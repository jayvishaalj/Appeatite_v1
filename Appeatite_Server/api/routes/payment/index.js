const express = require('express');
const createNewPayment = require('../../controllers/payment/createNewPayment');
const { auth } = require('../../middlewares');
const { paymentCheckSchema } = require('./paymentSchemaCheck');
const router = express();
const logger = require('../../../config/logger')(module);

/**
 * @swagger
 * /api/payment/create:
 *   post:
 *      tags:
 *          - payment
 *      description: to create a new payment
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
 *                  - order_id
 *              properties:
 *                  order_id:
 *                      type: number
 *                      example: 1
 *      responses:
 *          200:
 *             description: Succesfully Payment Initiated
 *             schema:
 *                  type: object
 *                  properties:
 *                          message:
 *                              type: string
 *                          upi_link:
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
router.post('/create', auth, async (req, res) => {
    try {
        const { error } = paymentCheckSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const order = await createNewPayment(req.user.id, req.body.order_id);
        return res.status(200).json({ upi_link: order, message: "Success" })
    } catch (error) {
        logger.log('error', `User Register Error Occured ${error.message}`);
        return res.status(500).json({ message: error.message })
    }
});


/**
 * @swagger
 * /api/payment/callback:
 *   post:
 *      tags:
 *          - payment
 *      description: its a callback api to check the payment
 *      responses:
 *          200:
 *             description: payment is successfull and rerouting initiated
 *             schema:
 *                  type: object
 *                  properties:
 *                          token:
 *                              type: string
 *                          message:
 *                              type: string
 *          500:
 *             description: Error Occured in the server while processing the request
 *             schema:
 *                  type: object
 *                  properties:
 *                          message:
 *                              type: string
 *
 */
router.post('/callback', async (req, res) => {
    try {
        // TODO: implement a socket communication for subscribe and also add a change in db for payment sucessfull entries
        console.log(req.body)
    } catch (error) {
        logger.log('error', `Setu Payment Callback Error Occured ${JSON.stringify(error)}`);
        // TODO: implement a socket handler for error
    }
});
module.exports = router;

module.exports = router;
