const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "Bu email zaten kayıtlı",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || "customer",
    });

    return res.status(201).json({
      message: "Kayıt başarılı",
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server hatası",
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      return res.status(200).json({
        message: "Giriş başarılı",
        token: generateToken(user._id),
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      return res.status(401).json({
        message: "Email veya şifre hatalı",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Server hatası",
      error: error.message,
    });
  }
};

const getProfile = async (req, res) => {
  try {
    return res.status(200).json({
      message: "Profil bilgileri getirildi",
      user: req.user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server hatası",
      error: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
};
