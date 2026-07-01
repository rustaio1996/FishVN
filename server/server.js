require("dotenv").config();
const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]); // Ép Node.js sử dụng DNS Google/Cloudflare để giải quyết lỗi SRV lookup

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" })); // Tăng giới hạn tải trọng cho dữ liệu game lớn

// Kết nối MongoDB
const mongoUri = process.env.MONGODB_URI;
console.log("Đang kết nối tới MongoDB...");
mongoose
  .connect(mongoUri)
  .then(() => console.log("Kết nối thành công tới MongoDB Atlas!"))
  .catch((err) => {
    console.error("Lỗi kết nối MongoDB:", err.message);
    process.exit(1);
  });

// Schema cho dữ liệu game
const SaveDataSchema = new mongoose.Schema(
  {
    playerId: { type: String, required: true, index: true },
    key: { type: String, required: true },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

// Tạo chỉ mục kết hợp độc nhất (playerId + key) để dễ dàng ghi đè dữ liệu cũ
SaveDataSchema.index({ playerId: 1, key: 1 }, { unique: true });

const SaveData = mongoose.model("SaveData", SaveDataSchema);

// Ping endpoint kiểm tra server hoạt động
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "FishVN Backend API Server đang chạy!" });
});

// API Lưu dữ liệu (Save)
app.post("/api/save", async (req, res) => {
  try {
    const { playerId, key, data } = req.body;

    if (!playerId || !key) {
      return res.status(400).json({ success: false, error: "Thiếu playerId hoặc key" });
    }

    // Thực hiện upsert (Nếu có rồi thì cập nhật, chưa có thì tạo mới)
    const result = await SaveData.findOneAndUpdate(
      { playerId, key },
      { data },
      { upsert: true, new: true }
    );

    res.json({ success: true, message: `Lưu dữ liệu cho khóa [${key}] thành công!` });
  } catch (error) {
    console.error("Lỗi API /api/save:", error);
    res.status(500).json({ success: false, error: "Lỗi máy chủ nội bộ" });
  }
});

// API Tải dữ liệu (Load)
app.get("/api/load", async (req, res) => {
  try {
    const { playerId, key } = req.query;

    if (!playerId || !key) {
      return res.status(400).json({ success: false, error: "Thiếu playerId hoặc key" });
    }

    const record = await SaveData.findOne({ playerId, key });
    
    // Nếu không tìm thấy, trả về null để client khởi tạo dữ liệu mặc định
    res.json({ success: true, data: record ? record.data : null });
  } catch (error) {
    console.error("Lỗi API /api/load:", error);
    res.status(500).json({ success: false, error: "Lỗi máy chủ nội bộ" });
  }
});

// API Xóa toàn bộ dữ liệu của người chơi (Clear)
app.post("/api/clear", async (req, res) => {
  try {
    const { playerId } = req.body;

    if (!playerId) {
      return res.status(400).json({ success: false, error: "Thiếu playerId" });
    }

    await SaveData.deleteMany({ playerId });
    res.json({ success: true, message: "Đã xóa toàn bộ dữ liệu game thành công!" });
  } catch (error) {
    console.error("Lỗi API /api/clear:", error);
    res.status(500).json({ success: false, error: "Lỗi máy chủ nội bộ" });
  }
});

// Khởi chạy server
app.listen(PORT, () => {
  console.log(`Server đang chạy trên port ${PORT}`);
});
