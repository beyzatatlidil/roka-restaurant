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
router.get("/", getAdminDashboard);

// Orders
router.get("/orders", getAdminOrdersPage);
router.post("/orders/:id/status", updateOrderStatus);

// Reservations
router.get("/reservations", getAdminReservationsPage);

// Menu
router.get("/menu", getAdminMenuPage);
router.get("/menu/new", getNewMenuPage);
router.post("/menu/new", createMenuItem);
router.get("/menu/edit/:id", getEditMenuPage);
router.post("/menu/edit/:id", updateMenuItem);
router.post("/menu/delete/:id", deleteMenuItem);

// Login
router.get("/login", (req, res) => {
  res.render("admin/login");
});

module.exports = router;
