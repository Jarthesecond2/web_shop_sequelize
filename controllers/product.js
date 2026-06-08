const product = require('../models/product')

class productController {

    async getAllProducts(req, res) {
        const products = await product.findAll();
        console.log(products)
        res.status(201).json({
            products: products
        })
    }

    async getProductById(req, res) {
        try {
            const productId = req.params.id;
            const productData = await product.getProductById(productId);
            
            if (!productData) {
                return res.status(404).json({
                    message: 'Product not found'
                });
            }
            
            res.status(200).json({
                product: productData
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error retrieving product',
                error: error.message
            });
        }
    }
}

module.exports = new productController()