const User = require("../models/User");
const Menu = require("../models/Menu");
const Order = require("../models/Order");
const Reservation = require("../models/reservationModel");

// Dashboard
const getAdminDashboard = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const orderCount = await Order.countDocuments();
    const reservationCount = await Reservation.countDocuments();
    const menuCount = await Menu.countDocuments();

    res.render("admin/dashboard", {
      userCount,
      orderCount,
      reservationCount,
      menuCount,
    });
  } catch (error) {
    console.log("ADMIN DASHBOARD ERROR:", error);
    res.render("admin/dashboard", {
      userCount: 0,
      orderCount: 0,
      reservationCount: 0,
      menuCount: 0,
    });
  }
};

// Orders
const getAdminOrdersPage = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.render("admin/orders", { orders: orders || [] });
  } catch (error) {
    console.log("ADMIN ORDERS PAGE ERROR:", error);
    res.render("admin/orders", { orders: [] });
  }
};

// Reservations
const getAdminReservationsPage = async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ createdAt: -1 });
    res.render("admin/reservations", { reservations: reservations || [] });
  } catch (error) {
    console.log("ADMIN RESERVATIONS PAGE ERROR:", error);
    res.render("admin/reservations", { reservations: [] });
  }
};

// Menu list
const getAdminMenuPage = async (req, res) => {
  try {
    const menuItems = await Menu.find().sort({ createdAt: -1 });
    res.render("admin/menu", { menuItems: menuItems || [] });
  } catch (error) {
    console.log("ADMIN MENU PAGE ERROR:", error);
    res.render("admin/menu", { menuItems: [] });
  }
};

// New menu page
const getNewMenuPage = async (req, res) => {
  try {
    res.render("admin/newMenu");
  } catch (error) {
    console.log("ADMIN NEW MENU PAGE ERROR:", error);
    res.render("admin/newMenu");
  }
};

// Create menu item
const createMenuItem = async (req, res) => {
  try {
      const { name, description, price, category, image } = req.body;

      const imageUrl = image && image.trim() !== ""
        ? image
        : "https://via.placeholder.com/300x200?text=Food";

    await Menu.create({
      name,
      description,
      price,
      category,
      image: imageUrl,
    });

    res.redirect("/admin/menu");
  } catch (error) {
    console.error(error);
    res.status(500).send("Ürün eklenemedi");
  }
};

// Edit page
const getEditMenuPage = async (req, res) => {
  try {
    const menuItem = await Menu.findById(req.params.id);

    if (!menuItem) {
      return res.render("admin/editMenu", { menuItem: {} });
    }

    res.render("admin/editMenu", { menuItem: menuItem || {} });
  } catch (error) {
    console.log("ADMIN EDIT MENU PAGE ERROR:", error);
    res.render("admin/editMenu", { menuItem: {} });
  }
};

// Update item
const updateMenuItem = async (req, res) => {
  try {
    const { name, description, price, category, image } = req.body;

    await Menu.findByIdAndUpdate(req.params.id, {
      name,
      description,
      price,
      category,
      image,
    });

    res.redirect("/admin/menu");
  } catch (error) {
    console.error(error);
    res.status(500).send("Ürün güncellenemedi");
  }
};

// Delete item
const deleteMenuItem = async (req, res) => {
  try {
    await Menu.findByIdAndDelete(req.params.id);
    res.redirect("/admin/menu");
  } catch (error) {
    console.error(error);
    res.status(500).send("Ürün silinemedi");
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "pending",
      "preparing",
      "out for delivery",
      "delivered",
      "cancelled",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).send("Invalid status");
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).send("Order not found");
    }

    order.status = status;
    await order.save();

    res.redirect("/admin/orders");
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).send("Server Error");
  }
};

module.exports = {
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
};
