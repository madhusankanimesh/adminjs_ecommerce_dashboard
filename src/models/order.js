const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  status: { type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'), defaultValue: 'pending' },
  total: { type: DataTypes.FLOAT, defaultValue: 0 }
}, { tableName: 'orders' });

module.exports = Order;
