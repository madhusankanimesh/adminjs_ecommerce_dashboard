const sequelize = require('../config/database');
const User = require('./user');
const Product = require('./product');
const Category = require('./category');
const Order = require('./order');
const OrderItem = require('./orderItem');
const Setting = require('./setting');

// Associations
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });

Order.belongsTo(User, { foreignKey: 'userId', as: 'customer' });
User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });

Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });
OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

const initDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✓ Database connection established successfully');
    console.log(`✓ Connected to: ${process.env.DB_NAME} on ${process.env.DB_HOST}:${process.env.DB_PORT}`);
    
    // Check if we should force recreate the database
    const forceSync = process.env.FORCE_DB_SYNC === 'true';
    
    if (forceSync) {
      console.log('⚠️  FORCE_DB_SYNC is enabled - recreating all tables...');
      await sequelize.sync({ force: true });
      console.log('✓ Database tables recreated');
    } else {
      await sequelize.sync({ alter: true });
      console.log('✓ Database tables synchronized');
    }
    
    // Create admin user if it doesn't exist
    await createAdminIfNotExists();
  } catch (error) {
    console.error('✗ Database initialization failed:', error.message);
    throw error;
  }
};

const createAdminIfNotExists = async () => {
  const bcrypt = require('bcrypt');
  
  try {
    const adminEmail = 'admin@ecommerce.com';
    const existingAdmin = await User.findOne({ where: { email: adminEmail } });
    
    if (!existingAdmin) {
      await User.create({
        name: 'System Administrator',
        email: adminEmail,
        password: await bcrypt.hash('admin123', 10),
        role: 'admin'
      });
      console.log('✅ Admin user created:', adminEmail, '/ admin123');
    } else {
      console.log('ℹ️  Admin user already exists');
    }
  } catch (error) {
    console.error('✗ Admin creation failed:', error);
  }
};

module.exports = { sequelize, User, Product, Category, Order, OrderItem, Setting, initDB };
