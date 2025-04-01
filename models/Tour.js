const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: Number, required: true }, // Thời gian (số ngày)
  description: { type: String },
  image: { type: String }, // URL ảnh
}, { timestamps: true });

module.exports = mongoose.model("Tour", tourSchema);
