# Kế Hoạch Nâng Cấp Dự Án Ngư Ông Bất Ổn

## 🎯 Tầm Nhìn
Biến game câu cá thành trải nghiệm đa nền tảng hoàn thiện với hệ thống cân bằng tốt, hiệu suất cao và khả năng mở rộng dễ dàng.

---

## 📊 PHÂN TíCH HIỆN TRẠNG

### Số liệu dự án
- **Fish list**: 500+ dòng, 130+ loài cá
- **Zones**: 15 khu vực câu phức tạp
- **Achievements**: 24 thành tựu
- **Rarity tiers**: 14 mức độ hiếm
- **Platforms**: Web + Electron + Cordova + Node.js API

### Điểm mạnh
✅ Hệ thống game phong phú (buff, pet tank, crafting, minigame)
✅ Pixel canvas hoạt họa sinh động
✅ Multi-platform deployment
✅ Cloud sync với MongoDB + local fallback
✅ Hệ thống i18n tích hợp

### Vấn đề nghiêm trọng
❌ Lỗi logic `catchModalThreshold` (game-state.js:52-56)
❌ Thiếu biến `equippedAchievementId` declaration
❌ Race condition khi sync cloud
❌ Performance log khi entry > 160
❌ Accessibility không hoàn thiện

---

## 🚀 ĐỘ ƯU TIÊN NÂNG CẬP

### 🔴 P0 - Khẩn cấp (Ngày 1-2)
1. **Sửa lỗi catchModalThreshold logic**
   - File: `js/game-state.js:52-56`
   - Vấn đề: Set "Thần Thoại" nhưng option select không có giá trị này
   - Giải pháp: Thêm option "Thần Thoại" hoặc sửa logic validation

2. **Thêm biến thiếu**
   - File: `js/game-state.js`
   - Thêm: `let equippedAchievementId = null;`

3. **Toàn vẹn dữ liệu save**
   - File: `js/game-core.js:validateSaveSchema()`
   - Thêm: kiểm tra version migration, timestamp validation

### 🟠 P1 - Cao (Ngày 3-7)
4. **Tối ưu performance log**
   - Virtual scroll hoặc giảm entry giới hạn xuống 80
   - Debounce scroll event

5. **Cải thiện error handling**
   - Log chi tiết hơn các lỗi network/API
   - Thêm retry mechanism cho cloud sync

6. **Hoàn thiện accessibility**
   - Thêm aria-describedby cho form inputs
   - Keyboard navigation cho tất cả interactive elements

### 🟡 P2 - Trung bình (Ngày 8-14)
7. **Hệ thống cân bằng kinh tế**
   - Chạy simulation để tính toán growth curve hợp lý
   - Điều chỉnh cost/eco dựa trên dữ liệu thực tế

8. **Refactor JS modules**
   - Chia game-core.js thành các module nhỏ hơn
   - Tách logic game state, rendering, events riêng biệt

9. **Cập nhật translations**
   - Hoàn thiện file `js/data/translations-content.js`
   - Thêm missing keys cho UI tiếng Anh

### 🟢 P3 - Thấp (Ngày 15-20)
10. **Animation performance**
    - Optimize canvas animation với requestAnimationFrame
    - Giảm số lần redraw khi không cần thiết

11. **Testing infrastructure**
    - Thêm unit test cho core functions
    - Integration test cho save/load flow

---

## 📅 LỊCH TRÌNH CHI TIẾT

### Tuần 1: Sửa lỗi nền tảng
| Ngày | Công việc | File ảnh hưởng |
|------|-----------|-----------------|
| 1 | Sửa catchModalThreshold bug | js/game-state.js, NguOngBatOn.html |
| 1 | Thêm biến equippedAchievementId | js/game-state.js |
| 2 | Validate schema save | js/game-core.js |
| 3 | Refactor error handling | js/game-core.js |
| 4 | Performance log optimization | js/game-core.js, css/style.css |
| 5-7 | Accessibility audit & fix | Nhiều file HTML/CSS |

### Tuần 2: Cân bằng & nâng cao
| Ngày | Công việc | File ảnh hưởng |
|------|-----------|-----------------|
| 8-9 | Economy simulation | scratch/simulate_economy.js |
| 10-12 | Cân bằng cost curve | js/data/progression-data.js |
| 13-14 | Refactor modules | js/game-core.js |
| 15-17 | Canvas optimization | js/game-core.js, css/pixel-art.css |
| 18-20 | Testing setup | package.json, scratch/ |

---

## 🛠️ TECHNICAL DEBT LIST

### Code Quality
- [ ] Xóa `onclick` inline còn lại trong HTML (sử dụng event-bindings.js)
- [ ] Chuẩn ESLint/Prettier cho toàn bộ project
- [ ] JSDoc cho các hàm quan trọng

### Security
- [ ] Kiểm tra CORS policy cho API endpoints
- [ ] Rate limiting cho cloud sync requests
- [ ] Sanitize input player name (đã có nhưng cần mạnh hơn)

### Performance
- [ ] Lazy load fish data (chỉ load zone hiện tại)
- [ ] Cache DOM queries
- [ ] Optimize pixel canvas redraw

---

## 📈 CHỈ TIÊU KẾT QUẢ

| Chỉ tiêu | Hiện tại | Mục tiêu |
|----------|----------|----------|
| Game load time | ~2s | <1.5s |
| Log entry limit | 160 | 80 (optimized) |
| Achievement bugs | 1+ | 0 |
| Accessibility score | 75% | 95% |
| Code coverage | 0% | 60% |

---

## ✅ CHECKLIST KIỂM TRA

- [ ] Sửa catchModalThreshold inconsistency
- [ ] Khai báo đầy đủ biến global
- [ ] Validate save data toàn diện
- [ ] Loại bỏ onclick còn lại trong HTML
- [ ] Thêm error boundaries cho API calls
- [ ] Optimize canvas performance
- [ ] Chạy economy simulation
- [ ] Viết unit test cho core functions
- [ ] Cập nhật documentation