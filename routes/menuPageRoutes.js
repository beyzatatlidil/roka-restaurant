const express = require("express");
const router = express.Router();
const axios = require("axios");

// HOME
router.get("/", (req, res) => {
  res.render("pages/home");
});

// MENU
router.get("/menu", async (req, res) => {
  try {
    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
    const response = await axios.get(`${baseUrl}/api/menu`);
    const menuItems = response.data.menuItems || response.data;

    res.render("pages/menu", { menuItems });
  } catch (error) {
    res.render("pages/menu", { menuItems: [] });
  }
});

// CART PAGE
router.get("/cart", (req, res) => {
  res.render("pages/cart");
});

// RESERVATION PAGE
router.get("/reservation", (req, res) => {
  res.render("pages/reservation");
});

router.get("/login", (req, res) => {
  res.render("pages/login");
});

module.exports = router;
