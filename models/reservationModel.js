const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
  user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      
    date: {
      type: String,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    guests: {
      type: Number,
      required: true,
      min: 1,
    },

    phone: {
      type: String,
      required: true,
    },

    specialRequest: {
      type: String,
      default: "",
    },

    tableNumber: {
      type: Number,
      default: null,
    },

  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled", "completed"],
    default: "pending",
  },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Reservation", reservationSchema);
