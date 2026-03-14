const Reservation = require("../models/reservationModel");

const createReservation = async (req, res) => {
  try {
      const { date, time, guests, phone, specialRequest } = req.body;
      
      
    if (!date || !time || !guests) {
      return res.status(400).json({
        message: "Date, time and guests are required",
      });
    }
      
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

      const reservation = await Reservation.create({
        date,
        time,
        guests,
        phone,
        specialRequest,
      });
      
      
    res.status(201).json({
      message: "Reservation created successfully",
      reservation,
    });
  } catch (error) {
    res.status(500).json({
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

    res.status(200).json({
      message: "My reservations fetched successfully",
      reservations,
    });
  } catch (error) {
    res.status(500).json({
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

    res.status(200).json({
      message: "All reservations fetched successfully",
      reservations,
    });
  } catch (error) {
    res.status(500).json({
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
      reservation.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Not authorized to delete this reservation",
      });
    }

    await reservation.deleteOne();

    res.status(200).json({
      message: "Reservation deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete reservation",
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

    res.status(200).json({
      message: "Reservation status updated successfully",
      reservation,
    });
  } catch (error) {
    res.status(500).json({
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
};
