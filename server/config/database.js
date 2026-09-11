const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    logging: false,
  }
);

const connectDatabase = async () => {
  try {
    await sequelize.authenticate();

    console.log(
      "Sequelize: MySQL Database Connected Successfully"
    );
  } catch (error) {
    console.error(
      "Sequelize: Database Connection Failed:",
      error.message
    );

    throw error;
  }
};

module.exports = {
  sequelize,
  connectDatabase,
};