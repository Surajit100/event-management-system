const express = require("express");

const {
  getAllRegistrations,
} = require("../controllers/adminController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

router.get(
  "/registrations",
  authMiddleware,
  adminMiddleware,
  getAllRegistrations
);

module.exports = router;