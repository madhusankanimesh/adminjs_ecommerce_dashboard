const express = require('express');
const AdminJS = require('adminjs').default;
const AdminJSExpress = require('@adminjs/express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const adminJs = require('./admin/admin');
const { initDB, User } = require('./models');
const authRoutes = require('./routes/auth');
require('dotenv').config();

const app = express();

// Trust proxy - IMPORTANT for production hosting (Heroku, Render, etc.)
app.set('trust proxy', 1);

app.use(express.json());

// CORS configuration for production
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(require('cors')(corsOptions));

// 🔍 Add error logging middleware
app.use((req, res, next) => {
  const originalJson = res.json;
  res.json = function(data) {
    if (req.url.includes('/admin/api') && res.statusCode >= 400) {
      console.error('❌ AdminJS Error:', {
        url: req.url,
        method: req.method,
        status: res.statusCode,
        error: data
      });
    }
    return originalJson.call(this, data);
  };
  next();
});

// Session middleware for AdminJS authentication
app.use(session({
  secret: process.env.JWT_SECRET || 'supersecret-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Important for hosted environments
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  },
  proxy: true // Trust the reverse proxy
}));

// Root route
app.get('/', (req, res) => {
  res.json({
    message: '🛍️ eCommerce Admin API',
    version: '1.0.0',
    endpoints: {
      admin: 'GET /admin (AdminJS Interface - requires login)',
      login: 'POST /api/login (JWT Authentication)',
      health: 'GET /health'
    },
    credentials: {
      admin: { email: 'admin@ecommerce.com', password: 'admin123' }
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: 'PostgreSQL',
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api', authRoutes);

// 🔐 Secure AdminJS with authentication
const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
  adminJs,
  {
    authenticate: async (email, password) => {
      console.log('🔐 Login attempt for:', email);
      const user = await User.findOne({ where: { email } });
      
      if (!user) {
        console.log('❌ Login failed: User not found -', email);
        return null;
      }
      
      const isValid = await bcrypt.compare(password, user.password);
      
      if (!isValid) {
        console.log('❌ Login failed: Invalid password for -', email);
        return null;
      }
      
      console.log(`✅ ${user.role.toUpperCase()} logged in: ${user.email}`);
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      };
    },
    cookieName: 'adminjs',
    cookiePassword: process.env.JWT_SECRET || 'supersecret-change-in-production',
  },
  null,
  {
    resave: false,
    saveUninitialized: false,
    secret: process.env.JWT_SECRET || 'supersecret-change-in-production',
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    },
    proxy: true
  }
);

app.use(adminJs.options.rootPath, adminRouter);

const start = async () => {
  try {
    console.log('🔌 Connecting to database...');
    await initDB();
    console.log('✅ Database connected successfully!');
    
    const port = process.env.PORT || 3000;
    const host = process.env.HOST || '0.0.0.0'; // Azure requires 0.0.0.0
    
    app.listen(port, host, () => {
      console.log('\n🚀 Server started successfully!');
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📍 Server URL: http://${host}:${port}`);
      console.log(`🎛️  Admin Panel: http://${host}:${port}/admin`);
      console.log(`🔐 API Login: POST http://${host}:${port}/api/login`);
      console.log('\n💡 TIP: Set FORCE_DB_SYNC=true to recreate database with sample data\n');
    });
  } catch (error) {
    console.error('❌ Server failed to start:', error);
    console.error('Error details:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
};

start();

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});
