const express = require("express");

const {
  registerForEvent,
  getMyRegistrations,
  cancelRegistration,
} = require("../controllers/registrationController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Register for an event
router.post(
  "/",
  authMiddleware,
  registerForEvent
);

// Get my registered events
router.get(
  "/my",
  authMiddleware,
  getMyRegistrations
);

// Cancel registration
router.delete(
  "/:eventId",
  authMiddleware,
  cancelRegistration
);

module.exports = router;