const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { sequelize, connectDatabase } = require("./config/database");

// Load models and relationships
require("./models");

// Routes
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const registrationRoutes = require("./routes/registrationRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/admin", adminRoutes);

// API status
app.get("/", (req, res) => {
  res.json({
    message: "Event Management API is running",
    database: "MySQL + Sequelize",
  });
});

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    await connectDatabase();

    // Create database tables from Sequelize models
    await sequelize.sync();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Sequelize server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);

    process.exit(1);
  }
};

startServer();