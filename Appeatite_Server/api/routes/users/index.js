const express = require('express');
const { registerNewUser, sendOTPToUser, verifyOTPUser, userLogin, allOrders } = require('../../controllers/users');
const { auth } = require('../../middlewares');
const { userRegisterSchema, userOTPVerificationSchema, userLoginSchema } = require('./userSchemaCheck');
const router = express();
const logger = require('../../../config/logger')(module);

/**
 * @swagger
 * /api/user/register:
 *   post:
 *      tags:
 *          - user
 *      description: to create a new user
 *      consumes:
 *       - application/json
 *      parameters:
 *       - in: body
 *         name: user
 *         schema :
 *              type: object
 *              required:
 *                  - name
 *                  - phno
 *                  - email
 *                  - dob
 *                  - gender
 *                  - password
 *                  - passwordRepeat
 *              properties:
 *                  name:
 *                      type: string
 *                  phno:
 *                      type: number
 *                  email:
 *                      type: string
 *                  dob:
 *                      type: string
 *                  gender:
 *                      type: string
 *                  password:
 *                      type: string
 *                  passwordRepeat:
 *                      type: string
 *      responses:
 *          200:
 *             description: Succesfully user registered but needs to be verified before ordering
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
 *             description: User Already Exists / User Already Exists but needs to be verified / Error Occured in the server while processing the request
 *             schema:
 *                  type: object
 *                  properties:
 *                          message:
 *                              type: string
 *
 */
