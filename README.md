# Role-Based eCommerce Admin Dashboard

A **professional, secure, and feature-rich** admin panel for eCommerce management built with **AdminJS**, **Sequelize ORM**, and **PostgreSQL**. This project demonstrates enterprise-level authentication, role-based access control, and a beautiful, intuitive admin interface.

---

## Key Features

###  Security & Authentication
- **JWT-based API authentication** for RESTful endpoints
- **Session-based authentication** for AdminJS interface
- **Bcrypt password hashing** for secure credential storage
- **Role-based access control (RBAC)** with granular permissions
- **HTTP-only cookies** for session management

### Role Management
#### Admin Users
- Full access to all resources and features
- User management (create, edit, delete users)
- Complete control over products, categories, and orders
- Access to system settings and configuration
- Comprehensive analytics dashboard with:
  - Total users, orders, products, and revenue
  - Order status breakdown
  - Low stock alerts
  - Recent order history

#### Regular Users
- View-only access to products and categories
- Can view and manage orders
- Personal dashboard showing:
  - Order history
  - Total spending
  - Pending orders
- Restricted from user management and system settings

###  Dashboard & Analytics
- **Dynamic dashboard** that adapts based on user role
- Real-time statistics and KPIs
- Visual indicators with emojis for better UX
- Recent activity tracking
- Low stock product alerts for admins

###  User Interface
- **Modern, professional design** with custom indigo theme
- **Organized navigation** with emoji icons
- **Responsive layout** that works on all devices
- **Intuitive data management** with filters and search
- **Relational data visualization** with proper foreign key references

---

##  Quick Start

### Prerequisites
- **Node.js** (v14 or higher)
- **PostgreSQL** (v12 or higher)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/madhusankanimesh/adminjs_ecommerce_dashboard.git
   cd adminjs_ecommerce_dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Update `.env` file with your database credentials:
   ```env
   PORT=3000
   DB_NAME=adminjs_db
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_HOST=localhost
   DB_PORT=5432
   JWT_SECRET=your-super-secret-jwt-key
   FORCE_DB_SYNC=true
   NODE_ENV=development
   ```

4. **Create PostgreSQL database**
   ```bash
   psql -U postgres
   CREATE DATABASE adminjs_db;
   \q
   ```

5. **Start the application**
   ```bash
   npm start
   ```

   The server will automatically:
   - Connect to PostgreSQL
   - Create all tables
   - Seed sample data (when `FORCE_DB_SYNC=true`)
   - Start on `http://localhost:3000`

---

##  Default Credentials

### Administrator Account
- **Email:** `admin@ecommerce.com`
- **Password:** `admin123`
- **Permissions:** Full access to all features

### Regular User Account
- **Email:** `user@ecommerce.com`
- **Password:** `user123`
- **Permissions:** Limited access (view products, manage own orders)

---

## Project Structure

```
adminjs_ecommerce_dashboard/
├── src/
│   ├── admin/
│   │   └── admin.js              # AdminJS configuration
│   ├── config/
│   │   └── database.js           # PostgreSQL connection
│   ├── middleware/
│   │   └── verifyJwt.js          # JWT verification middleware
│   ├── models/
│   │   ├── index.js              # Model associations & DB init
│   │   ├── user.js               # User model
│   │   ├── product.js            # Product model
│   │   ├── category.js           # Category model
│   │   ├── order.js              # Order model
│   │   ├── orderItem.js          # OrderItem model
│   │   └── setting.js            # Setting model
│   ├── routes/
│   │   └── auth.js               # Authentication routes
│   ├── app.js                    # Express server setup
│   └── seed.js                   # Database seeding script
├── .env                          # Environment variables
├── package.json                  # Dependencies
└── README.md                     # This file
```

---

## 🗄️ Database Schema

### User
- `id` - Primary key
- `name` - User's full name
- `email` - Unique email address
- `password` - Bcrypt hashed password
- `role` - Enum: 'admin' | 'user'

### Category
- `id` - Primary key
- `name` - Category name
- `description` - Category description

### Product
- `id` - Primary key
- `name` - Product name
- `description` - Product details
- `price` - Product price (decimal)
- `stock` - Available quantity
- `categoryId` - Foreign key → Category

