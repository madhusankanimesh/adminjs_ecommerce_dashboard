const bcrypt = require('bcrypt');
const { initDB, User } = require('./models');
require('dotenv').config();

const seed = async () => {
  await initDB();
  const email = 'admin@example.com';
  const existing = await User.findOne({ where: { email } });
  if (!existing) {
    const hashed = await bcrypt.hash('admin123', 10);
    await User.create({ email, password: hashed, role: 'admin' });
    console.log('Admin user created:', email, 'password: admin123');
  } else {
    console.log('Admin user already exists');
  }
  process.exit(0);
};

seed();
