import { Dialect, Sequelize } from 'sequelize';

const config = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  dialect: 'postgres' as Dialect,
};

if (Object.values(config).some((val) => !val)) {
  console.error('Error: Missing environment variables for database connection');
}

const sequelize = new Sequelize(config.database!, config.username!, config.password!, {
  host: config.host,
  port: config.port,
  dialect: config.dialect,
});

export default sequelize;
