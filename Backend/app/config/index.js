const Sequelize = require("sequelize");
const config = {
  app: {
    port: process.env.PORT || 3000,
  },
};

// Khởi tạo kết nối database
const sequelize = new Sequelize("homelight", "root", "#NguyenAnh1111", {
  host: "localhost",
  dialect: "mysql",
});

// connect to the database
const connection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

// auto create table
const createTable = async () => {
  try {
    await sequelize.sync();
    console.log("Tables created successfully");
  } catch (error) {
    console.error("Error creating tables:", error);
  }
};
// createTable();
module.exports = { config, connection, sequelize, createTable };
