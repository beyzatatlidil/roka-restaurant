const express = require("express");
const router = express.Router();

const Cart = require("../models/Cart");

// 🔥 ADD TO CART
router.post("/add", async (req, res) => {
  try {
    const { userId, menuItemId, quantity } = req.body;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ menuItemId, quantity }]
      });
    } else {
      const existingItem = cart.items.find(
        item => item.menuItemId.toString() === menuItemId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ menuItemId, quantity });
      }
    }

    await cart.save();

    res.json({ message: "Added to cart", cart });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Cart error" });
  }
});

// 🔥 GET CART
router.get("/:userId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId })
      .populate("items.menuItemId");

    res.json(cart || { items: [] });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Cart error" });
  }
});

module.exports = router;
