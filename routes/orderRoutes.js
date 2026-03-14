const express = require("express");
const router = express.Router();

const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  getMyOrdersPage,
} = require("../controllers/orderController");

const { protect } = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Sipariş oluştur
router.post("/", createOrder);
// Kullanıcının siparişleri
router.get("/myorders", getMyOrders);
// Tüm siparişler (admin)
router.get("/", protect, adminMiddleware, getAllOrders);
router.put("/:id/status", protect, adminMiddleware, updateOrderStatus);

router.get("/my-orders", protect, getMyOrdersPage);

module.exports = router;
