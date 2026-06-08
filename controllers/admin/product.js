const Product = require('../../models/product');

class adminController {

    async addProduct(req, res) {
        try {
            const product = await Product.create({
                title: req.body.title,
                price: req.body.price,
                description: req.body.description
            });
            res.status(201).json({
                message: 'Product is added',
                productId: product.id
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error adding product',
                error: error.message
            });
        }
    }

    async getAllProducts(req, res) {
        try {
            const products = await Product.getAllProducts();
            res.status(200).json({
                message: 'All products retrieved',
                products: products
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error retrieving products',
                error: error.message
            });
        }
    }

    async getProductById(req, res) {
        try {
            const productId = req.params.id;
            const productData = await Product.getProductById(productId);
            
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

    async updateProduct(req, res) {
        try {
            const productId = req.params.id;
            const edit = req.query.edit;

            // Check if edit permission is granted
            if (edit !== 'true' && edit !== true) {
                return res.status(403).json({
                    message: 'Edit not permitted'
                });
            }

            // First, get the existing product to verify it exists
            const existingProduct = await Product.getProductById(productId);
            if (!existingProduct) {
                return res.status(404).json({
                    message: 'Product not found'
                });
            }

            // Update the product with new data
            const updateData = {
                title: req.body.title || existingProduct.title,
                price: req.body.price || existingProduct.price,
                description: req.body.description || existingProduct.description
            };

            await Product.updateProductById(productId, updateData);

            // Retrieve the updated product
            const updatedProduct = await Product.getProductById(productId);

            res.status(200).json({
                message: 'Product updated successfully',
                product: updatedProduct
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error updating product',
                error: error.message
            });
        }
    }

    async deleteProduct(req, res) {
        try {
            const productId = req.params.id;

            // Check if product exists
            const existingProduct = await Product.getProductById(productId);
            if (!existingProduct) {
                return res.status(404).json({
                    message: 'Product not found'
                });
            }

            // Delete the product
            await Product.deleteProductById(productId);

            res.status(200).json({
                message: 'Product deleted successfully',
                productId: productId
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error deleting product',
                error: error.message
            });
        }
    }
}

module.exports = new adminController()