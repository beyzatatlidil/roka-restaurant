const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({
          message: "Kullanıcı bulunamadı",
        });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        message: "Token geçersiz",
        error: error.message,
      });
    }
  } else {
    return res.status(401).json({
      message: "Token yok, erişim reddedildi",
    });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({
      message: "Sadece admin erişebilir",
    });
  }
};

module.exports = { protect, adminOnly };
