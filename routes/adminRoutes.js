const express = require("express");
const router = express.Router();

const {
  getAdminDashboard,
  getAdminOrdersPage,
  getAdminReservationsPage,
  getAdminMenuPage,
  getNewMenuPage,
  createMenuItem,
  getEditMenuPage,
  updateMenuItem,
  deleteMenuItem,
  updateOrderStatus,
} = require("../controllers/adminController");

// Dashboard
router.get("/admin", getAdminDashboard);

// Orders
router.get("/admin/orders", getAdminOrdersPage);
router.post("/admin/orders/:id/status", updateOrderStatus);

// Reservations
router.get("/admin/reservations", getAdminReservationsPage);

// Menu Management
router.get("/admin/menu", getAdminMenuPage);
router.get("/admin/menu/new", getNewMenuPage);
router.post("/admin/menu/new", createMenuItem);
router.get("/admin/menu/edit/:id", getEditMenuPage);
router.post("/admin/menu/edit/:id", updateMenuItem);
router.post("/admin/menu/delete/:id", deleteMenuItem);

module.exports = router;
