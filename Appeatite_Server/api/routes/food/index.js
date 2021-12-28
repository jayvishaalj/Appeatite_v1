const express = require('express');
const { getMenuOfRestaurant } = require('../../controllers/food');
const router = express();

/**
 * @swagger
 * /api/food/menu/{restaurant_id}:
 *   get:
 *      tags:
 *          - food
 *      description: Get all the menu of a respective restaurant
 *      summary: Get all the menu of a respective restaurant
 *      consumes:
 *       - application/json
 *      parameters:
 *       - name: restaurant_id
 *         description: id for the restaurant whose menu is needed
 *         in: path
 *         type: string
 *         required: true
 *      responses:
 *          200:
 *             description: menu
 *
 */
router.get('/menu/:restaurant_id', async (req, res) => {
  try {
    const menu = await getMenuOfRestaurant(req.params.restaurant_id);
    return res.status(200).json(menu);
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
});

module.exports = router;
