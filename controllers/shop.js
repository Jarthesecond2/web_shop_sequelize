const Product = require('../models/product');
const Cart = require('../models/cart');
const CartItem = require('../models/cart-item');

class shopController {

    async getAllProducts(req, res) {
        const products = await Product.findAll()
        console.log(products)
        res.status(201).json({
            products: products
        })
    }

    async getCart(req, res) {
        const userCart = await req.user.getCart()
        console.log(userCart)
        const cartProducts = await userCart.getProducts()
        res.status(201).json({
            products: cartProducts
        })
    }

    async addProductToCart(req, res) {
        try {
            const productId = req.body.productId;
            const quantity = req.body.quantity || 1;

            // Verify product exists
            const product = await Product.findByPk(productId);
            if (!product) {
                return res.status(404).json({
                    message: 'Product not found'
                });
            }

            // Get or create user's cart
            let userCart = await req.user.getCart();
            if (!userCart) {
                userCart = await req.user.createCart();
            }

            // Check if product already exists in cart
            const existingCartItem = await CartItem.findOne({
                where: {
                    cartId: userCart.id,
                    productId: productId
                }
            });

            if (existingCartItem) {
                // Product already in cart - increment quantity
                existingCartItem.quantity += quantity;
                await existingCartItem.save();
            } else {
                // Product not in cart - add it
                await userCart.addProduct(product, { 
                    through: { quantity: quantity } 
                });
            }

            // Return updated cart with products
            const updatedCartProducts = await userCart.getProducts();
            res.status(200).json({
                message: 'Product added to cart',
                products: updatedCartProducts
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error adding product to cart',
                error: error.message
            });
        }
    }

    async removeProductFromCart(req, res) {
        try {
            const productId = req.body.productId;

            // Get user's cart
            let userCart = await req.user.getCart();
            if (!userCart) {
                return res.status(400).json({
                    message: 'Cart is empty'
                });
            }

            // Find cart item
            const cartItem = await CartItem.findOne({
                where: {
                    cartId: userCart.id,
                    productId: productId
                }
            });

            if (!cartItem) {
                return res.status(404).json({
                    message: 'Product not found in cart'
                });
            }

            if (cartItem.quantity > 1) {
                // Decrement quantity
                cartItem.quantity -= 1;
                await cartItem.save();
            } else {
                // Remove product from cart
                await userCart.removeProduct(productId);
            }

            // Return updated cart with products
            const updatedCartProducts = await userCart.getProducts();
            res.status(200).json({
                message: 'Product removed from cart',
                products: updatedCartProducts
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error removing product from cart',
                error: error.message
            });
        }
    }
}

module.exports = new shopController()