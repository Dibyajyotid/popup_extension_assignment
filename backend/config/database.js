// We use Sequelize to connect to PostgreSQL
const { Sequelize } = require("sequelize")
require("dotenv").config()

// Setup connection
const sequelize = new Sequelize(
  process.env.DB_NAME || "linkedin_scraper",
  process.env.DB_USER || "postgres",
  process.env.DB_PASSWORD || "password",
  {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
    logging: false, // Turn off logs to keep it clean
  }
)

module.exports = sequelize
