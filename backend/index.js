const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const sequelize = require("./config/db.js");
const profileRoutes = require("./routes/profiles.route.js");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/api/profiles", profileRoutes);

// Initialize database and start server
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("PostgreSQL database connection established successfully.");

    await sequelize.sync({ force: false });
    console.log("Database synchronized successfully.");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Database: PostgreSQL`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("Unable to start server:", error);
    console.error(
      "Make sure PostgreSQL is running and credentials are correct"
    );
  }
}

startServer();
