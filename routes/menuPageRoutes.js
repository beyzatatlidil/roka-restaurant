const express = require("express");
const router = express.Router();

// 🔥 MODELİ EKLE (EN ÖNEMLİ KISIM)
const Menu = require("../models/Menu");

// HOME
router.get("/", (req, res) => {
  res.render("pages/home");
});

// MENU (🚀 AXIOS KALDIRILDI → DIREKT DB)
router.get("/menu", async (req, res) => {
  try {
    const menuItems = await Menu.find();

    res.render("pages/menu", {
      menuItems: menuItems || []
    });

  } catch (error) {
    console.log("MENU ERROR:", error);

    res.render("pages/menu", {
      menuItems: []
    });
  }
});

// CHECKOUT
router.get("/checkout", (req, res) => {
  res.render("pages/checkout");
});

// CART
router.get("/cart", (req, res) => {
  res.render("pages/cart");
});

// RESERVATION
router.get("/reservation", (req, res) => {
  res.render("pages/reservation");
});

// LOGIN
router.get("/login", (req, res) => {
  res.render("pages/login");
});

module.exports = router;