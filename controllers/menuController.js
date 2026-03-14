const Menu = require("../models/Menu");

const createMenuItem = async (req, res) => {
  try {
    const { name, description, price, category, image, isAvailable } = req.body;

    const menuItem = await Menu.create({
      name,
      description,
      price,
      category,
      image,
      isAvailable,
    });

    res.status(201).json({
      message: "Menü ürünü oluşturuldu",
      menuItem,
    });
  } catch (error) {
    res.status(500).json({
      message: "Menü ürünü oluşturulamadı",
      error: error.message,
    });
  }
};

const getMenuItems = async (req, res) => {
  try {
    const menuItems = await Menu.find();

    res.status(200).json({
      message: "Menü getirildi",
      count: menuItems.length,
      menuItems,
    });
  } catch (error) {
    res.status(500).json({
      message: "Menü getirilemedi",
      error: error.message,
    });
  }
};
const getMenuItemById = async (req, res) => {
  try {
    const menuItem = await Menu.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        message: "Ürün bulunamadı",
      });
    }

    res.status(200).json({
      message: "Menü ürünü getirildi",
      menuItem,
    });
  } catch (error) {
    res.status(500).json({
      message: "Ürün getirilemedi",
      error: error.message,
    });
  }
};

const updateMenuItem = async (req, res) => {
  try {
    const menuItem = await Menu.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!menuItem) {
      return res.status(404).json({
        message: "Ürün bulunamadı",
      });
    }

    res.status(200).json({
      message: "Menü ürünü güncellendi",
      menuItem,
    });
  } catch (error) {
    res.status(500).json({
      message: "Ürün güncellenemedi",
      error: error.message,
    });
  }
};

const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await Menu.findByIdAndDelete(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        message: "Ürün bulunamadı",
      });
    }

    res.status(200).json({
      message: "Menü ürünü silindi",
      menuItem,
    });
  } catch (error) {
    res.status(500).json({
      message: "Ürün silinemedi",
      error: error.message,
    });
  }
};

module.exports = {
  createMenuItem,
  getMenuItems,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
};
