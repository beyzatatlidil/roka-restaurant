const express = require("express");
const router = express.Router();

const {
  createOrder,
  getOrdersByPhone,
  getMyOrdersPage,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

const { protect } = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// USER
router.post("/", protect, createOrder);
router.get("/search", getOrdersByPhone);
router.get("/my-orders", getMyOrdersPage);

// ADMIN
router.get("/", protect, adminMiddleware, getAllOrders);
router.put("/:id/status", protect, adminMiddleware, updateOrderStatus);

module.exports = router;
