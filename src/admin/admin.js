const AdminJS = require('adminjs').default;
const AdminJSSequelize = require('@adminjs/sequelize');
const { User, Product, Category, Order, OrderItem, Setting, sequelize } = require('../models');
const { componentLoader } = require('./componentLoader');

// Register the adapter globally for AdminJS v7.x
AdminJS.registerAdapter({
  Resource: AdminJSSequelize.Resource,
  Database: AdminJSSequelize.Database,
});

// 🎨 Modern Premium Theme Configuration
const brandingConfig = {
  companyName: 'Elite Commerce',
  logo: false,
  withMadeWithLove: false,
  theme: {
    colors: {
      primary100: '#7C3AED',
      primary80: '#8B5CF6',
      primary60: '#A78BFA',
      primary40: '#C4B5FD',
      primary20: '#EDE9FE',
      grey100: '#0F172A',
      grey80: '#1E293B',
      grey60: '#475569',
      grey40: '#94A3B8',
      grey20: '#F1F5F9',
      accent: '#F59E0B',
      hoverBg: '#F8FAFC',
      errorLight: '#FEE2E2',
      error: '#DC2626',
      successLight: '#D1FAE5',
      success: '#059669',
      info: '#3B82F6',
      warning: '#F59E0B',
      love: '#EC4899',
      filterBg: '#FEFCE8',
      inputBg: '#FFFFFF',
      bg: '#F9FAFB',
      bck: '#FFFFFF'
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

// ✅ Enhanced Validation Functions
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !email.trim()) {
    throw new Error('Email is required');
  }
  if (!emailRegex.test(email)) {
    throw new Error('Please enter a valid email address');
  }
  return email.toLowerCase().trim();
};

const validatePassword = (password, isNew = false) => {
  if (isNew && (!password || !password.trim())) {
    throw new Error('Password is required for new users');
  }
  if (password && password.length < 6) {
    throw new Error('Password must be at least 6 characters long');
  }
  if (password && password.length > 100) {
    throw new Error('Password is too long (max 100 characters)');
  }
  return password;
};

const validateName = (name) => {
  if (!name || !name.trim()) {
    throw new Error('Name is required');
  }
  if (name.trim().length < 2) {
    throw new Error('Name must be at least 2 characters long');
  }
  if (name.trim().length > 100) {
    throw new Error('Name is too long (max 100 characters)');
  }
  return name.trim();
};

const validatePrice = (price) => {
  const numPrice = parseFloat(price);
  if (isNaN(numPrice) || numPrice < 0) {
    throw new Error('Price must be a positive number');
  }
  if (numPrice > 1000000) {
    throw new Error('Price is too high (max $1,000,000)');
  }
  return numPrice;
};

const validateStock = (stock) => {
  const numStock = parseInt(stock);
  if (isNaN(numStock) || numStock < 0) {
    throw new Error('Stock must be a non-negative number');
  }
  if (numStock > 100000) {
    throw new Error('Stock quantity is too high (max 100,000)');
  }
  return numStock;
};

const validateQuantity = (quantity) => {
  const numQty = parseInt(quantity);
  if (isNaN(numQty) || numQty < 1) {
    throw new Error('Quantity must be at least 1');
  }
  if (numQty > 1000) {
    throw new Error('Quantity is too high (max 1,000 per order)');
  }
  return numQty;
};

const validateTotal = (total) => {
  const numTotal = parseFloat(total);
  if (isNaN(numTotal) || numTotal < 0) {
    throw new Error('Total must be a positive number');
  }
  return numTotal;
};

const adminJs = new AdminJS({
  ...brandingConfig,
  rootPath: '/admin',
  componentLoader,
  
  dashboard: {
    component: componentLoader.add('Dashboard', '../components/Dashboard'),
    handler: async (request, response, context) => {
      const { currentAdmin } = context;
      
      if (!currentAdmin) {
        return { error: 'Not authenticated' };
      }

      try {
        const stats = { role: currentAdmin.role, userName: currentAdmin.name };

        if (currentAdmin.role === 'admin') {
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
          
          stats.recentOrders = await Order.findAll({
            limit: 5,
            order: [['createdAt', 'DESC']],
            include: [{ model: User, as: 'customer', attributes: ['name', 'email'] }],
            raw: false
          });
          
          stats.topProducts = await Product.findAll({
            limit: 5,
            order: [['stock', 'ASC']],
            attributes: ['name', 'stock', 'price']
          });
          
        } else {
          stats.totalProducts = await Product.count();
          stats.totalCategories = await Category.count();
          stats.myOrders = await Order.count({ where: { userId: currentAdmin.id } });
          stats.myPendingOrders = await Order.count({ 
            where: { userId: currentAdmin.id, status: 'pending' } 
          });
          stats.myTotalSpent = (await Order.sum('total', { 
            where: { userId: currentAdmin.id } 
          })) || 0;
          
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
    // 👥 USER MANAGEMENT
    {
      resource: User,
      options: {
        navigation: { name: 'People' },
        properties: {
          id: { isTitle: false, position: 1 },
          name: { 
            isTitle: true,
            position: 2,
            description: 'Full name (2-100 characters)'
          },
          email: { 
            type: 'string',
            isRequired: true,
            position: 3,
            description: 'Valid email address'
          },
          password: { 
            isVisible: { list: false, show: false, edit: true, filter: false },
            type: 'password',
            position: 4,
            description: 'Min 6 characters. Leave empty to keep current.'
          },
          role: {
            availableValues: [
              { value: 'admin', label: 'Administrator' },
              { value: 'user', label: 'Regular User' }
            ],
            isRequired: true,
            position: 5,
            description: 'Permission level'
          },
          createdAt: { isVisible: { list: true, show: true, edit: false, filter: true }, position: 6 },
          updatedAt: { isVisible: { list: false, show: true, edit: false, filter: false }, position: 7 }
        },
        listProperties: ['id', 'name', 'email', 'role', 'createdAt'],
        showProperties: ['id', 'name', 'email', 'role', 'createdAt', 'updatedAt'],
        filterProperties: ['name', 'email', 'role', 'createdAt'],
        editProperties: ['name', 'email', 'password', 'role'],
        actions: {
          new: {
            isAccessible: canAccess('user'),
            before: async (request) => {
              try {
                request.payload.name = validateName(request.payload.name);
                request.payload.email = validateEmail(request.payload.email);
                
                const existingUser = await User.findOne({ where: { email: request.payload.email } });
                if (existingUser) {
                  throw new Error('This email is already registered');
                }
                
                validatePassword(request.payload.password, true);
                
                const bcrypt = require('bcrypt');
                request.payload.password = await bcrypt.hash(request.payload.password, 10);
                
                return request;
              } catch (error) {
                throw error;
              }
            },
            after: async (response) => {
              return {
                ...response,
                notice: { message: 'User created successfully', type: 'success' }
              };
            }
          },
          edit: {
            isAccessible: canAccess('user'),
            before: async (request) => {
              try {
                if (request.payload.name) {
                  request.payload.name = validateName(request.payload.name);
                }
                
                if (request.payload.email) {
                  request.payload.email = validateEmail(request.payload.email);
                  
                  const existingUser = await User.findOne({ 
                    where: { 
                      email: request.payload.email,
                      id: { [require('sequelize').Op.ne]: request.params.recordId }
                    } 
                  });
                  if (existingUser) {
                    throw new Error('This email is already taken');
                  }
                }
                
                if (request.payload.password && request.payload.password.trim()) {
                  validatePassword(request.payload.password);
                  const bcrypt = require('bcrypt');
                  request.payload.password = await bcrypt.hash(request.payload.password, 10);
                } else {
                  delete request.payload.password;
                }
                
                return request;
              } catch (error) {
                throw error;
              }
            },
            after: async (response) => {
              return {
                ...response,
                notice: { message: 'User updated successfully', type: 'success' }
              };
            }
          },
          delete: {
            isAccessible: canAccess('user'),
            before: async (request) => {
              const userId = request.params.recordId;
              const user = await User.findByPk(userId);
              
              if (user && user.role === 'admin') {
                const adminCount = await User.count({ where: { role: 'admin' } });
                if (adminCount <= 1) {
                  throw new Error('Cannot delete the last admin user');
                }
              }
              return request;
            }
          },
          list: { isAccessible: canAccess('user') },
          show: { isAccessible: canAccess('user') },
        }
      }
    },
    
    // 📦 PRODUCT MANAGEMENT
    {
      resource: Product,
      options: {
        navigation: { name: 'Catalog' },
        properties: {
          id: { isTitle: false, position: 1 },
          name: { 
            isTitle: true, 
            isRequired: true,
            position: 2,
            description: 'Product name (2-100 characters)'
          },
          description: {
            type: 'textarea',
            props: { rows: 5 },
            position: 3,
            description: 'Detailed description'
          },
          price: {
            type: 'currency',
            isRequired: true,
            props: { step: 0.01, min: 0 },
            position: 4,
            description: 'Price in USD'
          },
          stock: {
            type: 'number',
            isRequired: true,
            props: { min: 0, step: 1 },
            position: 5,
            description: 'Available quantity'
          },
          categoryId: {
            reference: 'categories',
            isRequired: true,
            position: 6,
            description: 'Product category'
          },
          createdAt: { isVisible: { list: true, show: true, edit: false, filter: true }, position: 7 },
          updatedAt: { isVisible: { list: false, show: true, edit: false, filter: false }, position: 8 }
        },
        listProperties: ['id', 'name', 'price', 'stock', 'categoryId', 'createdAt'],
        showProperties: ['id', 'name', 'description', 'price', 'stock', 'categoryId', 'createdAt', 'updatedAt'],
        filterProperties: ['name', 'categoryId', 'price', 'stock'],
        editProperties: ['name', 'description', 'price', 'stock', 'categoryId'],
        actions: {
          new: {
            isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin',
            before: async (request) => {
              try {
                request.payload.name = validateName(request.payload.name);
                request.payload.price = validatePrice(request.payload.price);
                request.payload.stock = validateStock(request.payload.stock);
                
                if (request.payload.categoryId) {
                  const category = await Category.findByPk(request.payload.categoryId);
                  if (!category) {
                    throw new Error('Selected category does not exist');
                  }
                }
                
                return request;
              } catch (error) {
                throw error;
              }
            },
            after: async (response) => {
              return {
                ...response,
                notice: { message: 'Product created successfully', type: 'success' }
              };
            }
          },
          edit: {
            isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin',
            before: async (request) => {
              try {
                if (request.payload.name) {
                  request.payload.name = validateName(request.payload.name);
                }
                if (request.payload.price !== undefined) {
                  request.payload.price = validatePrice(request.payload.price);
                }
                if (request.payload.stock !== undefined) {
                  request.payload.stock = validateStock(request.payload.stock);
                }
                if (request.payload.categoryId) {
                  const category = await Category.findByPk(request.payload.categoryId);
                  if (!category) {
                    throw new Error('Selected category does not exist');
                  }
                }
                return request;
              } catch (error) {
                throw error;
              }
            },
            after: async (response) => {
              return {
                ...response,
                notice: { message: 'Product updated successfully', type: 'success' }
              };
            }
          },
          delete: {
            isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin',
            before: async (request) => {
              const productId = request.params.recordId;
              const orderItems = await OrderItem.count({ where: { productId } });
              if (orderItems > 0) {
                throw new Error(`Cannot delete this product. It has been ordered ${orderItems} time(s)`);
              }
              return request;
            }
          },
          list: { isAccessible: canAccess('product') },
          show: { isAccessible: canAccess('product') },
        }
      }
    },
    
    // 🏷️ CATEGORY MANAGEMENT
    {
      resource: Category,
      options: {
        navigation: { name: 'Catalog' },
        properties: {
          id: { isTitle: false, position: 1 },
          name: { 
            isTitle: true, 
            isRequired: true,
            position: 2,
            description: 'Category name (2-100 characters)'
          },
          description: {
            type: 'textarea',
            props: { rows: 4 },
            position: 3,
            description: 'Category description'
          },
          createdAt: { isVisible: { list: true, show: true, edit: false, filter: true }, position: 4 },
          updatedAt: { isVisible: { list: false, show: true, edit: false, filter: false }, position: 5 }
        },
        listProperties: ['id', 'name', 'description', 'createdAt'],
        showProperties: ['id', 'name', 'description', 'createdAt', 'updatedAt'],
        filterProperties: ['name'],
        editProperties: ['name', 'description'],
        actions: {
          new: {
            isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin',
            before: async (request) => {
              try {
                request.payload.name = validateName(request.payload.name);
                
                const existing = await Category.findOne({ where: { name: request.payload.name } });
                if (existing) {
                  throw new Error('A category with this name already exists');
                }
                
                return request;
              } catch (error) {
                throw error;
              }
            },
            after: async (response) => {
              return {
                ...response,
                notice: { message: 'Category created successfully', type: 'success' }
              };
            }
          },
          edit: {
            isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin',
            before: async (request) => {
              try {
                if (request.payload.name) {
                  request.payload.name = validateName(request.payload.name);
                  
                  const existing = await Category.findOne({ 
                    where: { 
                      name: request.payload.name,
                      id: { [require('sequelize').Op.ne]: request.params.recordId }
                    } 
                  });
                  if (existing) {
                    throw new Error('Another category with this name already exists');
                  }
                }
                return request;
              } catch (error) {
                throw error;
              }
            }
          },
          delete: {
            isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin',
            before: async (request) => {
              const categoryId = request.params.recordId;
              const products = await Product.count({ where: { categoryId } });
              if (products > 0) {
                throw new Error(`Cannot delete this category. It contains ${products} product(s)`);
              }
              return request;
            }
          },
          list: { isAccessible: canAccess('category') },
          show: { isAccessible: canAccess('category') },
        }
      }
    },
    
    // 🛒 ORDER MANAGEMENT
    {
      resource: Order,
      options: {
        navigation: { name: 'Sales' },
        properties: {
          id: { isTitle: true, position: 1 },
          userId: {
            reference: 'users',
            isRequired: true,
            position: 2,
            description: 'Customer'
          },
          status: {
            availableValues: [
              { value: 'pending', label: 'Pending' },
              { value: 'processing', label: 'Processing' },
              { value: 'shipped', label: 'Shipped' },
              { value: 'delivered', label: 'Delivered' },
              { value: 'cancelled', label: 'Cancelled' }
            ],
            isRequired: true,
            position: 3,
            description: 'Order status'
          },
          total: {
            type: 'currency',
            isRequired: true,
            props: { step: 0.01, min: 0 },
            position: 4,
            description: 'Total amount'
          },
          createdAt: { isVisible: { list: true, show: true, edit: false, filter: true }, position: 5 },
          updatedAt: { isVisible: { list: false, show: true, edit: false, filter: false }, position: 6 }
        },
        listProperties: ['id', 'userId', 'status', 'total', 'createdAt'],
        showProperties: ['id', 'userId', 'status', 'total', 'createdAt', 'updatedAt'],
        filterProperties: ['status', 'userId', 'createdAt'],
        editProperties: ['userId', 'status', 'total'],
        actions: {
          new: {
            isAccessible: canAccess('order'),
            before: async (request) => {
              try {
                request.payload.total = validateTotal(request.payload.total);
                
                if (request.payload.userId) {
                  const user = await User.findByPk(request.payload.userId);
                  if (!user) {
                    throw new Error('Selected customer does not exist');
                  }
                }
                
                return request;
              } catch (error) {
                throw error;
              }
            },
            after: async (response) => {
              return {
                ...response,
                notice: { message: 'Order created successfully', type: 'success' }
              };
            }
          },
          edit: {
            isAccessible: canAccess('order'),
            before: async (request) => {
              try {
                if (request.payload.total !== undefined) {
                  request.payload.total = validateTotal(request.payload.total);
                }
                return request;
              } catch (error) {
                throw error;
              }
            },
            after: async (response) => {
              return {
                ...response,
                notice: { message: 'Order updated successfully', type: 'success' }
              };
            }
          },
          delete: { 
            isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin',
            before: async (request) => {
              const orderId = request.params.recordId;
              await OrderItem.destroy({ where: { orderId } });
              return request;
            }
          },
          list: { isAccessible: canAccess('order') },
          show: { isAccessible: canAccess('order') },
        }
      }
    },
    
    // 📋 ORDER ITEMS
    {
      resource: OrderItem,
      options: {
        navigation: { name: 'Sales' },
        properties: {
          id: { isTitle: true, position: 1 },
          orderId: {
            reference: 'orders',
            isRequired: true,
            position: 2,
            description: 'Related order'
          },
          productId: {
            reference: 'products',
            isRequired: true,
            position: 3,
            description: 'Product'
          },
          quantity: {
            type: 'number',
            isRequired: true,
            props: { min: 1, step: 1 },
            position: 4,
            description: 'Quantity (1-1000)'
          },
          price: {
            type: 'currency',
            isRequired: true,
            props: { step: 0.01, min: 0 },
            position: 5,
            description: 'Unit price'
          }
        },
        listProperties: ['id', 'orderId', 'productId', 'quantity', 'price'],
        showProperties: ['id', 'orderId', 'productId', 'quantity', 'price'],
        filterProperties: ['orderId', 'productId'],
        editProperties: ['orderId', 'productId', 'quantity', 'price'],
        actions: {
          new: {
            isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin',
            before: async (request) => {
              try {
                request.payload.quantity = validateQuantity(request.payload.quantity);
                request.payload.price = validatePrice(request.payload.price);
                
                if (request.payload.orderId) {
                  const order = await Order.findByPk(request.payload.orderId);
                  if (!order) {
                    throw new Error('Selected order does not exist');
                  }
                }
                
                if (request.payload.productId) {
                  const product = await Product.findByPk(request.payload.productId);
                  if (!product) {
                    throw new Error('Selected product does not exist');
                  }
                  if (product.stock < request.payload.quantity) {
                    throw new Error(`Insufficient stock! Only ${product.stock} units available`);
                  }
                }
                
                return request;
              } catch (error) {
                throw error;
              }
            },
            after: async (response) => {
              return {
                ...response,
                notice: { message: 'Order item added successfully', type: 'success' }
              };
            }
          },
          edit: {
            isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin',
            before: async (request) => {
              try {
                if (request.payload.quantity !== undefined) {
                  request.payload.quantity = validateQuantity(request.payload.quantity);
                }
                if (request.payload.price !== undefined) {
                  request.payload.price = validatePrice(request.payload.price);
                }
                
                if (request.payload.productId && request.payload.quantity) {
                  const product = await Product.findByPk(request.payload.productId);
                  if (product && product.stock < request.payload.quantity) {
                    throw new Error(`Insufficient stock! Only ${product.stock} units available`);
                  }
                }
                
                return request;
              } catch (error) {
                throw error;
              }
            }
          },
          delete: { isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin' },
          list: { isAccessible: canAccess('orderItem') },
          show: { isAccessible: canAccess('orderItem') },
        }
      }
    },
    
    // ⚙️ SETTINGS
    {
      resource: Setting,
      options: {
        navigation: { name: 'Configuration' },
        properties: {
          id: { isVisible: { list: false, show: true, edit: false, filter: false }, position: 1 },
          key: {
            isTitle: true,
            isRequired: true,
            position: 2,
            description: 'Unique setting key'
          },
          value: {
            type: 'textarea',
            props: { rows: 3 },
            isRequired: false,
            position: 3,
            description: 'Setting value'
          },
          createdAt: { isVisible: { list: false, show: true, edit: false, filter: false }, position: 4 },
          updatedAt: { isVisible: { list: true, show: true, edit: false, filter: false }, position: 5 }
        },
        listProperties: ['key', 'value', 'updatedAt'],
        showProperties: ['id', 'key', 'value', 'createdAt', 'updatedAt'],
        filterProperties: ['key'],
        editProperties: ['key', 'value'],
        actions: {
          new: {
            isAccessible: canAccess('setting'),
            before: async (request) => {
              try {
                if (!request.payload.key || !request.payload.key.trim()) {
                  throw new Error('Setting key is required');
                }
                
                request.payload.key = request.payload.key.trim().toLowerCase();
                
                const existing = await Setting.findOne({ where: { key: request.payload.key } });
                if (existing) {
                  throw new Error('A setting with this key already exists');
                }
                
                return request;
              } catch (error) {
                throw error;
              }
            },
            after: async (response) => {
              return {
                ...response,
                notice: { message: 'Setting created successfully', type: 'success' }
              };
            }
          },
          edit: {
            isAccessible: canAccess('setting'),
            after: async (response) => {
              return {
                ...response,
                notice: { message: 'Setting updated successfully', type: 'success' }
              };
            }
          },
          delete: { isAccessible: canAccess('setting') },
          list: { isAccessible: canAccess('setting') },
          show: { isAccessible: canAccess('setting') },
        }
      }
    }
  ],
  
  locale: {
    language: 'en',
    translations: {
      en: {
        messages: {
          loginWelcome: 'Welcome to Elite Commerce Dashboard',
        },
        labels: {
          navigation: 'Navigation',
          pages: 'Pages',
          selectedRecords: 'Selected ({{selected}})',
          filters: 'Filters',
          adminVersion: 'v{{version}}',
          dashboard: 'Dashboard',
          loginWelcome: 'Sign in to continue',
        }
      }
    }
  }
});

module.exports = adminJs;
