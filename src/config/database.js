const { Sequelize } = require('sequelize');
require('dotenv').config();

// Azure App Service uses different environment variable names
const DB_NAME = process.env.AZURE_POSTGRESQL_DATABASE || process.env.DB_NAME || 'adminjs_db';
const DB_USER = process.env.AZURE_POSTGRESQL_USER || process.env.DB_USER || 'postgres';
const DB_PASSWORD = process.env.AZURE_POSTGRESQL_PASSWORD || process.env.DB_PASSWORD || '1234';
const DB_HOST = process.env.AZURE_POSTGRESQL_HOST || process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.AZURE_POSTGRESQL_PORT || process.env.DB_PORT || 5432;
// Azure PostgreSQL always requires SSL
const SSL_ENABLED = (DB_HOST && DB_HOST.includes('azure.com')) || process.env.AZURE_POSTGRESQL_SSL === 'true';
//
const isProduction = process.env.NODE_ENV === 'production';

console.log('🔌 Database Configuration:');
console.log(`   Host: ${DB_HOST}`);
console.log(`   Database: ${DB_NAME}`);
console.log(`   User: ${DB_USER}`);
console.log(`   Port: ${DB_PORT}`);
console.log(`   SSL: ${SSL_ENABLED ? 'Enabled' : 'Disabled'}`);
console.log(`   Environment: ${isProduction ? 'Production' : 'Development'}`);

const sequelize = new Sequelize(
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  {
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'postgres',
    logging: false, // Set to console.log to see SQL queries
    dialectOptions: SSL_ENABLED ? {
      ssl: {
        require: true,
        rejectUnauthorized: false // Azure PostgreSQL requires SSL
      }
    } : {},
    pool: {
      max: 5,
      min: 0,
      acquire: 60000, // Increased timeout for VNet connections
      idle: 10000
    }
  }
);

module.exports = sequelize;
