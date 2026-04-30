const express = require("express");
const dotenv = require("dotenv");
const path = require("path");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const menuRoutes = require("./routes/menuRoutes");
const orderRoutes = require("./routes/orderRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const adminRoutes = require("./routes/adminRoutes");
const chatRoutes = require("./routes/chatRoutes");
const menuPageRoutes = require("./routes/menuPageRoutes");

const Reservation = require("./models/reservationModel");
const { getMyOrdersPage } = require("./controllers/orderController");

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

// EJS routes
app.use("/", menuPageRoutes);
app.use("/admin", adminRoutes);

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/chat", chatRoutes);

// Pages
app.get("/my-orders", getMyOrdersPage);

app.get("/my-reservations", async (req, res) => {
  try {
    const phone = req.query.phone;

    if (!phone) {
      return res.render("pages/myReservations", { reservations: [] });
    }

    const reservations = await Reservation.find({ phone }).sort({ createdAt: -1 });
    return res.render("pages/myReservations", { reservations: reservations || [] });
  } catch (error) {
    console.log("MY RESERVATIONS PAGE ERROR:", error);
    return res.render("pages/myReservations", { reservations: [] });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
