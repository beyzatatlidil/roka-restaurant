const express = require("express");
const router = express.Router();

const menuController = require("../controllers/menuController");
const { protect } = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Public
router.get("/", menuController.getMenuItems);
router.get("/:id", menuController.getMenuItemById);

// Admin
router.post("/", protect, adminMiddleware, menuController.createMenuItem);
router.put("/:id", protect, adminMiddleware, menuController.updateMenuItem);
router.delete("/:id", protect, adminMiddleware, menuController.deleteMenuItem);

module.exports = router;