router.post('/register', async (req, res) => {
  try {
    const { error } = userRegisterSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const result = await registerNewUser(req.body);
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

/**
 * @swagger
 * /api/user/verify/{user_id}:
 *   get:
 *      tags:
 *          - user
 *      description: To send OTP to the user and verify his mobile number
 *      consumes:
 *       - application/json
 *      parameters:
 *       - name: user_id
 *         description: id for the user whose verification needs to be done
 *         in: path
 *         type: number
 *         required: true
 *      responses:
 *          200:
 *             description: OTP Sent to regsitered mobile number
 *             schema:
 *                  type: object
 *                  properties:
 *                          message:
 *                              type: string
 *                              example: OTP Sent to regsitered mobile number
 *          201:
 *             description: User Already Exists but needs to be verified before ordering
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
 *             description: Error Occured in the server while processing the request
 *             schema:
 *                  type: object
 *                  properties:
 *                          message:
 *                              type: string
 *
 */

router.get('/verify/:user_id', async (req, res) => {
  try {
    if (req.params.user_id === null) {
      return res.status(400).json({ message: 'User Id is a Must' });
    }
    const result = await sendOTPToUser(req.params.user_id);
    if (result === null) {
      return res.status(500).json({ message: 'Oops! Sorry Some Error Occured Please Try Again Latter' });
    }
    else {
      return res.status(200).json({ message: 'OTP Sent to regsitered mobile number' });
    }
  } catch (error) {
    console.log(error)
    logger.log('error', `Error Occured at Verifying user ${req.params} : ${JSON.stringify(error)}`)
    return res.status(500).json({ message: error.message })
  }

});

/**
 * @swagger
 * /api/user/verify:
 *   post:
 *      tags:
 *          - user
 *      description: to verify the OTP sent to the user
 *      consumes:
 *       - application/json
 *      parameters:
 *       - in: body
 *         name: user
 *         schema :
 *              type: object
 *              required:
 *                  - user_id
 *                  - otp
 *              properties:
 *                  user_id:
 *                      type: string
 *                      example : 1
 *                  otp:
 *                      type: number
 *      responses:
 *          200:
 *             description: Succesfully user verified
 *             schema:
 *                  type: object
 *                  properties:
 *                          message:
 *                              type: string
 *          201:
 *             description: User Already Verified
 *             schema:
 *                  type: object
 *                  properties:
 *                          message:
 *                              type: string
 *          202:
 *             description: User not verified
 *             schema:
 *                  type: object
 *                  properties:
 *                          message:
 *                              type: string
 *          203:
 *             description: User doesn't exist
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
 *             description: Error Occured in the server while processing the request
 *             schema:
 *                  type: object
 *                  properties:
 *                          message:
 *                              type: string
 *
 */
router.post('/verify', async (req, res) => {
  try {
    const { error } = userOTPVerificationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const result = await verifyOTPUser(req.body.user_id, req.body.otp);
    if (result === null) {
      return res.status(500).json({ message: 'Oops! Sorry Some Error Occured Please Try Again Latter' });
    } else if (result === -1) {
      return res.status(202).json({ message: 'User not verified' });
    } else if (result === 0) {
      return res.status(203).json({ message: 'User Doesnt Exists' });
    } else if (result === 2) {
      return res.status(201).json({ message: 'User Already Verified!' });
    } else {
      return res.status(200).json({ message: 'User OTP Verified!' });
    }
  } catch (error) {
    logger.log('error', `User Register Error Occured ${JSON.stringify(error)}`);
    return res.status(500).json({ message: error.message })
  }
});

/**
 * @swagger
 * /api/user/login:
 *   post:
 *      tags:
 *          - user
 *      description: to Login as a user
 *      consumes:
 *       - application/json
 *      parameters:
 *       - in: body
 *         name: user
 *         schema :
 *              type: object
 *              required:
 *                  - phno
 *                  - password
 *              properties:
 *                  phno:
 *                      type: string
 *                      example : 7358125151
 *                  password:
 *                      type: string
 *                      example: jayvishaal
 *      responses:
 *          200:
 *             description: Succesfully User Logged In
 *             schema:
 *                  type: object
 *                  properties:
 *                          message:
 *                              type: string
 *          201:
 *             description: Wrong Credentials
 *             schema:
 *                  type: object
 *                  properties:
 *                          message:
 *                              type: string
 *          202:
 *             description: User doesn't exist
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
 *             description: Error Occured in the server while processing the request
 *             schema:
 *                  type: object
 *                  properties:
 *                          message:
 *                              type: string
 *
 */
router.post('/login', async (req, res) => {
  try {
    const { error } = userLoginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const result = await userLogin(req.body.phno, req.body.password);
    if (result === null) {
      return res.status(500).json({ message: 'Oops! Sorry Some Error Occured Please Try Again Latter' });
    } else {
      return res.status(200).json({ token: result, message: 'User Logged In Succesfully!' });
    }
  } catch (error) {
    logger.log('error', `User Login Error Occured ${JSON.stringify(error)}`);
    return res.status(500).json({ message: error.message })
  }
});

/**
 * @swagger
 * /api/user/orders:
 *   get:
 *      tags:
 *          - user
 *      description: To get all the users of the user
 *      consumes:
 *       - application/json
 *      parameters:
 *       - name: authorization
 *         description: auth token got from  login.
 *         in: header
 *         example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfdXNlciI6eyJvcmRlcnMiOlsiMSJdLCJfaWQiOiI2MDQ1YTQ2OGU4YTljZTRlNTQzZGFmN2IiLCJpZCI6MSwibmFtZSI6ImpheXZpc2hhYWxqIiwicGhubyI6NzM1ODEyNTE1MSwiZW1haWwiOiJqYXlAam1haWwuY29tIiwicGFzc3dvcmQiOiIkMmEkMTAkZHRvZkZqaWJndm83V1ZOS2JnM1dTT25WN1VlSkJla3l2QS40bWMwMC9nU2RtbXYwWmxTZXEiLCJnZW5kZXIiOiJtYWxlIiwiZG9iIjoiMTQtMDQtMjAwMCIsInZlcmlmaWVkIjp0cnVlLCJjcmVhdGVkQXQiOiIyMDIxLTAzLTA4VDA0OjEzOjI4LjUzM1oiLCJ1cGRhdGVkQXQiOiIyMDIxLTA0LTEyVDE1OjAxOjIxLjUyM1oiLCJfX3YiOjB9LCJpYXQiOjE2MTg2NDM4Nzh9.MCnAsFzEFTMo1xCfHrsWJsRg-f0UrTGHqw8kRgq-wzU
 *         type: string
 *      responses:
 *          200:
 *             description: All the orders will be returned
 *             schema:
 *                  type: object
 *                  properties:
 *                          message:
 *                              type: string
 *                              example: OTP Sent to regsitered mobile number
 *          201:
 *             description: User Already Exists but needs to be verified before ordering
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
 *             description: Error Occured in the server while processing the request
 *             schema:
 *                  type: object
 *                  properties:
 *                          message:
 *                              type: string
 *
 */

router.get('/orders', auth, async (req, res) => {
  if (req.params.user_id === null) {
    return res.status(400).json({ message: 'User Id is a Must' });
  }
  const result = await allOrders(req.user._user.id);
  console.log(result);
  if (result === null) {
    return res.status(500).json({ message: 'Oops! Sorry Some Error Occured Please Try Again Latter' });
  } else if (result === 0) {
    return res.status(400).json({ message: "User Doesn't exist" });
  } else {
    return res.status(200).json(result);
  }
});

module.exports = router;
