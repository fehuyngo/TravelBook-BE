const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");

const router = express.Router();

// 🟢 [POST] Đăng ký tài khoản
router.post(
  "/register",
  [
    check("name", "Tên không được để trống").not().isEmpty(),
    check("email", "Email không hợp lệ").isEmail(),
    check("password", "Mật khẩu phải có ít nhất 6 ký tự").isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ message: "Email đã tồn tại!" });

      // Mã hóa mật khẩu
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      user = new User({ name, email, password: hashedPassword });
      await user.save();

      res.status(201).json({ message: "Đăng ký thành công!" });
    } catch (error) {
      res.status(500).json({ message: "Lỗi đăng ký!" });
    }
  }
);

// 🟢 [POST] Đăng nhập
router.post(
  "/login",
  [
    check("email", "Email không hợp lệ").isEmail(),
    check("password", "Mật khẩu không được để trống").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: "Tài khoản không tồn tại!" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Sai mật khẩu!" });

      // Tạo JWT Token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

      res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
      res.status(500).json({ message: "Lỗi đăng nhập!" });
    }
  }
);

// 🟢 [GET] Lấy thông tin user (cần token)
router.get("/me", async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "Không có token!" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return res.status(404).json({ message: "Người dùng không tồn tại!" });

    res.json(user);
  } catch (error) {
    res.status(401).json({ message: "Token không hợp lệ!" });
  }
});

module.exports = router;
