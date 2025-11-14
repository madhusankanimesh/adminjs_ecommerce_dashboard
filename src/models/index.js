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
  try {
    await sequelize.authenticate();
    console.log('✓ Database connection established');
    
    // Force sync to recreate tables (use only in development!)
    await sequelize.sync({ force: true });
    console.log('✓ All tables created successfully');
  } catch (error) {
    console.error('✗ Database initialization failed:', error);
    throw error;
  }
};

module.exports = { sequelize, User, Product, Category, Order, OrderItem, Setting, initDB };
