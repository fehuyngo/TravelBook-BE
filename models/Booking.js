const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tour: { type: mongoose.Schema.Types.ObjectId, ref: "Tour", required: true },
  date: { type: Date, required: true }, // Ngày đi
  guests: { type: Number, required: true }, // Số lượng khách
  totalPrice: { type: Number, required: true }, // Tổng giá
  status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
