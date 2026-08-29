import { Umzug, SequelizeStorage } from 'umzug';
import { sequelize, verifyAndConnect } from '../config/database.config';
import logger from '../config/logger.config';
import path from 'path';

export const migrator = new Umzug({
  migrations: {
    glob: path.join(__dirname, '2*.ts')
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: {
    info: (msg) => logger.info(msg),
    warn: (msg) => logger.warn(msg),
    error: (msg) => logger.error(msg),
    debug: (msg) => logger.debug(msg)
  }
});

const runCLI = async (): Promise<void> => {
  await verifyAndConnect();
  const command = process.argv[2] || 'up';
  if (command === 'down') {
    await migrator.down();
    logger.info('[Migrations] Successfully rolled back last migration.');
  } else {
    await migrator.up();
    logger.info('[Migrations] Successfully applied all pending migrations.');
  }
};

if (require.main === module) {
  runCLI().catch((err) => {
    logger.error({ err }, '[Migrations Error]');
    process.exit(1);
  });
}
