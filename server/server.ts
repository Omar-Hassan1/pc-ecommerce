import app from './src/app';
import { sequelize, testAndConnect } from './src/config/database.config';
import { seedDatabase } from './src/seeders/seed.seeder';
import logger from './src/config/logger.config';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async (): Promise<void> => {
  try {
    // Authenticate database connection
    await testAndConnect();

    // Sync Sequelize models
    await sequelize.sync({ alter: false });
    logger.info('[Database] Models synchronized successfully.');

    // Auto-seed if database is empty
    await seedDatabase();

    app.listen(PORT, () => {
      logger.info(`====================================================`);
      logger.info(`🚀 NEXORA COMPUTERS Server running on port ${PORT}`);
      logger.info(`📡 API Base URL: http://localhost:${PORT}/api`);
      logger.info(`🏥 Health Check: http://localhost:${PORT}/health`);
      logger.info(`====================================================`);
    });
  } catch (error: any) {
    logger.error({ error }, 'Failed to start server');
    process.exit(1);
  }
};

startServer();
