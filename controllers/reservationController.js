const Reservation = require("../models/reservationModel");

const createReservation = async (req, res) => {
  try {
    const { date, time, guests, phone, specialRequest } = req.body;

    if (!date || !time || !guests || !phone) {
      return res.status(400).json({
        message: "Date, time, guests and phone are required",
      });
    }

    const existingReservations = await Reservation.countDocuments({
      date,
      time,
    });

    if (existingReservations >= 10) {
      return res.status(400).json({
        message: "Restaurant is fully booked for this time slot",
      });
    }

    const reservationData = {
      date,
      time,
      guests,
      phone,
      specialRequest,
    };

    // Kullanıcı giriş yaptıysa rezervasyonu user'a bağla
    if (req.user) {
      reservationData.user = req.user._id;
    }

    const reservation = await Reservation.create(reservationData);

    return res.status(201).json({
      message: "Reservation created successfully",
      reservation,
    });
  } catch (error) {
    console.error("CREATE RESERVATION ERROR:", error);
    return res.status(500).json({
      message: "Failed to create reservation",
      error: error.message,
    });
  }
};

const getMyReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      message: "My reservations fetched successfully",
      reservations,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch user reservations",
      error: error.message,
    });
  }
};

const getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate("user", "name email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "All reservations fetched successfully",
      reservations,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch all reservations",
      error: error.message,
    });
  }
};

const deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        message: "Reservation not found",
      });
    }

    if (
      reservation.user &&
      reservation.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Not authorized to delete this reservation",
      });
    }

    await reservation.deleteOne();

    return res.status(200).json({
      message: "Reservation deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete reservation",
      error: error.message,
    });
  }
};

const getReservationsByPhone = async (req, res) => {
  try {
    const { phone } = req.query;

    const reservations = await Reservation.find({ phone }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      message: "Reservations fetched successfully",
      reservations,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch reservations by phone",
      error: error.message,
    });
  }
};

const updateReservationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        message: "Reservation not found",
      });
    }

    reservation.status = status || reservation.status;

    await reservation.save();

    return res.status(200).json({
      message: "Reservation status updated successfully",
      reservation,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update reservation status",
      error: error.message,
    });
  }
};

module.exports = {
  createReservation,
  getMyReservations,
  getAllReservations,
  deleteReservation,
  updateReservationStatus,
  getReservationsByPhone,
};
