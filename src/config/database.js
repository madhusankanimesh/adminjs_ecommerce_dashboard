const { Sequelize } = require('sequelize');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';
const isAzure = process.env.DB_HOST && process.env.DB_HOST.includes('azure.com');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'adminjs_db',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || '1234',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false, // Set to console.log to see SQL queries
    dialectOptions: isAzure ? {
      ssl: {
        require: true,
        rejectUnauthorized: false // Azure PostgreSQL requires SSL
      }
    } : {},
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

module.exports = sequelize;
