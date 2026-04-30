const Order = require("../models/Order");

// 🔥 CREATE ORDER
const createOrder = async (req, res) => {
  try {
    const { orderItems, totalPrice, deliveryAddress, phone } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "Sipariş ürünleri boş olamaz" });
    }

    if (!deliveryAddress) {
      return res.status(400).json({ message: "Teslimat adresi zorunludur" });
    }

    if (!phone) {
      return res.status(400).json({ message: "Telefon numarası zorunludur" });
    }

    const newOrder = await Order.create({
      user: req.user ? req.user._id : null,
      orderItems,
      totalPrice,
      deliveryAddress,
      phone,
      status: "pending",
    });

    return res.status(201).json({
      message: "Sipariş oluşturuldu",
      order: newOrder,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Sipariş oluşturulamadı",
      error: error.message,
    });
  }
};

// 🔥 TELEFONA GÖRE
const getOrdersByPhone = async (req, res) => {
  try {
    const { phone } = req.query;

    if (!phone) {
      return res.status(400).json({ message: "Telefon numarası gerekli" });
    }

    const orders = await Order.find({ phone }).sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Siparişler getirildi",
      orders,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Siparişler getirilemedi",
      error: error.message,
    });
  }
};

// 🔥 MY ORDERS PAGE (FIX)
const getMyOrdersPage = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    res.render("pages/myOrders", { orders });
  } catch (error) {
    console.error(error);
    res.render("pages/myOrders", { orders: [] });
  }
};

// 🔥 ADMIN
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Tüm siparişler getirildi",
      orders,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Siparişler getirilemedi",
      error: error.message,
    });
  }
};

// 🔥 STATUS UPDATE
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = [
      "pending",
      "preparing",
      "out for delivery",
      "delivered",
      "cancelled",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Geçersiz sipariş durumu" });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Sipariş bulunamadı" });
    }

    order.status = status;
    const updatedOrder = await order.save();

    return res.status(200).json({
      message: "Sipariş durumu güncellendi",
      order: updatedOrder,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Sipariş durumu güncellenemedi",
      error: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getOrdersByPhone,
  getMyOrdersPage,
  getAllOrders,
  updateOrderStatus,
};
