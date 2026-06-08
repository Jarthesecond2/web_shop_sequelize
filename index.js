const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true}));

const productionAdminRoutes = require('./routes/admin/products');
app.use('/admin', productionAdminRoutes);

const productRoutes = require('./routes/products');
app.use(productRoutes);

const shopRoutes = require('./routes/shop');
app.use(shopRoutes);

const sequelize = require('./util/db')

const models = require('./models/index');
sequelize.models = models;

app.use((req, res, next) => {
    models.User.findByPk(1)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err))
})

sequelize
    .sync({force: true})
    .then(() => {
        return models.User.findByPk(1)
    })
    .then(user => {
        if (!user) {
            return models.User.create({ name: 'user', email: "user@local.com" });
        }
        return user;
    })
    .then((user) => {
        console.log(user)
        app.listen(3002);
    })
        .catch((error) => {
        console.log(error);
    })
    .then((user) => {
        return user.createCart();
    })
    .then((cart) => {
        console.log(cart)
        app.listen(3002);
    })

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch((error) => {
        console.log('Unable to connect to the database:', error);
    })

app.get('/', (req, res) => {
    res.json({ message: 'web shop app'})
})

app.listen(3002);