import { Sequelize } from 'sequelize';
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME, // Database name
  process.env.DB_USER, // User
  process.env.DB_PASSWORD, // Password
  {
    host: process.env.DB_HOST, // Host
    port: process.env.DB_PORT, // Port
    dialect: 'postgres',
    logging: false, // Disable SQL logs
  }
);

sequelize.authenticate()
  .then(() => console.log('Connected to PostgreSQL!'))
  .catch((err) => console.error('Unable to connect to the database:', err));

export default sequelize;
