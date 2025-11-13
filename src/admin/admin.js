const AdminJS = require('adminjs').default;
const AdminJSSequelize = require('@adminjs/sequelize');
const { User, Product, Category, Order, OrderItem, Setting, sequelize } = require('../models');

// Register the adapter globally for AdminJS v7.x
AdminJS.registerAdapter({
  Resource: AdminJSSequelize.Resource,
  Database: AdminJSSequelize.Database,
});

const adminJs = new AdminJS({
  resources: [
    {
      resource: User,
      options: {
        properties: { password: { isVisible: false } },
        actions: {
          new: { before: async (request) => {
            if (request.payload.password) {
              const bcrypt = require('bcrypt');
              const hashed = await bcrypt.hash(request.payload.password, 10);
              request.payload = { ...request.payload, password: hashed };
            }
            return request;
          }}
        },
        // Control visibility by currentAdmin (set when mounting router)
        isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin'
      }
    },
    { resource: Product },
    { resource: Category },
    { resource: Order },
    { resource: OrderItem },
    {
      resource: Setting,
      options: {
        isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin'
      }
    }
  ],
  rootPath: '/admin',
  branding: { companyName: 'E-Commerce Admin' }
});

module.exports = adminJs;
