const app = require('./src/app');
const { sequelize, testAndConnect } = require('./src/config/database');
const { seedDatabase } = require('./src/seeders/seed');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Authenticate database connection
    await testAndConnect();

    // Sync Sequelize models
    await sequelize.sync({ alter: false });
    console.log('[Database] Models synchronized successfully.');

    // Auto-seed if database is empty
    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`🚀 NEXORA COMPUTERS Server running on port ${PORT}`);
      console.log(`📡 API Base URL: http://localhost:${PORT}/api`);
      console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
      console.log(`====================================================`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
