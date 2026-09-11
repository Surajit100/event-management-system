const express = require("express");

const {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// Public
router.get("/", getEvents);
router.get("/:id", getEvent);

// Admin only
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createEvent
);

// Logged-in user
router.put(
  "/:id",
  authMiddleware,
  updateEvent
);

router.delete(
  "/:id",
  authMiddleware,
  deleteEvent
);

module.exports = router;