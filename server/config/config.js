'use strict';

// Read by the app (server/models) and by sequelize-cli (.sequelizerc).
module.exports = {
  development: {
    username: 'postgres',
    password: 'password',
    database: 'poststream_development',
    // CI runs inside a container where Postgres is the "postgres" service
    host: process.env.DB_HOST || 'localhost',
    port: 5432,
    dialect: 'postgres',
    logging: false,
    seederStorage: 'sequelize'
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    seederStorage: 'sequelize'
  }
};
