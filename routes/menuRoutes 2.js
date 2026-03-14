const express = require("express");
const router = express.Router();

const menuController = require("../controllers/menuController");
const { protect } = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.get("/", menuController.getMenuItems);
router.post("/", protect, adminMiddleware, menuController.createMenuItem);

router.get("/:id", menuController.getMenuItemById);
router.put("/:id", protect, adminMiddleware, menuController.updateMenuItem);
router.delete("/:id", protect, adminMiddleware, menuController.deleteMenuItem);

module.exports = router;
