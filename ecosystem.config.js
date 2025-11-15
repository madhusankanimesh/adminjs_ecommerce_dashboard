module.exports = {
  apps: [{
    name: 'adminjs-ecommerce',
    script: './src/app.js',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: process.env.PORT || 8080
    }
  }]
};
