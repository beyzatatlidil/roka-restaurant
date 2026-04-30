const Reservation = require("../models/reservationModel");
const generateReservationCode = require("../utils/generateReservationCode");

const parseReservationDate = (dateString) => {
  if (!dateString || typeof dateString !== "string") return null;

  const trimmedDate = dateString.trim();

  // YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmedDate)) {
    const [year, month, day] = trimmedDate.split("-").map(Number);
    const parsed = new Date(year, month - 1, day);

    if (
      parsed.getFullYear() === year &&
      parsed.getMonth() === month - 1 &&
      parsed.getDate() === day
    ) {
      return parsed;
    }

    return null;
  }

  // DD.MM.YYYY
  if (/^\d{2}\.\d{2}\.\d{4}$/.test(trimmedDate)) {
    const [day, month, year] = trimmedDate.split(".").map(Number);
    const parsed = new Date(year, month - 1, day);

    if (
      parsed.getFullYear() === year &&
      parsed.getMonth() === month - 1 &&
      parsed.getDate() === day
    ) {
      return parsed;
    }

    return null;
  }

  return null;
};

const normalizeDateForDb = (dateObj) => {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const isValidTimeFormat = (timeString) => {
  if (!timeString || typeof timeString !== "string") return false;
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(timeString.trim());
};

const createReservation = async (req, res) => {
  try {
    const { name, date, time, guests, phone, specialRequest } = req.body;

    console.log("REQ BODY:", req.body);

    if (!name || !date || !time || !guests || !phone) {
      return res.status(400).json({
        message: "Name, date, time, guests and phone are required",
      });
    }

    const parsedDate = parseReservationDate(date);

    if (!parsedDate) {
      return res.status(400).json({
        message: "Invalid date format",
      });
    }

    if (!isValidTimeFormat(time)) {
      return res.status(400).json({
        message: "Invalid time format. Expected HH:MM",
      });
    }

    const guestCount = Number(guests);

    if (!Number.isInteger(guestCount) || guestCount <= 0) {
      return res.status(400).json({
        message: "Guests must be a positive integer",
      });
    }

    const normalizedDate = normalizeDateForDb(parsedDate);

    const now = new Date();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDayOnly = new Date(parsedDate);
    selectedDayOnly.setHours(0, 0, 0, 0);

    if (selectedDayOnly < today) {
      return res.status(400).json({
        message: "Past dates cannot be selected",
      });
    }

    const isToday =
      selectedDayOnly.getFullYear() === today.getFullYear() &&
      selectedDayOnly.getMonth() === today.getMonth() &&
      selectedDayOnly.getDate() === today.getDate();

    if (isToday) {
      const currentHours = String(now.getHours()).padStart(2, "0");
      const currentMinutes = String(now.getMinutes()).padStart(2, "0");
      const currentTimeStr = `${currentHours}:${currentMinutes}`;

      console.log("TIME FROM FORM:", time);
      console.log("CURRENT TIME:", currentTimeStr);
      console.log("TIME < CURRENT ?", time < currentTimeStr);

      if (time.trim() < currentTimeStr) {
        return res.status(400).json({
          message: "Past time cannot be selected for today",
        });
      }
    }

    const duplicateReservation = await Reservation.findOne({
      phone: String(phone).trim(),
      date: normalizedDate,
      time: time.trim(),
      status: { $in: ["pending", "confirmed"] },
    });

    if (duplicateReservation) {
      return res.status(409).json({
        message:
          "A reservation already exists for this phone number at the selected time",
      });
    }

    const existingReservations = await Reservation.find({
      date: normalizedDate,
      time: time.trim(),
      status: { $in: ["pending", "confirmed"] },
    });

    const totalGuestsForSlot = existingReservations.reduce((sum, reservation) => {
      return sum + Number(reservation.guests || 0);
    }, 0);

    if (totalGuestsForSlot + guestCount > 40) {
      return res.status(400).json({
        message: "Restaurant is fully booked for this time slot",
      });
    }

    const reservationData = {
      name: String(name).trim(),
      phone: String(phone).trim(),
      date: normalizedDate,
      time: time.trim(),
      guests: guestCount,
      specialRequest: specialRequest ? String(specialRequest).trim() : "",
      reservationCode: generateReservationCode(),
    };

    if (req.user && req.user._id) {
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
    console.error("GET MY RESERVATIONS ERROR:", error);
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
    console.error("GET ALL RESERVATIONS ERROR:", error);
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
      req.user &&
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
    console.error("DELETE RESERVATION ERROR:", error);
    return res.status(500).json({
      message: "Failed to delete reservation",
      error: error.message,
    });
  }
};

const getReservationsByPhone = async (req, res) => {
  try {
    const { phone } = req.query;

    if (!phone) {
      return res.status(400).json({
        message: "Phone is required",
      });
    }

    const reservations = await Reservation.find({
      phone: String(phone).trim(),
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      message: "Reservations fetched successfully",
      reservations,
    });
  } catch (error) {
    console.error("GET RESERVATIONS BY PHONE ERROR:", error);
    return res.status(500).json({
      message: "Failed to fetch reservations by phone",
      error: error.message,
    });
  }
};

const updateReservationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = ["pending", "confirmed", "cancelled", "completed"];

    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid reservation status",
      });
    }

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
    console.error("UPDATE RESERVATION STATUS ERROR:", error);
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