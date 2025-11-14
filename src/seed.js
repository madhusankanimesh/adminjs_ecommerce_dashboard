const bcrypt = require('bcrypt');
const { initDB, User } = require('./models');
require('dotenv').config();

const seed = async () => {
  await initDB();
  
  const adminEmail = 'admin@ecommerce.com';
  
  const existingAdmin = await User.findOne({ where: { email: adminEmail } });
  
  if (!existingAdmin) {
    const hashed = await bcrypt.hash('admin123', 10);
    await User.create({ 
      name: 'System Administrator',
      email: adminEmail, 
      password: hashed, 
      role: 'admin' 
    });
    console.log('✅ Admin user created:', adminEmail, '/ admin123');
  } else {
    console.log('ℹ️  Admin user already exists');
  }
  
  console.log('\n✓ Seed completed successfully');
  console.log('📝 Use AdminJS to add products, categories, and other data manually');
  
  process.exit(0);
};

seed();
