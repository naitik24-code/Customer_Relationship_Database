const app = require('./app');
const sequelize = require('./config/database');

const PORT = process.env.PORT || 5000;

// Test Database Connection and start server
sequelize.authenticate()
  .then(() => {
    console.log('✅ Connection to MySQL database has been established successfully.');
    
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode.`);
    });
  })
  .catch(err => {
    console.error('❌ Unable to connect to the database:', err);
    process.exit(1);
  });
