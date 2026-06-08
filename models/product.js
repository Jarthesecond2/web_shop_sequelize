const Sequelize = require('sequelize');
const sequelize = require('../util/db');

const Product = sequelize.define('product', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: Sequelize.STRING,
    price: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

// Static methods for data access
Product.getAllProducts = async function() {
    return await this.findAll();
};

Product.getProductById = async function(id) {
    return await this.findByPk(id);
};

Product.updateProductById = async function(id, data) {
    return await this.update(data, { where: { id: id } });
};

Product.deleteProductById = async function(id) {
    return await this.destroy({ where: { id: id } });
};

module.exports = Product;