### Order
- `id` - Primary key
- `userId` - Foreign key → User
- `status` - Enum: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
- `total` - Order total amount

### OrderItem
- `id` - Primary key
- `orderId` - Foreign key → Order
- `productId` - Foreign key → Product
- `quantity` - Item quantity
- `price` - Price at time of order

### Setting
- `id` - Primary key
- `key` - Setting key (unique)
- `value` - Setting value

---

## 🔌 API Endpoints

### Authentication
```http
POST /api/login
Content-Type: application/json

{
  "email": "admin@ecommerce.com",
  "password": "admin123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Admin Panel
```
GET /admin
- Requires authentication via login form
- Session-based authentication
- Redirects to login if not authenticated
```

### Health Check
```http
GET /health

Response:
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "database": "PostgreSQL",
  "environment": "development"
}
```

---

## Features Demonstration

### 1. Role-Based Access Control
- **Admin** can see all 6 resources: Users, Products, Categories, Orders, OrderItems, Settings
- **Regular User** can only see 4 resources: Products, Categories, Orders, OrderItems
- Settings and User management are hidden from regular users

### 2. Smart Database Initialization
- Set `FORCE_DB_SYNC=true` to recreate database with sample data
- Set `FORCE_DB_SYNC=false` for production (preserves existing data)
- Auto-generates realistic sample data:
  - 2 users (1 admin, 1 regular)
  - 3 categories
  - 7 products with varying stock levels
  - 2 sample orders with items
  - 6 system settings

### 3. Custom Dashboard
- **Admin Dashboard**: System-wide analytics and insights
- **User Dashboard**: Personal order history and stats
- Real-time data pulled from PostgreSQL

### 4. Password Security
- Passwords are never visible in any view
- Automatic bcrypt hashing on user creation and updates
- Secure session management with HTTP-only cookies

### 5. Relational Data
- Products linked to categories
- Orders linked to users (customers)
- OrderItems linked to both orders and products
- Proper cascade handling

---

## 🛠️ Development Commands

```bash
# Start development server with auto-reload
npm run dev

# Start production server
npm start

# Seed database with users only
npm run seed

# Recreate database with full sample data
# Set FORCE_DB_SYNC=true in .env, then:
npm start
```

---

## Customization

### Changing Theme Colors
Edit `src/admin/admin.js`:
```javascript
theme: {
  colors: {
    primary100: '#6366F1',  // Change to your brand color
    accent: '#10B981',       // Change accent color
    // ... more colors
  }
}
```

### Adding New Resources
1. Create model in `src/models/`
2. Add associations in `src/models/index.js`
3. Register resource in `src/admin/admin.js`
4. Set role-based permissions using `canAccess()`

---

## Security Best Practices

 **Implemented:**
- Password hashing with bcrypt
- JWT for API authentication
- Session-based auth for AdminJS
- HTTP-only cookies
- Role-based access control
- Environment variable configuration
- SQL injection prevention (Sequelize ORM)

  **For Production:**
- Change `JWT_SECRET` to a strong random value
- Set `NODE_ENV=production`
- Enable HTTPS
- Use strong database passwords
- Implement rate limiting
- Add CSRF protection
- Set up proper logging

---

## 📦Technologies Used

- **Backend:** Node.js + Express.js
- **Admin Panel:** AdminJS v7
- **ORM:** Sequelize v6
- **Database:** PostgreSQL
- **Authentication:** JWT + express-session
- **Password Hashing:** bcrypt
- **Environment:** dotenv

---

##  Troubleshooting

### Database Connection Error
```bash
# Make sure PostgreSQL is running
# On macOS:
brew services start postgresql

# On Linux:
sudo systemctl start postgresql
```

### Port Already in Use
```bash
# Change PORT in .env file
PORT=4000
```

### Tables Not Created
```bash
# Set FORCE_DB_SYNC=true in .env
# This will recreate all tables (WARNING: deletes existing data)
```

---

**Nimesh Madhusanka**

- GitHub: [@madhusankanimesh](https://github.com/madhusankanimesh)
- Repository: [adminjs_ecommerce_dashboard](https://github.com/madhusankanimesh/adminjs_ecommerce_dashboard)

---

