const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    phone: {
      type: String,
      required: true,
      trim: true
    },

    date: {
      type: String,
      required: true
    },

    time: {
      type: String,
      required: true
    },

    guests: {
      type: Number,
      required: true,
      min: 1,
      max: 12
    },

    specialRequest: {
      type: String,
      default: ""
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending"
    },

    reservationCode: {
      type: String,
      unique: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reservation", reservationSchema);
