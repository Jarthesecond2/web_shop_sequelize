const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shop');

router.get('/cart', (req, res) => shopController.getCart(req, res))
router.post('/cart/add-product', (req, res) => shopController.addProductToCart(req, res))
router.post('/cart/remove-product', (req, res) => shopController.removeProductFromCart(req, res))
router.post('/place-order', (req, res) => shopController.placeOrder(req, res))
router.get('/orders', (req, res) => shopController.getUserOrders(req, res))

module.exports = router