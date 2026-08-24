const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

const dialect = process.env.DB_DIALECT || 'postgres';

let sequelize;

if (dialect === 'postgres') {
  sequelize = new Sequelize(
    process.env.DB_NAME || 'nexora_computers',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || 'postgres',
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      logging: false,
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  );
} else {
  // SQLite mode for development/standalone environments
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DB_STORAGE || path.join(__dirname, '../../database.sqlite'),
    logging: false
  });
}

// Graceful connection check with fallback to sqlite if postgres is not active locally
const testAndConnect = async () => {
  try {
    await sequelize.authenticate();
    console.log(`[Database] Connected successfully using ${sequelize.getDialect().toUpperCase()} dialect.`);
  } catch (error) {
    if (dialect === 'postgres') {
      console.warn(`[Database Warning] PostgreSQL connection failed: (${error.message}). Falling back to SQLite for seamless execution.`);
      sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: path.join(__dirname, '../../database.sqlite'),
        logging: false
      });
      await sequelize.authenticate();
      console.log(`[Database] Connected using fallback SQLite dialect.`);
    } else {
      throw error;
    }
  }
};

module.exports = { sequelize, testAndConnect };
