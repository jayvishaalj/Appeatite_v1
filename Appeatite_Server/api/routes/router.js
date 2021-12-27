const express = require('express');
const router = express();
const { addNewOTP } = require('../helpers/OTP')

// const foodRouter = require('./food/router');
// const restaurantRooter = require('./restaurant/router');
const userRouter = require('./users/router');
// const orderRouter = require('./order/router');
// const paymentRouter = require('./payment/router');

// router.use('/food', foodRouter);
// router.use('/restaurant', restaurantRooter);
router.use('/user', userRouter);
// router.use('/order', orderRouter);
// router.use('/payment', paymentRouter);

/**
 * @swagger
 * /api:
 *   get:
 *      tags:
 *          - base
 *      description: Returns the base  url
 *      responses:
 *          200:
 *             description: A json containing a message
 *             schema:
 *                  type: object
 *                  properties:
 *                          message:
 *                              type: string
 */

router.get('/', async (req, res) => {
    res.status(200).json({ message: 'BASE URL' });
    // const client = await pool.connect();
    // console.log(client)
    // const {rows} = await pool.query("SELECT * FROM orders WHERE user_id = $1", [1]);
    // console.log(rows)

});

module.exports = router;
