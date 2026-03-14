const express = require("express");
const router = express.Router();
const Menu = require("../models/Menu");

router.get("/menu", async (req, res) => {
  try {
    const menuItems = await Menu.find().sort({ createdAt: -1 });
    res.render("pages/menu", { menuItems });
  } catch (error) {
    console.error(error);
    res.status(500).send("Menu page yüklenemedi");
  }
});

router.get("/cart", (req, res) => {
  try {
    res.render("pages/cart");
  } catch (error) {
    console.error(error);
    res.status(500).send("Cart page yüklenemedi");
  }
});

router.get("/checkout", (req, res) => {
  try {
    res.render("pages/checkout");
  } catch (error) {
    console.error(error);
    res.status(500).send("Checkout page yüklenemedi");
  }
});

module.exports = router;
