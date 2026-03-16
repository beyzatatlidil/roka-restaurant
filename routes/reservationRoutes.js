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

const { protect, adminOnly } = require("../middleware/authMiddleware");

// Guest de rezervasyon oluşturabilsin
router.post("/", createReservation);
// Telefon numarasıyla rezervasyon arama
router.get("/search", getReservationsByPhone);

// Giriş yapan kullanıcı kendi rezervasyonlarını görsün
router.get("/my", protect, getMyReservations);

// Admin tüm rezervasyonları görsün
router.get("/", protect, adminOnly, getAllReservations);

// Admin rezervasyon durumunu güncellesin
router.put("/:id/status", protect, adminOnly, updateReservationStatus);

// Kullanıcı kendi rezervasyonunu, admin ise her rezervasyonu silebilsin
router.delete("/:id", protect, deleteReservation);

module.exports = router;
