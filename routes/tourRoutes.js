const express = require("express");
const Tour = require("../models/Tour");

const router = express.Router();

// 🟢 [GET] Lấy tất cả tour
router.get("/", async (req, res) => {
  try {
    const tours = await Tour.find();
    res.json(tours);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy danh sách tour!" });
  }
});

// 🟢 [POST] Thêm tour mới
router.post("/", async (req, res) => {
  try {
    const newTour = new Tour(req.body);
    await newTour.save();
    res.status(201).json(newTour);
  } catch (error) {
    res.status(500).json({ message: "Lỗi thêm tour!" });
  }
});

// 🟢 [GET] Lấy chi tiết tour theo ID
router.get("/:id", async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) return res.status(404).json({ message: "Tour không tồn tại!" });
    res.json(tour);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy thông tin tour!" });
  }
});

// 🟢 [PUT] Cập nhật tour theo ID
router.put("/:id", async (req, res) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTour) return res.status(404).json({ message: "Tour không tồn tại!" });
    res.json(updatedTour);
  } catch (error) {
    res.status(500).json({ message: "Lỗi cập nhật tour!" });
  }
});

// 🟢 [DELETE] Xóa tour theo ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedTour = await Tour.findByIdAndDelete(req.params.id);
    if (!deletedTour) return res.status(404).json({ message: "Tour không tồn tại!" });
    res.json({ message: "Tour đã được xóa!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi xóa tour!" });
  }
});

module.exports = router;
