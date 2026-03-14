const express = require("express");
const router = express.Router();
const Reservation = require("../models/reservationModel");

const {
  createReservation,
  getMyReservations,
  getAllReservations,
  deleteReservation,
  updateReservationStatus,
} = require("../controllers/reservationController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/", createReservation);router.get("/my", protect, getMyReservations);
router.get("/", protect, adminOnly, getAllReservations);
router.delete("/:id", protect, deleteReservation);
router.put("/:id/status", protect, adminOnly, updateReservationStatus);

router.get("/phone/:phone", async (req, res) => {
  try {
    const reservations = await Reservation.find({ phone: req.params.phone });

    res.json(reservations);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch reservations"
    });
  }
});

module.exports = router;
