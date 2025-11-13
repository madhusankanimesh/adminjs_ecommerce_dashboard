const express = require('express');
const AdminJS = require('adminjs').default;
const AdminJSExpress = require('@adminjs/express');
const adminJs = require('./admin/admin');
const { initDB } = require('./models');
const authRoutes = require('./routes/auth');
const verifyJwt = require('./middleware/verifyJwt');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(require('cors')());

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'E-Commerce Admin API',
    endpoints: {
      login: 'POST /api/login',
      admin: 'GET /admin (requires authentication)',
      health: 'GET /health'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API
app.use('/api', authRoutes);

// Build a router that sets currentAdmin for AdminJS
const adminRouter = AdminJSExpress.buildRouter(adminJs);

// Mount admin panel without strict JWT verification
// AdminJS will render its own interface
app.use('/admin', adminRouter);

const start = async () => {
  await initDB();
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Server started on ${port}`));
};

start();
