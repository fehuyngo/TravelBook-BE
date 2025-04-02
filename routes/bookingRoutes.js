const express = require("express");
const Booking = require("../models/Booking");
const Tour = require("../models/Tour");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// 🟢 [POST] Đặt tour
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { tourId, date, guests } = req.body;
    const tour = await Tour.findById(tourId);
    if (!tour) return res.status(404).json({ message: "Tour không tồn tại!" });

    const totalPrice = guests * tour.price;

    const booking = new Booking({
      user: req.user.userId,
      tour: tourId,
      date,
      guests,
      totalPrice,
    });

    await booking.save();
    res.status(201).json({ message: "Đặt tour thành công!", booking });
  } catch (error) {
    res.status(500).json({ message: "Lỗi đặt tour!" });
  }
});

// 🟢 [GET] Lấy danh sách booking của user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.userId }).populate("tour");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy danh sách đặt tour!" });
  }
});

// 🟢 [GET] Admin - Lấy tất cả bookings
router.get("/admin", async (req, res) => {
  try {
    const bookings = await Booking.find().populate("user tour");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy danh sách đặt tour!" });
  }
});

// 🟢 [PUT] Admin - Cập nhật trạng thái booking
router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });

    if (!booking) return res.status(404).json({ message: "Booking không tồn tại!" });

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: "Lỗi cập nhật trạng thái booking!" });
  }
});

// 🟢 [DELETE] Hủy booking của user
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findOneAndDelete({ _id: req.params.id, user: req.user.userId });

    if (!booking) return res.status(404).json({ message: "Bạn không thể hủy booking này!" });

    res.json({ message: "Booking đã bị hủy!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi hủy booking!" });
  }
});

module.exports = router;
