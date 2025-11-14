const AdminJS = require('adminjs').default;
const AdminJSSequelize = require('@adminjs/sequelize');
const { User, Product, Category, Order, OrderItem, Setting, sequelize } = require('../models');

// Register the adapter globally for AdminJS v7.x
AdminJS.registerAdapter({
  Resource: AdminJSSequelize.Resource,
  Database: AdminJSSequelize.Database,
});

// 🎨 Professional theme configuration
const brandingConfig = {
  companyName: '🛍️ eCommerce Admin Panel',
  logo: false,
  withMadeWithLove: false,
  theme: {
    colors: {
      primary100: '#6366F1',
      primary80: '#818CF8',
      primary60: '#A5B4FC',
      primary40: '#C7D2FE',
      primary20: '#E0E7FF',
      grey100: '#1F2937',
      grey80: '#374151',
      grey60: '#6B7280',
      grey40: '#9CA3AF',
      grey20: '#E5E7EB',
      accent: '#10B981',
      hoverBg: '#F3F4F6',
      errorLight: '#FEE2E2',
      error: '#EF4444',
      successLight: '#D1FAE5',
      success: '#10B981',
    }
  }
};

// 🔐 Role-based access control helper
const canAccess = (resource) => ({ currentAdmin }) => {
  if (!currentAdmin) return false;
  
  const adminResources = ['user', 'product', 'category', 'order', 'orderItem', 'setting'];
  const userResources = ['product', 'category', 'order', 'orderItem'];
  
  if (currentAdmin.role === 'admin') {
    return adminResources.includes(resource);
  } else if (currentAdmin.role === 'user') {
    return userResources.includes(resource);
  }
  
  return false;
};

