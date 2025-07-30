const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const sequelize = require("./config/database.js");
const profileRoutes = require("./routes/profiles.js");

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares to handle requests
app.use(cors());
app.use(bodyParser.json());
app.use("/api/profiles", profileRoutes);

//Connect to DB and start server
async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("✅ Connected to PostgreSQL");

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Could not start server:", error.message);
  }
}

start();
