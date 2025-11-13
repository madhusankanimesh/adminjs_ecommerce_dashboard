const sequelize = require('../config/database');
const User = require('./user');
const Product = require('./product');
const Category = require('./category');
const Order = require('./order');
const OrderItem = require('./orderItem');
const Setting = require('./setting');

// Associations
Product.belongsTo(Category, { foreignKey: 'categoryId' });
Category.hasMany(Product, { foreignKey: 'categoryId' });

Order.hasMany(OrderItem, { foreignKey: 'orderId' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId' });

const initDB = async () => {
  await sequelize.authenticate();
  await sequelize.sync({ alter: true }); // for dev. Use migrations for prod.
};

module.exports = { sequelize, User, Product, Category, Order, OrderItem, Setting, initDB };
