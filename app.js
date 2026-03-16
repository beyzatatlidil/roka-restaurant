const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const axios = require("axios");
const Reservation = require("./models/reservationModel");

const connectDB = require("./config/db");
const orderRoutes = require("./routes/orderRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const authRoutes = require("./routes/authRoutes");
const menuRoutes = require("./routes/menuRoutes");
const adminRoutes = require("./routes/adminRoutes");
const menuPageRoutes = require("./routes/menuPageRoutes");
const { getMyOrdersPage } = require("./controllers/orderController");
const chatRoutes = require("./routes/chatRoutes");

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// BODY PARSING MIDDLEWARE ÖNCE GELMELİ
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

// ROUTES
app.use(adminRoutes);
app.use(menuPageRoutes);
app.use("/api", chatRoutes);

// API ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reservations", reservationRoutes);
app.get("/my-orders", getMyOrdersPage);

// FRONTEND ROUTES
app.get("/", (req, res) => {
  res.render("pages/reservation");
});

app.get("/reservation", (req, res) => {
  res.render("pages/reservation");
});

app.get("/menu", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:3000/api/menu");
    const menuItems = response.data.menuItems || response.data;

    res.render("pages/menu", { menuItems });
  } catch (error) {
    console.error("Menu fetch error:", error.message);
    res.render("pages/menu", { menuItems: [] });
  }
});

app.get("/my-reservations", async (req, res) => {
  try {
    const phone = req.query.phone;

    if (!phone) {
      return res.render("pages/myReservations", { reservations: null });
    }

    const reservations = await Reservation.find({ phone }).sort({ createdAt: -1 });

    return res.render("pages/myReservations", { reservations });
  } catch (error) {
    console.error("MY RESERVATIONS PAGE ERROR:", error.message);
    return res.render("pages/myReservations", { reservations: [] });
  }
});

app.get("/login", (req, res) => {
  res.render("pages/login");
});

app.get("/login", (req, res) => {
  res.render("pages/login");
});


app.get("/admin", (req, res) => {
  res.render("pages/admin");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
