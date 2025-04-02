require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");

const tourRoutes = require("./routes/tourRoutes");
const userRoutes = require("./routes/userRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Kết nối MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Route mặc định
app.get("/", (req, res) => {
  res.send("Welcome to TravelBook API 🚀");
});
app.use("/api/tours", tourRoutes);
app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes);

// Chạy server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
