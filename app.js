const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const axios = require("axios");

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
app.get("/", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:3000/api/menu");
    const menuItems = response.data.menuItems || response.data;

    res.render("pages/menu", { menuItems });
  } catch (error) {
    console.error("Menu fetch error:", error.message);
    res.render("pages/menu", { menuItems: [] });
  }
});

app.get("/reservation", (req, res) => {
  const success = req.query.success;
  const error = req.query.error;

  res.render("pages/reservation", { success, error });
});

app.get("/my-reservations", (req, res) => {
  res.render("pages/myReservations", { reservations: null });
});

app.post("/my-reservations", async (req, res) => {
  const { phone } = req.body;

  try {
    const response = await axios.get(`http://localhost:3000/api/reservations/phone/${phone}`);

    res.render("pages/myReservations", {
      reservations: response.data
    });

  } catch (error) {
    console.error(error.message);
    res.render("pages/myReservations", { reservations: [] });
  }
});

app.post("/reservation", async (req, res) => {
  try {
    const { date, time, guests, phone, specialRequest } = req.body;

    await axios.post("http://localhost:3000/api/reservations", {
      date,
      time,
      guests,
      phone,
      specialRequest,
    });

    res.redirect("/reservation?success=true");
  } catch (error) {
    console.error(
      "Reservation error full:",
      error.response?.data || error.message
    );
    res.redirect("/reservation?error=true");
  }
});

app.get("/admin", (req, res) => {
  res.render("pages/admin");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
