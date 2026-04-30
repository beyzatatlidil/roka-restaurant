const express = require("express");
const router = express.Router();

const {
  createReservation,
  getMyReservations,
  getAllReservations,
  deleteReservation,
  updateReservationStatus,
  getReservationsByPhone,
} = require("../controllers/reservationController");

const { protect } = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Public
router.post("/", createReservation);
router.get("/search", getReservationsByPhone);

// User
router.get("/my", protect, getMyReservations);
router.delete("/:id", protect, deleteReservation);

// Admin
router.get("/", protect, adminMiddleware, getAllReservations);
router.put("/:id/status", protect, adminMiddleware, updateReservationStatus);

module.exports = router;