const adminJs = new AdminJS({
  ...brandingConfig,
  rootPath: '/admin',
  
  // 📊 Custom dashboard with analytics
  dashboard: {
    handler: async (request, response, context) => {
      const { currentAdmin } = context;
      
      if (!currentAdmin) {
        return { error: 'Not authenticated' };
      }

      try {
        const stats = { role: currentAdmin.role, userName: currentAdmin.name };

        if (currentAdmin.role === 'admin') {
          // Admin analytics
          const { Op } = require('sequelize');
          
          stats.totalUsers = await User.count();
          stats.adminUsers = await User.count({ where: { role: 'admin' } });
          stats.regularUsers = await User.count({ where: { role: 'user' } });
          
          stats.totalProducts = await Product.count();
          stats.totalCategories = await Category.count();
          stats.lowStockProducts = await Product.count({ where: { stock: { [Op.lt]: 10 } } });
          
          stats.totalOrders = await Order.count();
          stats.pendingOrders = await Order.count({ where: { status: 'pending' } });
          stats.processingOrders = await Order.count({ where: { status: 'processing' } });
          stats.deliveredOrders = await Order.count({ where: { status: 'delivered' } });
          
          stats.totalRevenue = (await Order.sum('total')) || 0;
          stats.pendingRevenue = (await Order.sum('total', { where: { status: 'pending' } })) || 0;
          
          // Recent orders with customer info
          stats.recentOrders = await Order.findAll({
            limit: 5,
            order: [['createdAt', 'DESC']],
            include: [{ model: User, as: 'customer', attributes: ['name', 'email'] }],
            raw: false
          });
          
          // Top products
          stats.topProducts = await Product.findAll({
            limit: 5,
            order: [['stock', 'ASC']],
            attributes: ['name', 'stock', 'price']
          });
          
        } else {
          // Regular user stats
          stats.totalProducts = await Product.count();
          stats.totalCategories = await Category.count();
          stats.myOrders = await Order.count({ where: { userId: currentAdmin.id } });
          stats.myPendingOrders = await Order.count({ 
            where: { userId: currentAdmin.id, status: 'pending' } 
          });
          stats.myTotalSpent = (await Order.sum('total', { 
            where: { userId: currentAdmin.id } 
          })) || 0;
          
          // User's recent orders
          stats.myRecentOrders = await Order.findAll({
            where: { userId: currentAdmin.id },
            limit: 5,
            order: [['createdAt', 'DESC']],
            raw: false
          });
        }

        return stats;
      } catch (error) {
        console.error('Dashboard error:', error);
        return { error: 'Unable to load dashboard data' };
      }
    },
  },
  
  resources: [
    // 👥 USER MANAGEMENT (Admin Only)
    {
      resource: User,
      options: {
        navigation: { name: '👥 User Management', icon: 'User' },
        properties: {
          id: { isTitle: false },
          name: { isTitle: true },
          email: { 
            type: 'string',
            isRequired: true 
          },
          password: { 
            isVisible: { list: false, show: false, edit: true, filter: false },
            type: 'password'
          },
          role: {
            availableValues: [
              { value: 'admin', label: '👑 Administrator' },
              { value: 'user', label: '👤 Regular User' }
            ],
            isRequired: true
          },
          createdAt: { 
            isVisible: { list: true, show: true, edit: false, filter: true } 
          },
          updatedAt: { 
            isVisible: { list: false, show: true, edit: false, filter: false } 
          }
        },
        listProperties: ['id', 'name', 'email', 'role', 'createdAt'],
        showProperties: ['id', 'name', 'email', 'role', 'createdAt', 'updatedAt'],
        filterProperties: ['name', 'email', 'role', 'createdAt'],
        editProperties: ['name', 'email', 'password', 'role'],
        actions: {
          new: {
            isAccessible: canAccess('user'),
            before: async (request) => {
              if (request.payload.password) {
                const bcrypt = require('bcrypt');
                request.payload.password = await bcrypt.hash(request.payload.password, 10);
              }
              return request;
            }
          },
          edit: {
            isAccessible: canAccess('user'),
            before: async (request) => {
              if (request.payload.password) {
                const bcrypt = require('bcrypt');
                request.payload.password = await bcrypt.hash(request.payload.password, 10);
              }
              return request;
            }
          },
          list: { isAccessible: canAccess('user') },
          show: { isAccessible: canAccess('user') },
          delete: { isAccessible: canAccess('user') },
        }
      }
    },
    
    // 📦 PRODUCT MANAGEMENT
    {
      resource: Product,
      options: {
        navigation: { name: '📦 Catalog', icon: 'ShoppingCart' },
        properties: {
          id: { isTitle: false },
          name: { isTitle: true, isRequired: true },
          description: {
            type: 'textarea',
            props: { rows: 4 }
          },
          price: {
            type: 'number',
            isRequired: true,
            props: { step: 0.01 }
          },
          stock: {
            type: 'number',
            isRequired: true
          },
          categoryId: {
            reference: 'Category',
            isRequired: true
          },
          createdAt: { 
            isVisible: { list: true, show: true, edit: false, filter: true } 
          },
          updatedAt: { 
            isVisible: { list: false, show: true, edit: false, filter: false } 
          }
        },
        listProperties: ['id', 'name', 'price', 'stock', 'categoryId', 'createdAt'],
        showProperties: ['id', 'name', 'description', 'price', 'stock', 'categoryId', 'createdAt', 'updatedAt'],
        filterProperties: ['name', 'categoryId', 'price', 'stock'],
        editProperties: ['name', 'description', 'price', 'stock', 'categoryId'],
        actions: {
          list: { isAccessible: canAccess('product') },
          show: { isAccessible: canAccess('product') },
          edit: { isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin' },
          delete: { isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin' },
          new: { isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin' },
        }
      }
    },
    
    // 🏷️ CATEGORY MANAGEMENT
    {
      resource: Category,
      options: {
        navigation: { name: '📦 Catalog', icon: 'Tag' },
        properties: {
          id: { isTitle: false },
          name: { isTitle: true, isRequired: true },
          description: {
            type: 'textarea',
            props: { rows: 3 }
          },
          createdAt: { 
            isVisible: { list: true, show: true, edit: false, filter: true } 
          },
          updatedAt: { 
            isVisible: { list: false, show: true, edit: false, filter: false } 
          }
        },
        listProperties: ['id', 'name', 'description', 'createdAt'],
        showProperties: ['id', 'name', 'description', 'createdAt', 'updatedAt'],
        filterProperties: ['name'],
        editProperties: ['name', 'description'],
        actions: {
          list: { isAccessible: canAccess('category') },
          show: { isAccessible: canAccess('category') },
          edit: { isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin' },
          delete: { isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin' },
          new: { isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin' },
        }
      }
    },
    
    // 🛒 ORDER MANAGEMENT
    {
      resource: Order,
      options: {
        navigation: { name: '🛒 Sales', icon: 'ShoppingBag' },
        properties: {
          id: { isTitle: true },
          userId: {
            reference: 'User',
            isRequired: true
          },
          status: {
            availableValues: [
              { value: 'pending', label: '⏳ Pending' },
              { value: 'processing', label: '🔄 Processing' },
              { value: 'shipped', label: '📦 Shipped' },
              { value: 'delivered', label: '✅ Delivered' },
              { value: 'cancelled', label: '❌ Cancelled' }
            ],
            isRequired: true
          },
          total: {
            type: 'number',
            isRequired: true,
            props: { step: 0.01 }
          },
          createdAt: { 
            isVisible: { list: true, show: true, edit: false, filter: true } 
          },
          updatedAt: { 
            isVisible: { list: false, show: true, edit: false, filter: false } 
          }
        },
        listProperties: ['id', 'userId', 'status', 'total', 'createdAt'],
        showProperties: ['id', 'userId', 'status', 'total', 'createdAt', 'updatedAt'],
        filterProperties: ['status', 'userId', 'createdAt'],
        editProperties: ['userId', 'status', 'total'],
        actions: {
          list: { isAccessible: canAccess('order') },
          show: { isAccessible: canAccess('order') },
          edit: { isAccessible: canAccess('order') },
          delete: { isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin' },
          new: { isAccessible: canAccess('order') },
        }
      }
    },
    
    // 📋 ORDER ITEMS
    {
      resource: OrderItem,
      options: {
        navigation: { name: '🛒 Sales', icon: 'List' },
        properties: {
          id: { isTitle: true },
          orderId: {
            reference: 'Order',
            isRequired: true
          },
          productId: {
            reference: 'Product',
            isRequired: true
          },
          quantity: {
            type: 'number',
            isRequired: true
          },
          price: {
            type: 'number',
            isRequired: true,
            props: { step: 0.01 }
          }
        },
        listProperties: ['id', 'orderId', 'productId', 'quantity', 'price'],
        showProperties: ['id', 'orderId', 'productId', 'quantity', 'price'],
        filterProperties: ['orderId', 'productId'],
        editProperties: ['orderId', 'productId', 'quantity', 'price'],
        actions: {
          list: { isAccessible: canAccess('orderItem') },
          show: { isAccessible: canAccess('orderItem') },
          edit: { isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin' },
          delete: { isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin' },
          new: { isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin' },
        }
      }
    },
    
    // ⚙️ SETTINGS (Admin Only)
    {
      resource: Setting,
      options: {
        navigation: { name: '⚙️ Configuration', icon: 'Settings' },
        properties: {
          id: { isVisible: { list: false, show: true, edit: false, filter: false } },
          key: {
            isTitle: true,
            isRequired: true
          },
          value: {
            type: 'textarea',
            props: { rows: 2 },
            isRequired: false
          },
          createdAt: { 
            isVisible: { list: false, show: true, edit: false, filter: false } 
          },
          updatedAt: { 
            isVisible: { list: true, show: true, edit: false, filter: false } 
          }
        },
        listProperties: ['key', 'value', 'updatedAt'],
        showProperties: ['id', 'key', 'value', 'createdAt', 'updatedAt'],
        filterProperties: ['key'],
        editProperties: ['key', 'value'],
        actions: {
          list: { isAccessible: canAccess('setting') },
          show: { isAccessible: canAccess('setting') },
          edit: { isAccessible: canAccess('setting') },
          delete: { isAccessible: canAccess('setting') },
          new: { isAccessible: canAccess('setting') },
        }
      }
    }
  ],
  
  locale: {
    language: 'en',
    translations: {
      en: {
        messages: {
          loginWelcome: '🛍️ Welcome to eCommerce Admin Panel',
        },
        labels: {
          navigation: 'Navigation',
          pages: 'Pages',
          selectedRecords: 'Selected ({{selected}})',
          filters: 'Filters',
          adminVersion: 'Admin: v{{version}}',
          dashboard: 'Dashboard',
          role: {
            admin: '👑 Administrator',
            user: '👤 Regular User'
          }
        },
        properties: {
          email: 'Email',
          role: 'Role',
          name: 'Name',
          password: 'Password',
          description: 'Description',
          price: 'Price',
          stock: 'Stock',
          status: 'Status',
          total: 'Total',
          quantity: 'Quantity'
        }
      }
    }
  }
});

module.exports = adminJs;
