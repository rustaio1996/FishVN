const weatherPool = [
        { name: "Bình Thường", emoji: "☀️", text: "Trời Trong Xanh", color: "#81c784", desc: "Không có biến đổi gì, thời tiết ôn hòa thích hợp đi câu." },
        { name: "Bão Táp", emoji: "⛈️", text: "Bão Táp Thiên Đình", color: "#e53935", desc: "Sét đánh x2, thời gian cá cắn nhanh hơn 15%, nghiệp từ rác tăng 30%." },
        { name: "Sương Mù", emoji: "🌫️", text: "Sương Mù Bất Ổn", color: "#b0bec5", desc: "Tăng 20% thời gian chờ cá cắn. Cá bị giảm 3 lần tỷ lệ gặp cá hiếm+ trừ khi có bùa Thấu Thị." },
        { name: "Nhật Thực", emoji: "🌑", text: "Nhật Thực Vô Tri", color: "#ab47bc", desc: "Nhận thêm +50% EXP khi câu cá. Tỷ lệ câu được cá Tối Cao / Vô Tri tăng 50%." }
      ];

const zones = {
        song_nuoc: {
          name: "🌊 Mương Nước Thất Tình",
          desc: "Nơi tụ tập của các tổng tài rách việc và cá cỏ",
          level: 1,
          emoji: "🌊",
        },
        ho_nuoc: {
          name: "💧 Ao Đình Thần Chưởng",
          desc: "Vùng nước linh thiêng đầy nước rửa bát và bí ẩn",
          level: 5,
          emoji: "💧",
        },
        khu_bi_mat: {
          name: "🤫 Khu Chứa Bí Mật",
          desc: "Khu vực ẩn, tập trung các loài sinh vật đột biến và huyền thoại",
          level: 8,
          emoji: "🤫",
        },
        suoi_doc: {
          name: "🪵 Suối Độc Đột Biến",
          desc: "Nước thải khu công nghiệp, cá ở đây có 3 mắt và biết bay",
          level: 8,
          emoji: "🪵",
        },
        bien_sau: {
          name: "🌊 Vùng Biển Bất Ổn",
          desc: "Sóng gió phủ đời trai, cá mập cũng phải mặc áo phao",
          level: 10,
          emoji: "🌊",
        },
        dam_lay: {
          name: "🐊 Đầm Lầy Ăn Vạ",
          desc: "Nơi các cụ rùa và cá trê kể chuyện ngày xưa, hở ra là khóc",
          level: 12,
          emoji: "🐊",
        },
        hang_ca: {
          name: "🏔️ Hang Động Sĩ Diện",
          desc: "Tối tăm, nơi trú ẩn của những kẻ chém gió xuyên lục địa",
          level: 15,
          emoji: "🏔️",
        },
        song_bang: {
          name: "❄️ Sông Băng Tê Tái",
          desc: "Lạnh thấu xương cứu tinh, cá ở đây đóng băng vẫn thích gáy",
          level: 18,
          emoji: "❄️",
        },
        vuc_toi: {
          name: "⚫ Vực Thẳm Trầm Cảm",
          desc: "Cực kỳ nguy hiểm, nơi ví tiền bốc hơi sau 23h",
          level: 20,
          emoji: "⚫",
        },
        nha_may: {
          name: "🏭 Nhà Máy Xả Thải",
          desc: "Vùng ô nhiễm cấp độ vũ trụ, quái vật rác công nghệ ẩn nấp",
          level: 22,
          emoji: "🏭",
        },
        tien_canh: {
          name: "✨ Đảo Ngáo Ngơ Huyền Diệu",
          desc: "Đất lành chim đậu, đất nhậu thì mang cá lên bờ",
          level: 25,
          emoji: "✨",
        },
        vu_tru: {
          name: "🌌 Không Gian Vô Tri",
          desc: "Ranh giới tối thượng, nơi trú ngụ của các vị thần mù chữ",
          level: 30,
          emoji: "🌌",
        },
        dai_lo_ao: {
          name: "🎭 Đại Lộ Ảo Lòi",
          desc: "Nơi các cần thủ sống ảo check-in qua 800 lớp kính lọc và filter ảo diệu.",
          level: 35,
          emoji: "🎭",
          rarityMods: { "Ảo Lòi": 1.3, "Tối Cao": 0.8, "Vô Tri": 0.6 },
        },
        day_xa_hoi: {
          name: "🏚️ Đáy Xã Hội",
          desc: "Vực sâu tuyệt vọng nơi tụ tập của các con nợ, cá voi all-in sập sàn và dân đu đỉnh.",
          level: 40,
          emoji: "🏚️",
          rarityMods: { "Đáy Xã Hội": 1.4, "Vô Tri": 0.9, "Ảo Lòi": 0.5 },
        },
      };
const fishList = [
        {
          name: "Cá Mập Cắn Cáp",
          emoji: "🦈",
          rarity: "Tối Cao",
          price: 1200,
          exp: 400,
          color: "#ff1744",
          zones: ["khu_bi_mat", "vuc_toi", "vu_tru"],
          hidden: 2,
        },
        {
          name: "Nàng Tiên Cá Thất Tình",
          emoji: "🧜‍♀️",
          rarity: "Thần Thoại",
          price: 850,
          exp: 300,
          color: "#e040fb",
          zones: ["khu_bi_mat", "tien_canh", "vu_tru"],
          hidden: 1,
        },
        {
          name: "Cá Trê Ngũ Sắc Đột Biến",
          emoji: "🌈",
          rarity: "Hiếm",
          price: 90,
          exp: 35,
          color: "#e91e63",
          zones: ["song_nuoc", "ho_nuoc", "dam_lay"],
          hidden: 1,
        },
        {
          name: "Bạch Tuộc Tàng Hình Trốn Nợ",
          emoji: "🐙",
          rarity: "Cực Hiếm",
          price: 180,
          exp: 70,
          color: "#00e5ff",
          zones: ["bien_sau", "hang_ca", "nha_may"],
          hidden: 1,
        },
        {
          name: "Cá Hồi Giáo Đầu Búa Triết Học",
          emoji: "🦈",
          rarity: "Huyền Thoại",
          price: 420,
          exp: 175,
          color: "#ffd54f",
          zones: ["suoi_doc", "vuc_toi", "vu_tru"],
          hidden: 2,
        },
        {
          name: "Cá Mập Cận Thị Đeo Kính Áp Tròng",
          emoji: "🕶️",
          rarity: "Tối Cao",
          price: 1000,
          exp: 350,
          color: "#ff1744",
          zones: ["tien_canh", "vu_tru"],
          hidden: 2,
        },
        {
          name: "Chuột Gaming Liệt Click Phải Gây Thua Trận",
          emoji: "🖱️",
          rarity: "Rác",
          price: 1,
          exp: 1,
          color: "#999999",
          zones: ["song_nuoc", "nha_may"],
        },
        {
          name: "Tai Nghe Bluetooth Chỉ Nghe Được Bên Trái",
          emoji: "🎧",
          rarity: "Rác",
          price: 1,
          exp: 1,
          color: "#999999",
          zones: ["ho_nuoc", "suoi_doc"],
        },
        {
          name: "Thẻ ATM Nội Địa Số Dư 0đ Khét Lẹt",
          emoji: "💳",
          rarity: "Rác",
          price: 1,
          exp: 1,
          color: "#999999",
          zones: ["song_nuoc", "vuc_toi"],
        },
        {
          name: "Cáp Sạc Điện Thoại Lúc Nhận Lúc Không",
          emoji: "🔌",
          rarity: "Rác",
          price: 2,
          exp: 1,
          color: "#999999",
          zones: ["suoi_doc", "nha_may"],
        },
        {
          name: "Deadline Trễ Hạn Từ Thứ Hai Tuần Trước",
          emoji: "📅",
          rarity: "Rác",
          price: 1,
          exp: 1,
          color: "#999999",
          zones: ["ho_nuoc", "nha_may"],
        },
        {
          name: "Hộp Cơm Văn Phòng Quên Rửa 3 Ngày",
          emoji: "🍱",
          rarity: "Rác",
          price: 2,
          exp: 2,
          color: "#999999",
          zones: ["song_nuoc", "ho_nuoc"],
        },
        {
          name: "Voucher Giảm Giá Shopee Hết Hạn Trước 1 Phút",
          emoji: "🎟️",
          rarity: "Rác",
          price: 1,
          exp: 1,
          color: "#999999",
          zones: ["ho_nuoc"],
        },
        {
          name: "Chiếc Tất Chiếc Có Chiếc Không Bốc Mùi",
          emoji: "🧦",
          rarity: "Rác",
          price: 2,
          exp: 1,
          color: "#999999",
          zones: ["suoi_doc", "nha_may"],
        },
        {
          name: "Vé Số Trật Giải Độc Đắc Chiều Hôm Qua",
          emoji: "🎫",
          rarity: "Rác",
          price: 1,
          exp: 1,
          color: "#999999",
          zones: ["song_nuoc", "ho_nuoc"],
        },
        {
          name: "Thùng Mì Tôm Hết Gói Gia Vị Vô Tri",
          emoji: "🍜",
          rarity: "Rác",
          price: 2,
          exp: 1,
          color: "#999999",
          zones: ["song_nuoc", "suoi_doc"],
        },
        {
          name: "Cục Sạc Dự Phòng Sạc Vào Thì Nhanh Ra Thì Chậm",
          emoji: "🔋",
          rarity: "Rác",
          price: 2,
          exp: 2,
          color: "#999999",
          zones: ["nha_may"],
        },
        {
          name: "Ly Trà Sữa 100% Đường 0% Trân Châu Của Crush",
          emoji: "🥤",
          rarity: "Rác",
          price: 1,
          exp: 1,
          color: "#999999",
          zones: ["ho_nuoc", "nha_may"],
        },
        {
          name: "Kính Cận Gãy Gọng Dán Băng Keo Đen Của Nerd",
          emoji: "👓",
          rarity: "Rác",
          price: 2,
          exp: 2,
          color: "#999999",
          zones: ["song_nuoc"],
        },
        {
          name: "Cọng Bún Đậu Dính Mắm Tôm Dưới Đáy Bàn",
          emoji: "🥢",
          rarity: "Rác",
          price: 1,
          exp: 1,
          color: "#999999",
          zones: ["song_nuoc"],
        },
        {
          name: "Tờ Khai Thuế Bị Sếp Xé Làm Đôi Vì Sai Số",
          emoji: "📄",
          rarity: "Rác",
          price: 1,
          exp: 1,
          color: "#999999",
          zones: ["ho_nuoc", "nha_may"],
        },
        {
          name: "Chảo Chống Dính Đã Tróc Hết Lớp Chống Dính",
          emoji: "🍳",
          rarity: "Rác",
          price: 2,
          exp: 1,
          color: "#999999",
          zones: ["song_nuoc", "nha_may"],
        },
        {
          name: "Bàn Chải Toilet Mòn Hết Lông Của Công Ty",
          emoji: "🪥",
          rarity: "Rác",
          price: 1,
          exp: 1,
          color: "#999999",
          zones: ["ho_nuoc", "suoi_doc"],
        },
        {
          name: "Bao Nilon Đựng Sự Thất Vọng Của Mẹ",
          emoji: "🛍️",
          rarity: "Rác",
          price: 1,
          exp: 1,
          color: "#999999",
          zones: ["song_nuoc", "ho_nuoc"],
        },
        {
          name: 'Quyển Sách "Làm Giàu Không Khó" Bị Mối Ăn',
          emoji: "📚",
          rarity: "Rác",
          price: 2,
          exp: 2,
          color: "#999999",
          zones: ["suoi_doc"],
        },
        {
          name: "Chiếc Giày Cao Gót Gãy Gót Lúc Đi Hẹn Hò",
          emoji: "👠",
          rarity: "Rác",
          price: 2,
          exp: 1,
          color: "#999999",
          zones: ["song_nuoc"],
        },
        {
          name: "Chiếc Dép Tổ Ong Bị Chó Gặm Mất Một Góc",
          emoji: "🩴",
          rarity: "Rác",
          price: 1,
          exp: 1,
          color: "#999999",
          zones: ["song_nuoc"],
        },
        {
          name: "Thùng Sơn Nước Hết Hạn Biến Thành Khối Đá",
          emoji: "🪣",
          rarity: "Rác",
          price: 2,
          exp: 2,
          color: "#999999",
          zones: ["suoi_doc", "nha_may"],
        },
        {
          name: "Nồi Cơm Điện Sinh Viên Nấu Toàn Khê Đáy",
          emoji: "🍚",
          rarity: "Rác",
          price: 2,
          exp: 1,
          color: "#999999",
          zones: ["song_nuoc"],
        },
        {
          name: "SIM Rác Khuyến Mãi Bị Nhà Mạng Khóa 2 Chiều",
          emoji: "📲",
          rarity: "Rác",
          price: 2,
          exp: 2,
          color: "#999999",
          zones: ["nha_may"],
        },
        {
          name: "Kính Cường Lực Điện Thoại Vỡ Nát Như Tim Em",
          emoji: "📱",
          rarity: "Rác",
          price: 1,
          exp: 1,
          color: "#999999",
          zones: ["ho_nuoc"],
        },
        {
          name: "Chiếc Bật Lửa Hết Ga Đúng Lúc Cần Nấu Mì",
          emoji: "🔥",
          rarity: "Rác",
          price: 1,
          exp: 1,
          color: "#999999",
          zones: ["song_nuoc"],
        },
        {
          name: "Sổ Tay Ghi Nợ Nhưng Người Nợ Đã Chạy Trốn",
          emoji: "📒",
          rarity: "Rác",
          price: 2,
          exp: 2,
          color: "#999999",
          zones: ["suoi_doc", "nha_may"],
        },
        {
          name: "Chiếc Khẩu Trang Vải Dùng 3 Tháng Chưa Giặt",
          emoji: "😷",
          rarity: "Rác",
          price: 1,
          exp: 1,
          color: "#999999",
          zones: ["song_nuoc"],
        },
        {
          name: "Quạt Mini Cầm Tay Quay Được 3 Giây Thì Tắt",
          emoji: "🪭",
          rarity: "Rác",
          price: 2,
          exp: 1,
          color: "#999999",
          zones: ["ho_nuoc"],
        },
        {
          name: "Sợi Dây Thun Buộc Tóc Bị Nhão Nhét Vứt Bỏ",
          emoji: "🎗️",
          rarity: "Rác",
          price: 1,
          exp: 1,
          color: "#999999",
          zones: ["song_nuoc"],
        },
        {
          name: "Hộp Xốp Đựng Bánh Tráng Trộn Bị Oxy Hóa",
          emoji: "📦",
          rarity: "Phế Liệu",
          price: 1,
          exp: 1,
          color: "#8d6e63",
          zones: ["song_nuoc", "ho_nuoc"],
        },
        {
          name: "Đĩa CD Nhạc Đám Cưới Năm 1998 Bị Trầy",
          emoji: "💿",
          rarity: "Phế Liệu",
          price: 2,
          exp: 1,
          color: "#8d6e63",
          zones: ["ho_nuoc"],
        },
        {
          name: "Vỏ Bao Thuốc Lá Rỗng Chứa Toàn Sự Suy Sụp",
          emoji: "🚬",
          rarity: "Phế Liệu",
          price: 1,
          exp: 1,
          color: "#8d6e63",
          zones: ["suoi_doc"],
        },
        {
          name: "Bàn Phím Cơ Liệt Nút Space Của Thợ Cày Game",
          emoji: "⌨️",
          rarity: "Phế Liệu",
          price: 2,
          exp: 1,
          color: "#8d6e63",
          zones: ["ho_nuoc", "nha_may"],
        },
        {
          name: "Con Chuột Máy Tính Dính Keo Bẫy Chuột Khét",
          emoji: "🐁",
          rarity: "Phế Liệu",
          price: 1,
          exp: 1,
          color: "#8d6e63",
          zones: ["nha_may"],
        },
        {
          name: "Sổ Hộ Nghèo Khóa Thẻ Của Thần Biển Đông",
          emoji: "📕",
          rarity: "Phế Liệu",
          price: 2,
          exp: 2,
          color: "#8d6e63",
          zones: ["suoi_doc", "nha_may"],
        },
        {
          name: "Chiếc Ô Thủng Lỗ Chỗ Đúng Lúc Trời Mưa To",
          emoji: "⛱️",
          rarity: "Phế Liệu",
          price: 2,
          exp: 1,
          color: "#8d6e63",
          zones: ["song_nuoc"],
        },
        {
          name: "Tuýp Kem Đánh Răng Bị Bóp Dẹp Lép Cạn Kiệt",
          emoji: "🪥",
          rarity: "Phế Liệu",
          price: 1,
          exp: 1,
          color: "#8d6e63",
          zones: ["ho_nuoc"],
        },
        {
          name: "Khăn Lau Bàn Bốc Mùi Thối Tai Của Quán Nhậu",
          emoji: "🧣",
          rarity: "Phế Liệu",
          price: 1,
          exp: 1,
          color: "#8d6e63",
          zones: ["song_nuoc"],
        },
        {
          name: "Sợi Xích Xe Đạp Rỉ Sét Đứt Làm Ba Đoạn",
          emoji: "⛓️",
          rarity: "Phế Liệu",
          price: 2,
          exp: 2,
          color: "#8d6e63",
          zones: ["suoi_doc", "nha_may"],
        },
        {
          name: "Cá Chép Nghiện Ăn Phở Bò Nhiều Hành",
          emoji: "🐟",
          rarity: "Thường",
          price: 8,
          exp: 5,
          color: "#81c784",
          zones: ["song_nuoc", "ho_nuoc"],
        },
        {
          name: "Cá Mè Nheo Đòi Chuyển Khoản Mới Cho Chạm",
          emoji: "🐠",
          rarity: "Thường",
          price: 10,
          exp: 6,
          color: "#81c784",
          zones: ["song_nuoc", "ho_nuoc"],
        },
        {
          name: "Cá Vàng Mất Trí Nhớ Sau 1 Giây Quẹt Thẻ",
          emoji: "🐡",
          rarity: "Thường",
          price: 9,
          exp: 5,
          color: "#81c784",
          zones: ["song_nuoc"],
        },
        {
          name: "Cá Lóc Chóc Thích Khoe Sổ Đỏ Ao Làng Tự Chế",
          emoji: "🐟",
          rarity: "Thường",
          price: 10,
          exp: 6,
          color: "#81c784",
          zones: ["song_nuoc", "ho_nuoc"],
        },
        {
          name: "Cá Trê Trêu Ngươi Hay Ăn Vạ Gặp Sét Đánh",
          emoji: "🐟",
          rarity: "Thường",
          price: 8,
          exp: 5,
          color: "#81c784",
          zones: ["song_nuoc", "ho_nuoc"],
        },
        {
          name: "Cá Rô Phi Đi Bao Biển Chụp Ảnh Sống Ảo",
          emoji: "🐠",
          rarity: "Thường",
          price: 9,
          exp: 5,
          color: "#81c784",
          zones: ["song_nuoc", "suoi_doc"],
        },
        {
          name: "Cá Tra Tra Khảo Điện Thoại Người Yêu Cũ",
          emoji: "🐟",
          rarity: "Thường",
          price: 9,
          exp: 5,
          color: "#81c784",
          zones: ["ho_nuoc", "suoi_doc"],
        },
        {
          name: "Cá Chim Lé Hay Nhìn Trộm Pass Wifi Hàng Xóm",
          emoji: "🦅",
          rarity: "Thường",
          price: 11,
          exp: 6,
          color: "#81c784",
          zones: ["suoi_doc", "bien_sau"],
        },
        {
          name: "Cá Bống Thích Hóng Biến Showbiz Trên TikTok",
          emoji: "📻",
          rarity: "Thường",
          price: 9,
          exp: 5,
          color: "#81c784",
          zones: ["song_nuoc", "ho_nuoc"],
        },
        {
          name: "Cá Kèo Nài Ép Giá Vé Số Vỉa Hè",
          emoji: "🐟",
          rarity: "Thường",
          price: 10,
          exp: 6,
          color: "#81c784",
          zones: ["ho_nuoc", "suoi_doc"],
        },
        {
          name: "Cá Điêu Ngoa Ba Hoa Chích Chòe Bị Bắt Bài",
          emoji: "👅",
          rarity: "Thường",
          price: 11,
          exp: 6,
          color: "#81c784",
          zones: ["ho_nuoc", "suoi_doc"],
        },
        {
          name: "Cá Lau Kiếng Nghiện Dọn Nhà Người Khác",
          emoji: "🧹",
          rarity: "Thường",
          price: 8,
          exp: 5,
          color: "#81c784",
          zones: ["ho_nuoc", "suoi_doc"],
        },
        {
          name: "Cá Sặc Sụa Vì Hít Khói Bụi Kẹt Xe Giờ Cao Điểm",
          emoji: "💨",
          rarity: "Thường",
          price: 9,
          exp: 5,
          color: "#81c784",
          zones: ["song_nuoc", "suoi_doc"],
        },
        {
          name: "Cá Lòng Tong Tập Thể Dục Buổi Sáng Bị Chuột Rượt",
          emoji: "🐟",
          rarity: "Thường",
          price: 10,
          exp: 6,
          color: "#81c784",
          zones: ["song_nuoc", "ho_nuoc"],
        },
        {
          name: "Cá Thu Thích Ăn Quỵt Vé Số Của Cá Voi Đa Cấp",
          emoji: "💸",
          rarity: "Thường",
          price: 11,
          exp: 6,
          color: "#81c784",
          zones: ["suoi_doc", "bien_sau"],
        },
        {
          name: "Cá Ngừ Ngủ Gật Trong Giờ Làm Việc Bị Sếp Bắt",
          emoji: "💤",
          rarity: "Thường",
          price: 10,
          exp: 6,
          color: "#81c784",
          zones: ["bien_sau"],
        },
        {
          name: "Cá Linh Đi Học Muộn Bị Phạt Đứng Cột Cờ",
          emoji: "⏰",
          rarity: "Thường",
          price: 8,
          exp: 4,
          color: "#81c784",
          zones: ["song_nuoc", "ho_nuoc"],
        },
        {
          name: "Cá Tra Đội Mũ Bảo Hiểm Đi Phượt Tây Bắc",
          emoji: "🪖",
          rarity: "Thường",
          price: 10,
          exp: 6,
          color: "#81c784",
          zones: ["song_nuoc", "ho_nuoc"],
        },
        {
          name: "Cá Trắm Cỏ Biết Sủa Gầm Gừ Giữ Cửa Đáy Ao",
          emoji: "🐶",
          rarity: "Thường",
          price: 11,
          exp: 6,
          color: "#81c784",
          zones: ["ho_nuoc", "suoi_doc"],
        },
        {
          name: "Cá Lóc Mặc Áo Sơ Mi Trắng Đi Phỏng Vấn",
          emoji: "👔",
          rarity: "Thường",
          price: 10,
          exp: 5,
          color: "#81c784",
          zones: ["song_nuoc"],
        },
        {
          name: "Cá Diếc Thích Xem Biến Đánh Ghen Ngoài Phố",
          emoji: "🐯",
          rarity: "Thường",
          price: 10,
          exp: 6,
          color: "#81c784",
          zones: ["song_nuoc"],
        },
        {
          name: "Cá Chép Thừa Cân Nghiện Trà Sữa Size XL",
          emoji: "🐳",
          rarity: "Thường",
          price: 12,
          exp: 7,
          color: "#81c784",
          zones: ["ho_nuoc", "suoi_doc"],
        },
        {
          name: "Cá Ngừ Tập Sự Viết Báo Cáo Sai Font Chữ",
          emoji: "📝",
          rarity: "Thường",
          price: 9,
          exp: 5,
          color: "#81c784",
          zones: ["bien_sau"],
        },
        {
          name: "Cá Trê Trốn Nghĩa Vụ Quân Sự Bị Gọi Tên",
          emoji: "🪖",
          rarity: "Thường",
          price: 11,
          exp: 6,
          color: "#81c784",
          zones: ["song_nuoc", "suoi_doc"],
        },
        {
          name: "Cá Hồi Nhưng Không Muốn Quay Lại Với Thất Tình",
          emoji: "↩️",
          rarity: "Thường",
          price: 12,
          exp: 6,
          color: "#81c784",
          zones: ["bien_sau"],
        },
        {
          name: "Cá Trê Lai Nhái Thích Nhảy Nhót Đu Trend Shorts",
          emoji: "🐸",
          rarity: "Thường",
          price: 9,
          exp: 5,
          color: "#81c784",
          zones: ["song_nuoc"],
        },
        {
          name: "Cá Rô Mắc Nghẹn Vì Hốc Tham Mồi Câu Free",
          emoji: "🤮",
          rarity: "Thường",
          price: 7,
          exp: 4,
          color: "#81c784",
          zones: ["suoi_doc"],
        },
        {
          name: "Cá Trê Lai Chó Cỏ Thích Cắn Bậy Quần Bơi",
          emoji: "🐕",
          rarity: "Thường",
          price: 9,
          exp: 5,
          color: "#81c784",
          zones: ["song_nuoc", "suoi_doc"],
        },
        {
          name: "Cá Lòng Tong Đi Xe Máy Số Không Gương",
          emoji: "🏍️",
          rarity: "Thường",
          price: 8,
          exp: 5,
          color: "#81c784",
          zones: ["ho_nuoc", "bien_sau"],
        },
        {
          name: "Cá Mè Thích Cãi Cọ Loa Kẹo Kéo Ban Đêm",
          emoji: "🗣️",
          rarity: "Thường",
          price: 10,
          exp: 6,
          color: "#81c784",
          zones: ["song_nuoc"],
        },
        {
          name: "Cá Trắm Sợ Nước Sôi Sùng Sục Chạy Trốn Bếp",
          emoji: "🔥",
          rarity: "Bất Ổn",
          price: 8,
          exp: 5,
          color: "#d4e157",
          zones: ["ho_nuoc"],
        },
        {
          name: "Cá Thu Thù Hận Chiên Giòn Ít Nước Mắm",
          emoji: "🧂",
          rarity: "Bất Ổn",
          price: 10,
          exp: 6,
          color: "#d4e157",
          zones: ["bien_sau"],
        },
        {
          name: "Cá Linh Tinh Hay Khóc Thầm Vì Thất Tình",
          emoji: "😢",
          rarity: "Bất Ổn",
          price: 8,
          exp: 5,
          color: "#d4e157",
          zones: ["song_nuoc"],
        },
        {
          name: "Cá Ngừ Ngơ Ngác Ngậm Ngùi Bị Hủy Kèo Đi Chơi",
          emoji: "📝",
          rarity: "Bất Ổn",
          price: 9,
          exp: 5,
          color: "#d4e157",
          zones: ["ho_nuoc", "bien_sau"],
        },
        {
          name: "Cá Trê Chiên Mắm Gừng Bất Ổn Vẫn Cố Bơi",
          emoji: "♨️",
          rarity: "Bất Ổn",
          price: 12,
          exp: 7,
          color: "#d4e157",
          zones: ["suoi_doc", "bien_sau"],
        },
        {
          name: "Cá Khô Mực Suy Dinh Dưỡng Cấp Độ Trầm Trọng",
          emoji: "🦴",
          rarity: "Bất Ổn",
          price: 7,
          exp: 4,
          color: "#d4e157",
          zones: ["song_nuoc"],
        },
        {
          name: "Cá Trắng Trơ Tráo Trơ Trẽn Xin Tiền Tiêu Vặt",
          emoji: "⚪",
          rarity: "Bất Ổn",
          price: 9,
          exp: 5,
          color: "#d4e157",
          zones: ["song_nuoc", "ho_nuoc"],
        },
        {
          name: "Cá Nóc Giận Dỗi Phình Như Quả Bóng Bay",
          emoji: "🐡",
          rarity: "Bất Ổn",
          price: 12,
          exp: 7,
          color: "#d4e157",
          zones: ["ho_nuoc", "bien_sau"],
        },
        {
          name: "Cá Báo Đời Trốn Nạo Đêm Khuya Bị Định Vị",
          emoji: "🐠",
          rarity: "Bất Ổn",
          price: 11,
          exp: 6,
          color: "#d4e157",
          zones: ["song_nuoc", "suoi_doc"],
        },
        {
          name: "Cá Tra Trơ Trẽn Mặt Dày Hỏi Mượn Tiền Không Trả",
          emoji: "🎭",
          rarity: "Bất Ổn",
          price: 9,
          exp: 5,
          color: "#d4e157",
          zones: ["ho_nuoc", "suoi_doc"],
        },
        {
          name: "Cá Cầu Vồng Lục Sắc Tự Hào Đu Trend LGBT",
          emoji: "🌈",
          rarity: "Hiếm",
          price: 40,
          exp: 18,
          color: "#4fc3f7",
          zones: ["dam_lay", "bien_sau", "hang_ca"],
        },
        {
          name: "Cá Mập Mặc Quần Sịp Đỏ Giải Cứu Rạn San Hô",
          emoji: "🦸",
          rarity: "Hiếm",
          price: 45,
          exp: 20,
          color: "#4fc3f7",
          zones: ["bien_sau", "hang_ca"],
        },
        {
          name: "Cá Ninja Leo Tường Trộm Chó Của Sếp Tổng",
          emoji: "🥷",
          rarity: "Hiếm",
          price: 42,
          exp: 19,
          color: "#4fc3f7",
          zones: ["hang_ca", "song_bang"],
        },
        {
          name: "Tôm Hùm Trầm Cảm Vì Rớt Môn Thể Dục",
          emoji: "🦐",
          rarity: "Hiếm",
          price: 38,
          exp: 17,
          color: "#4fc3f7",
          zones: ["dam_lay", "bien_sau"],
        },
        {
          name: "Cá Thu Thập Thông Tin Mật Của Công Ty Đối Thủ",
          emoji: "❄️",
          rarity: "Hiếm",
          price: 44,
          exp: 20,
          color: "#4fc3f7",
          zones: ["bien_sau", "song_bang"],
        },
        {
          name: "Cá Trắm Black Card Quyền Lực Quẹt Thủng Sàn",
          emoji: "👑",
          rarity: "Hiếm",
          price: 50,
          exp: 22,
          color: "#4fc3f7",
          zones: ["hang_ca", "song_bang"],
        },
        {
          name: "Ốc Hương Giang Hồ Thích Đấm Nhau Đòi Tiền Bảo Kê",
          emoji: "🐚",
          rarity: "Hiếm",
          price: 43,
          exp: 19,
          color: "#4fc3f7",
          zones: ["dam_lay", "bien_sau"],
        },
        {
          name: "Cá Chim Thả Thính Xuyên Lục Địa Toàn Bị Block",
          emoji: "🕊️",
          rarity: "Hiếm",
          price: 41,
          exp: 18,
          color: "#4fc3f7",
          zones: ["hang_ca"],
        },
        {
          name: "Cá Sấu Sợ Sấm Sét Khóc Nhè Đòi Mẹ Bế",
          emoji: "🐿️",
          rarity: "Hiếm",
          price: 39,
          exp: 17,
          color: "#4fc3f7",
          zones: ["dam_lay"],
        },
        {
          name: "Cá Ngựa Phi Nước Đại Đua Xe Trái Phép",
          emoji: "🦌",
          rarity: "Hiếm",
          price: 46,
          exp: 21,
          color: "#4fc3f7",
          zones: ["bien_sau", "song_bang"],
        },
        {
          name: "Cá Kiếm Giắt Thắt Lưng Đi Quẩy Bar Sập Sình",
          emoji: "⚔️",
          rarity: "Hiếm",
          price: 48,
          exp: 22,
          color: "#4fc3f7",
          zones: ["hang_ca", "bien_sau"],
        },
        {
          name: "Cá Hồi Xuân Nghiện Quẹt Tinder Tìm Phi Công",
          emoji: "🧙",
          rarity: "Hiếm",
          price: 47,
          exp: 21,
          color: "#4fc3f7",
          zones: ["bien_sau", "song_bang"],
        },
        {
          name: "Cá Tra Mặc Áo Giáp Chống Đạn Tự Chế Bằng Nhôm",
          emoji: "⚙️",
          rarity: "Hiếm",
          price: 44,
          exp: 20,
          color: "#4fc3f7",
          zones: ["hang_ca"],
        },
        {
          name: "Cá Mực Ống Hút Trà Sữa Trân Châu Đường Đen",
          emoji: "⛵",
          rarity: "Hiếm",
          price: 42,
          exp: 19,
          color: "#4fc3f7",
          zones: ["dam_lay", "bien_sau"],
        },
        {
          name: "Cá Trắm Hát Nhạc Sến Bolero Khi Gặp Cần Thủ",
          emoji: "🎵",
          rarity: "Hiếm",
          price: 40,
          exp: 18,
          color: "#4fc3f7",
          zones: ["dam_lay"],
        },
        {
          name: "Cá Trê Xịt Nước Hoa Chanel No.5 Mua Ở Chợ Đêm",
          emoji: "💐",
          rarity: "Hiếm",
          price: 43,
          exp: 19,
          color: "#4fc3f7",
          zones: ["dam_lay", "hang_ca"],
        },
        {
          name: "Cá Chuồn Chuồn Bay Thấp Mưa Rơi Ướt Hết Cánh",
          emoji: "🏏",
          rarity: "Hiếm",
          price: 45,
          exp: 20,
          color: "#4fc3f7",
          zones: ["bien_sau"],
        },
        {
          name: "Cá Quả Quạu Quọ Hay Chửi Thề Với Thủy Thần",
          emoji: "🐅",
          rarity: "Hiếm",
          price: 49,
          exp: 23,
          color: "#4fc3f7",
          zones: ["hang_ca", "song_bang"],
        },
        {
          name: "Cá Lóc Nhậu Say Quên Lối Về Bị Vợ Đuổi",
          emoji: "🍺",
          rarity: "Hiếm",
          price: 41,
          exp: 18,
          color: "#4fc3f7",
          zones: ["dam_lay", "bien_sau"],
        },
        {
          name: "Cá Hồi Phục Sức Khỏe Sau Khi Chia Tay Người Yêu",
          emoji: "🔨",
          rarity: "Hiếm",
          price: 46,
          exp: 21,
          color: "#4fc3f7",
          zones: ["song_bang"],
        },
        {
          name: "Cá Mập Săn Sale Shopee Giờ Linh Bị Ép Ship",
          emoji: "🏹",
          rarity: "Hiếm",
          price: 44,
          exp: 20,
          color: "#4fc3f7",
          zones: ["bien_sau"],
        },
        {
          name: "Cá Voi Đa Cấp Làm Giàu Không Khó Khóa VIP",
          emoji: "👨‍💼",
          rarity: "Hiếm",
          price: 47,
          exp: 21,
          color: "#4fc3f7",
          zones: ["bien_sau"],
        },
        {
          name: "Cá Thần Bài Đoán Toàn Sai Lệch Đề Miền Bắc",
          emoji: "👻",
          rarity: "Hiếm",
          price: 42,
          exp: 19,
          color: "#4fc3f7",
          zones: ["hang_ca", "song_bang"],
        },
        {
          name: "Bạch Tuộc Đột Biến Phun Mực Tím Viết Thư Tình",
          emoji: "🦑",
          rarity: "Hiếm",
          price: 43,
          exp: 19,
          color: "#4fc3f7",
          zones: ["bien_sau"],
        },
        {
          name: "Cá Rô Đồng Khóc Nhè Ngày Chủ Nhật Vì Hết Tiền",
          emoji: "🐜",
          rarity: "Hiếm",
          price: 39,
          exp: 17,
          color: "#4fc3f7",
          zones: ["dam_lay"],
        },
        {
          name: "Cá Chép Vượt Vũ Môn Hụt Vì Kẹt Xe Ngã Tư",
          emoji: "⛩️",
          rarity: "Hiếm",
          price: 45,
          exp: 20,
          color: "#4fc3f7",
          zones: ["dam_lay", "hang_ca"],
        },
        {
          name: "Cá Trê Quỷ Quyệt Thao Túng Tâm Lý Hội Chị Em",
          emoji: "🧠",
          rarity: "Hiếm",
          price: 44,
          exp: 19,
          color: "#4fc3f7",
          zones: ["dam_lay", "hang_ca"],
        },
        {
          name: "Cá Trắm Lực Sĩ Uống Whey Quá Liều Nổi Thớ Cơ",
          emoji: "💪",
          rarity: "Hiếm",
          price: 46,
          exp: 21,
          color: "#4fc3f7",
          zones: ["bien_sau", "song_bang"],
        },
        {
          name: "Cá Lóc Flexing Sổ Đỏ Ao Làng Khiến Dân Tình Ép",
          emoji: "📜",
          rarity: "Hiếm",
          price: 48,
          exp: 22,
          color: "#4fc3f7",
          zones: ["dam_lay"],
        },
        {
          name: "Cá Ngừ Đại Dương Thích Nhảy Tiktok Điệu Vô Tri",
          emoji: "💃",
          rarity: "Hiếm",
          price: 42,
          exp: 19,
          color: "#4fc3f7",
          zones: ["bien_sau"],
        },
        {
          name: "Cá Kiếm Cùn Rỉ Sét Rẻ Tiền Hay Ra Dẻ",
          emoji: "🗡️",
          rarity: "Siêu Bựa",
          price: 37,
          exp: 16,
          color: "#ab47bc",
          zones: ["hang_ca"],
        },
        {
          name: "Cá Trê Mặc Bikini Đi Tắm Biển Khoe Dáng Bựa",
          emoji: "👙",
          rarity: "Siêu Bựa",
          price: 45,
          exp: 20,
          color: "#ab47bc",
          zones: ["bien_sau"],
        },
        {
          name: "Cá Quả Tạ Gánh Team Kiệt Sức Đứt Cả Vây",
          emoji: "🏋️",
          rarity: "Siêu Bựa",
          price: 47,
          exp: 21,
          color: "#ab47bc",
          zones: ["dam_lay", "hang_ca"],
        },
        {
          name: "Cá Bơn Thích Sống Thử Thất Bại Quay Về Bố Mẹ",
          emoji: "💔",
          rarity: "Siêu Bựa",
          price: 40,
          exp: 18,
          color: "#ab47bc",
          zones: ["bien_sau"],
        },
        {
          name: "Cá Chình Bị Điện Giật Ngược Do Chạm Cáp Quang",
          emoji: "⚡",
          rarity: "Siêu Bựa",
          price: 46,
          exp: 20,
          color: "#ab47bc",
          zones: ["hang_ca", "song_bang"],
        },
        {
          name: "Cá Mập Cắn Cáp Quang Làm Mạng Ping 999ms",
          emoji: "🔌",
          rarity: "Siêu Bựa",
          price: 49,
          exp: 23,
          color: "#ab47bc",
          zones: ["bien_sau"],
        },
        {
          name: "Cá Heo Biết Nói Tiếng Người Kể Chuyện Đạo Lý",
          emoji: "🐬",
          rarity: "Siêu Bựa",
          price: 48,
          exp: 22,
          color: "#ab47bc",
          zones: ["bien_sau", "song_bang"],
        },
        {
          name: "Cá Ngựa Chạy Grab Kiếm Thêm Vàng Mua Thức Ăn",
          emoji: "🛵",
          rarity: "Siêu Bựa",
          price: 43,
          exp: 19,
          color: "#ab47bc",
          zones: ["dam_lay"],
        },
        {
          name: "Cá Chim Sợ Độ Cao Không Dám Nhảy Khỏi Nước",
          emoji: "🦅",
          rarity: "Siêu Bựa",
          price: 41,
          exp: 18,
          color: "#ab47bc",
          zones: ["song_bang"],
        },
        {
          name: "Cá Trê Mê Cờ Bạc Bịp Thua Sạch Tiền Cưới Vợ",
          emoji: "🎲",
          rarity: "Siêu Bựa",
          price: 39,
          exp: 17,
          color: "#ab47bc",
          zones: ["dam_lay"],
        },
        {
          name: "Cá Rồng Thả Thính Xanh Chín Cấp Đẳng Cao",
          emoji: "🐉",
          rarity: "Cực Hiếm",
          price: 120,
          exp: 50,
          color: "#29b6f6",
          zones: ["hang_ca", "vuc_toi"],
        },
        {
          name: "Cá Phóng Lợn Nẹt Pô Đêm Khuya Tổ Lái",
          emoji: "🔥",
          rarity: "Cực Hiếm",
          price: 135,
          exp: 55,
          color: "#29b6f6",
          zones: ["vuc_toi", "nha_may"],
        },
        {
          name: "Cá Trê Bạch Tạng Thích Sang Chảnh Đi Limousine",
          emoji: "👑",
          rarity: "Cực Hiếm",
          price: 125,
          exp: 52,
          color: "#29b6f6",
          zones: ["hang_ca", "vuc_toi"],
        },
        {
          name: "Cá Voi Bay Lượn Khóc Nhè Vì Mất Kính Râm",
          emoji: "☁️",
          rarity: "Cực Hiếm",
          price: 118,
          exp: 48,
          color: "#29b6f6",
          zones: ["song_bang", "nha_may"],
        },
        {
          name: "Cá Dương Tính Với Sự Đẹp Trai Huyễn Hoặc Bản Thân",
          emoji: "☀️",
          rarity: "Cực Hiếm",
          price: 130,
          exp: 53,
          color: "#29b6f6",
          zones: ["hang_ca", "song_bang"],
        },
        {
          name: "Cá Nguyệt Tộc Ngáo Đá Thích Ngắm Trăng Rằm",
          emoji: "🌙",
          rarity: "Cực Hiếm",
          price: 122,
          exp: 49,
          color: "#29b6f6",
          zones: ["hang_ca", "vuc_toi"],
        },
        {
          name: "Cá Ngựa Một Sừng Nghiện Trà Sữa Khoai Môn Kem Cheese",
          emoji: "🦄",
          rarity: "Cực Hiếm",
          price: 140,
          exp: 58,
          color: "#29b6f6",
          zones: ["song_bang", "nha_may"],
        },
        {
          name: "Cá Rô Phi Bật Super Saiyan 3 Tóc Vàng Khè",
          emoji: "⚡",
          rarity: "Cực Hiếm",
          price: 128,
          exp: 51,
          color: "#29b6f6",
          zones: ["vuc_toi", "nha_may"],
        },
        {
          name: "Cá Ngoài Hành Tinh Bị Bỏ Rơi Vì Trốn Tiền Vé",
          emoji: "👽",
          rarity: "Cực Hiếm",
          price: 132,
          exp: 54,
          color: "#29b6f6",
          zones: ["hang_ca", "vuc_toi"],
        },
        {
          name: "Cá Robot Chạy Bằng Cơm Thiu Vừa Bơi Vừa Rụng Bánh Răng",
          emoji: "🤖",
          rarity: "Cực Hiếm",
          price: 126,
          exp: 51,
          color: "#29b6f6",
          zones: ["hang_ca", "nha_may"],
        },
        {
          name: "Cá Trê Tổ Tiên Gánh Còng Lưng Đu Trend TikTok",
          emoji: "🕷️",
          rarity: "Cực Hiếm",
          price: 129,
          exp: 52,
          color: "#29b6f6",
          zones: ["vuc_toi", "nha_may"],
        },
        {
          name: "Cá Thổi Bong Bóng Khóc Thuê Cho Các Đám Ma Ao",
          emoji: "🫧",
          rarity: "Cực Hiếm",
          price: 124,
          exp: 50,
          color: "#29b6f6",
          zones: ["song_bang", "nha_may"],
        },
        {
          name: "Bộ Xương Cá Trê Chết Đuối Do Quên Cách Bơi",
          emoji: "💀",
          rarity: "Cực Hiếm",
          price: 127,
          exp: 51,
          color: "#29b6f6",
          zones: ["hang_ca", "vuc_toi"],
        },
        {
          name: "Cá Cát Lún Nhìn Thấu Hồng Trần Gian Khổ Cuộc Đời",
          emoji: "⏳",
          rarity: "Cực Hiếm",
          price: 131,
          exp: 53,
          color: "#29b6f6",
          zones: ["song_bang", "vuc_toi"],
        },
        {
          name: "Cá Đóng Băng Từ Thời Kỷ Băng Hà Vẫn Thích Khè",
          emoji: "❄️",
          rarity: "Cực Hiếm",
          price: 123,
          exp: 49,
          color: "#29b6f6",
          zones: ["song_bang"],
        },
        {
          name: "Cá Chim Bay Lượn Như Diều Gặp Gió Lốc Vũ Trụ",
          emoji: "💨",
          rarity: "Cực Hiếm",
          price: 128,
          exp: 51,
          color: "#29b6f6",
          zones: ["vuc_toi", "nha_may"],
        },
        {
          name: "Cá Trê Sống Lương Thiện Bất Ngờ Vì Sợ Bị Sét Đánh",
          emoji: "🌲",
          rarity: "Cực Hiếm",
          price: 125,
          exp: 50,
          color: "#29b6f6",
          zones: ["hang_ca"],
        },
        {
          name: "Cá Hồi Quang Phản Chiếu Cực Mạnh Trước Khi Lên Đĩa",
          emoji: "⛪",
          rarity: "Cực Hiếm",
          price: 133,
          exp: 54,
          color: "#29b6f6",
          zones: ["song_bang", "vuc_toi"],
        },
        {
          name: "Cá Trê Khổng Lồ Biết Nói Tiếng Người Đi Dạy Đạo Lý",
          emoji: "🌊",
          rarity: "Cực Hiếm",
          price: 129,
          exp: 52,
          color: "#29b6f6",
          zones: ["vuc_toi", "nha_may"],
        },
        {
          name: "Cá Hồi Nghiện Đèn Led Vũ Trường Bay Lắc Thâu Đêm",
          emoji: "💫",
          rarity: "Cực Hiếm",
          price: 126,
          exp: 51,
          color: "#29b6f6",
          zones: ["hang_ca", "song_bang"],
        },
        {
          name: "Cá Ngừ Thao Túng Tâm Lý Toàn Cầu Bán Khóa Học",
          emoji: "🌌",
          rarity: "Cực Hiếm",
          price: 134,
          exp: 55,
          color: "#29b6f6",
          zones: ["vuc_toi", "nha_may"],
        },
        {
          name: "Cá Mập Cuồng Yêu Đâm Bang Thất Tình Đi Khóc Dạo",
          emoji: "🎯",
          rarity: "Cực Hiếm",
          price: 127,
          exp: 51,
          color: "#29b6f6",
          zones: ["hang_ca", "vuc_toi"],
        },
        {
          name: "Cá Thủy Tinh Trong Suốt Hay Khóc Nhè Vô Tri Mất Não",
          emoji: "✨",
          rarity: "Cực Hiếm",
          price: 122,
          exp: 49,
          color: "#29b6f6",
          zones: ["song_bang"],
        },
        {
          name: "Cá Trê Đen Đủi Trốn Vợ Đi Nhậu Giang Hồ Quên Ví",
          emoji: "🌑",
          rarity: "Cực Hiếm",
          price: 128,
          exp: 51,
          color: "#29b6f6",
          zones: ["vuc_toi", "nha_may"],
        },
        {
          name: "Cá Trê Trầm Cảm Tự Soi Gương Khóc Ròng 8 Tiếng",
          emoji: "🪞",
          rarity: "Cực Hiếm",
          price: 125,
          exp: 50,
          color: "#29b6f6",
          zones: ["song_bang", "vuc_toi"],
        },
        {
          name: "Cá Rồng Thả Thính Đẳng Cấp Vip Pro Khè Người Nghèo",
          emoji: "👑",
          rarity: "Cực Hiếm",
          price: 135,
          exp: 55,
          color: "#29b6f6",
          zones: ["song_bang"],
        },
        {
          name: "Cá Phóng Lợn Đi Phượt Đêm Gặp Ma Đáy Biển Sợ Chạy",
          emoji: "🛵",
          rarity: "Cực Hiếm",
          price: 140,
          exp: 58,
          color: "#29b6f6",
          zones: ["vuc_toi"],
        },
        {
          name: "Cá Trê Vô Diện Thích Đi Bar Quẩy Sớm Hụt Mất Vàng",
          emoji: "👺",
          rarity: "Cực Hiếm",
          price: 130,
          exp: 52,
          color: "#29b6f6",
          zones: ["hang_ca", "nha_may"],
        },
        {
          name: "Cá Voi Đa Cấp Trưởng Phòng Kinh Doanh Úp Bô Đại Dương",
          emoji: "💼",
          rarity: "Cực Hiếm",
          price: 142,
          exp: 60,
          color: "#29b6f6",
          zones: ["nha_may"],
        },
        {
          name: "Cá Mập Úp Bô Chứng Khoán Toàn Sàn Đỏ Lè Cháy Acc",
          emoji: "📉",
          rarity: "Cực Hiếm",
          price: 138,
          exp: 56,
          color: "#29b6f6",
          zones: ["nha_may"],
        },
        {
          name: "Cá Nguyệt Tộc Ngáo Đá Giai Đoạn Cuối Bất Tỉnh Nhân Sự",
          emoji: "🥴",
          rarity: "Đột Biến",
          price: 124,
          exp: 50,
          color: "#ff7043",
          zones: ["vuc_toi"],
        },
        {
          name: "Cá Robot Chạy Bằng Cơm Thiu Bốc Mùi Khét Lẹt",
          emoji: "🤖",
          rarity: "Đột Biến",
          price: 129,
          exp: 52,
          color: "#ff7043",
          zones: ["hang_ca", "nha_may"],
        },
        {
          name: "Cá Cát Lún Nhìn Thấu Hồng Trần Gian Khổ Bỏ Đi Tu",
          emoji: "🧘",
          rarity: "Đột Biến",
          price: 133,
          exp: 54,
          color: "#ff7043",
          zones: ["song_bang"],
        },
        {
          name: "Cá Chép Móng Tay Dài Thích Sơn Gel Đu Trend Đính Đá",
          emoji: "💅",
          rarity: "Đột Biến",
          price: 126,
          exp: 51,
          color: "#ff7043",
          zones: ["hang_ca"],
        },
        {
          name: "Cá Trê Trầm Cảm Tự Soi Gương Khóc Nhè Khản Giọng",
          emoji: "😭",
          rarity: "Đột Biến",
          price: 125,
          exp: 50,
          color: "#ff7043",
          zones: ["hang_ca"],
        },
        {
          name: "Cá Mập Cuồng Yêu Đâm Bang Thất Tình Block Crush",
          emoji: "💔",
          rarity: "Đột Biến",
          price: 128,
          exp: 52,
          color: "#ff7043",
          zones: ["nha_may"],
        },
        {
          name: "Cá Thủy Tinh Khóc Nhè Trong Suốt Vô Tri Mất Trí Nhớ",
          emoji: "💧",
          rarity: "Đột Biến",
          price: 122,
          exp: 49,
          color: "#ff7043",
          zones: ["song_bang"],
        },
        {
          name: "Cá Kiếm Sát Thủ Cắt Tóc Dạo Vỉa Hè Chặt Chém Giá",
          emoji: "✂️",
          rarity: "Đột Biến",
          price: 131,
          exp: 53,
          color: "#ff7043",
          zones: ["hang_ca"],
        },
        {
          name: "Cá Mặt Trăng Đột Biến Gen Thích Ngủ Nướng Trễ Giờ Làm",
          emoji: "🛌",
          rarity: "Đột Biến",
          price: 127,
          exp: 51,
          color: "#ff7043",
          zones: ["vuc_toi"],
        },
        {
          name: "Cá Rùa Rụt Cổ Trốn Nợ Giang Hồ Đáy Ao Thần Linh",
          emoji: "🐢",
          rarity: "Đột Biến",
          price: 134,
          exp: 55,
          color: "#ff7043",
          zones: ["nha_may"],
        },
        {
          name: "Long Vương Vi Hành Bị Bắt Bài Đòi Tiền Chuộc Quỹ Đen",
          emoji: "👹",
          rarity: "Huyền Thoại",
          price: 300,
          exp: 120,
          color: "#ffca28",
          zones: ["vuc_toi", "tien_canh", "vu_tru"],
        },
        {
          name: "Cá Sư Tử Hà Đông Gầm Ra Lửa Tịch Thu Quỹ Đen Của Chồng",
          emoji: "🦁",
          rarity: "Huyền Thoại",
          price: 320,
          exp: 130,
          color: "#ffca28",
          zones: ["vuc_toi"],
        },
        {
          name: "Phượng Hoàng Lửa Luộc Sả Ớt Siêu Cay Thách Thức Đầu Bếp",
          emoji: "🔥",
          rarity: "Huyền Thoại",
          price: 340,
          exp: 140,
          color: "#ffca28",
          zones: ["nha_may", "tien_canh"],
        },
        {
          name: "Mãng Xà Biển Thích Cắn Trộm Quần Tắm Khoe Mông Người Ta",
          emoji: "🐍",
          rarity: "Huyền Thoại",
          price: 310,
          exp: 125,
          color: "#ffca28",
          zones: ["tien_canh", "vu_tru"],
        },
        {
          name: "Cá Quỷ Một Mắt Nhìn Thấu Ví Tiền Rỗng Không Của Ní",
          emoji: "👁️",
          rarity: "Huyền Thoại",
          price: 330,
          exp: 135,
          color: "#ffca28",
          zones: ["vuc_toi", "vu_tru"],
        },
        {
          name: "Cá Trê Tu Luyện 1000 Năm Thành Tinh Đi Copy Code AI",
          emoji: "🔮",
          rarity: "Huyền Thoại",
          price: 315,
          exp: 127,
          color: "#ffca28",
          zones: ["nha_may", "tien_canh"],
        },
        {
          name: "Cá Zombie Nghiện Đi Bộ Vu Vơ Tìm KPI Cuối Tháng",
          emoji: "🧟",
          rarity: "Huyền Thoại",
          price: 305,
          exp: 122,
          color: "#ffca28",
          zones: ["vuc_toi"],
        },
        {
          name: "Nàng Tiên Cá Thích Đi Bar Quên Váy Trốn Vé Cửa",
          emoji: "🧜‍♀️",
          rarity: "Huyền Thoại",
          price: 325,
          exp: 132,
          color: "#ffca28",
          zones: ["nha_may", "tien_canh"],
        },
        {
          name: "Vua Cá Trê Thao Túng Thị Trường Vàng Lậu Đáy Ao",
          emoji: "👑",
          rarity: "Huyền Thoại",
          price: 335,
          exp: 137,
          color: "#ffca28",
          zones: ["tien_canh", "vu_tru"],
        },
        {
          name: "Tôn Ngộ Không Biển Sâu Quậy Nát Thủy Cung Trốn Nợ",
          emoji: "🐒",
          rarity: "Huyền Thoại",
          price: 345,
          exp: 142,
          color: "#ffca28",
          zones: ["vuc_toi", "tien_canh"],
        },
        {
          name: "Cá Trê Triết Lý Hay Giảng Đạo Đức Trên MXH Bị Bóc Phốt",
          emoji: "🧠",
          rarity: "Huyền Thoại",
          price: 318,
          exp: 128,
          color: "#ffca28",
          zones: ["tien_canh", "vu_tru"],
        },
        {
          name: "Cá Mập Cơ Bắp Sáu Múi Đập Đá Phá Cáp Quang Quốc Tế",
          emoji: "⚒️",
          rarity: "Huyền Thoại",
          price: 328,
          exp: 133,
          color: "#ffca28",
          zones: ["vuc_toi", "nha_may"],
        },
        {
          name: "Nữ Hiệp Cá Chép Đi Đòi Nợ Thuê Cho FE Credit Ao",
          emoji: "⚔️",
          rarity: "Huyền Thoại",
          price: 332,
          exp: 136,
          color: "#ffca28",
          zones: ["tien_canh", "vu_tru"],
        },
        {
          name: "Cá Trê Ăn Chay Niệm Phật Trừ Nghiệp Tự Sướng Sống Ảo",
          emoji: "🧘",
          rarity: "Huyền Thoại",
          price: 312,
          exp: 126,
          color: "#ffca28",
          zones: ["vuc_toi", "vu_tru"],
        },
        {
          name: "Thích Khách Cá Thu Ám Sát Đầu Bếp Nhà Hàng Thất Bại",
          emoji: "🥋",
          rarity: "Huyền Thoại",
          price: 322,
          exp: 131,
          color: "#ffca28",
          zones: ["nha_may", "vu_tru"],
        },
        {
          name: "Cá Mực Cuồng Phong Thích Xoay Com Pa Tạo Bão Táp Đáy Ao",
          emoji: "💨",
          rarity: "Huyền Thoại",
          price: 327,
          exp: 132,
          color: "#ffca28",
          zones: ["vuc_toi", "tien_canh"],
        },
        {
          name: "Kỵ Sĩ Cá Ngựa Phi Xe Đạp Điện Hết Pin Giữa Trưa Nắng",
          emoji: "🌙",
          rarity: "Huyền Thoại",
          price: 317,
          exp: 128,
          color: "#ffca28",
          zones: ["vuc_toi", "nha_may"],
        },
        {
          name: "Pháp Sư Cá Hồi Phán Đâu Trúng Đó Trừ Giải Đặc Biệt",
          emoji: "🧙‍♂️",
          rarity: "Huyền Thoại",
          price: 324,
          exp: 131,
          color: "#ffca28",
          zones: ["tien_canh", "vu_tru"],
        },
        {
          name: "Cá Voi Vàng Triệu Đô Chỉ Để Ngắm Tuyệt Đối Không Cho Bán",
          emoji: "🌟",
          rarity: "Huyền Thoại",
          price: 338,
          exp: 139,
          color: "#ffca28",
          zones: ["tien_canh", "vu_tru"],
        },
        {
          name: "Cụ Cá Trê Tổ Cổ Đại Chống Gậy Đi Đu Đêm Bar Sàn",
          emoji: "👴",
          rarity: "Huyền Thoại",
          price: 314,
          exp: 127,
          color: "#ffca28",
          zones: ["vuc_toi", "nha_may"],
        },
        {
          name: "Cá Voi Xanh Đầu Tư Tiền Số Trúng Đậm Đổi Đời Lên Hương",
          emoji: "📈",
          rarity: "Thần Thoại",
          price: 350,
          exp: 145,
          color: "#ec407a",
          zones: ["vu_tru"],
        },
        {
          name: "Cá Trê Chúa Tể Có Sừng Tê Giác Đột Biến 5 Mắt Vô Tri",
          emoji: "🦏",
          rarity: "Thần Thoại",
          price: 330,
          exp: 138,
          color: "#ec407a",
          zones: ["vuc_toi"],
        },
        {
          name: "Cá Ngầm Mật Thám Cục Tình Báo Biển Đông Đi Trộm Code",
          emoji: "🕵️",
          rarity: "Thần Thoại",
          price: 325,
          exp: 132,
          color: "#ec407a",
          zones: ["nha_may"],
        },
        {
          name: "Cá Mập Trắng Đọc Lệnh Thổi Nến Chứng Khoán Sập Sàn",
          emoji: "🕯️",
          rarity: "Thần Thoại",
          price: 340,
          exp: 141,
          color: "#ec407a",
          zones: ["vu_tru"],
        },
        {
          name: "Cá Phượng Hoàng Tái Sinh Từ Tro Bếp Lò Gạch Bỏ Hoang",
          emoji: "🐦",
          rarity: "Thần Thoại",
          price: 355,
          exp: 150,
          color: "#ec407a",
          zones: ["tien_canh"],
        },
        {
          name: "Cá Rồng Vàng Ngậm Kim Cương Giả Mua Sale Shopee 1k",
          emoji: "💎",
          rarity: "Thần Thoại",
          price: 360,
          exp: 152,
          color: "#ec407a",
          zones: ["tien_canh"],
        },
        {
          name: "Cá Ngựa Thần Biết Bay Lượn Khắp Mương Nước Thất Tình",
          emoji: "🦄",
          rarity: "Thần Thoại",
          price: 318,
          exp: 129,
          color: "#ec407a",
          zones: ["vu_tru"],
        },
        {
          name: "Cá Mặt Quỷ Đã Qua Phẫu Thuật Thẩm Mỹ Lỗi Ở Thẩm Mỹ Viện",
          emoji: "👺",
          rarity: "Thần Thoại",
          price: 312,
          exp: 126,
          color: "#ec407a",
          zones: ["vuc_toi"],
        },
        {
          name: "Cá Chình Hoàng Gia Mặc Long Bào Sặc Sỡ Đi Quẩy Quán Net",
          emoji: "👑",
          rarity: "Thần Thoại",
          price: 365,
          exp: 155,
          color: "#ec407a",
          zones: ["tien_canh"],
        },
        {
          name: "Cá Hồi Vĩnh Hằng Không Bao Giờ Chết Đuối Thách Thức Lẩu",
          emoji: "♾️",
          rarity: "Thần Thoại",
          price: 370,
          exp: 160,
          color: "#ec407a",
          zones: ["vu_tru"],
        },
        {
          name: "Cá Trê Bay Lên Trời Thành Tiên Bị Thiên Đình Trả Hàng",
          emoji: "🌟",
          rarity: "Tối Cao",
          price: 750,
          exp: 400,
          color: "#ef5350",
          zones: ["tien_canh", "vu_tru"],
          achievement:
            "🏆 THÀNH TỰU: 'Cá Chép Hóa Rồng Có Gì Lạ, Cá Trê Lên Trời Mới Chất!'",
        },
        {
          name: "Quái Vật Đáy Biển Nghiện Xem Phim Ma Sợ Ma Cà Rồng",
          emoji: "👾",
          rarity: "Tối Cao",
          price: 800,
          exp: 450,
          color: "#ef5350",
          zones: ["vuc_toi", "vu_tru"],
          achievement:
            "🏆 THÀNH TỰU: 'Kẻ Vô Tri Đứng Đầu Chuỗi Thức Ăn Kinh Dị!'",
        },
        {
          name: "Thực Thể Ngáo Ngơ Thao Túng Vũ Trụ Quên Mang Theo Não",
          emoji: "🎭",
          rarity: "Tối Cao",
          price: 850,
          exp: 480,
          color: "#ef5350",
          zones: ["tien_canh", "vu_tru"],
          achievement:
            "🏆 THÀNH TỰU: 'Đấng Tối Thượng Nhưng Đầu Óc Lúc Nào Cũng Trên Mây!'",
        },
        {
          name: "Cá Trê Vô Diện Chuyên Ăn Vạ Đệ Nhất Khóc Nhè Ao Làng",
          emoji: "😶",
          rarity: "Tối Cao",
          price: 900,
          exp: 500,
          color: "#ef5350",
          zones: ["tien_canh", "vu_tru"],
          achievement:
            "🏆 THÀNH TỰU: 'Mặt Dày Vô Diện Khóc Nhè Đệ Nhất Biển Sâu!'",
        },
        {
          name: "Cá Trê Bất Tử Bị Sét Đánh Né Quả Báo Cực Gắt Thiên Đình",
          emoji: "🌌",
          rarity: "Tối Cao",
          price: 999,
          exp: 550,
          color: "#ef5350",
          zones: ["tien_canh", "vu_tru"],
          achievement:
            "🏆 THÀNH TỰU: 'Né Quả Báo Cực Gắt, Thiên Đình Cũng Phải Chào Thua!'",
        },
        {
          name: "Đấng Tạo Hóa Cá Lóc Khởi Tạo Cả Thiên Hà Vô Tri",
          emoji: "🌍",
          rarity: "Vô Tri",
          price: 950,
          exp: 520,
          color: "#00e5ff",
          zones: ["tien_canh", "vu_tru"],
          achievement:
            "🏆 THÀNH TỰU: 'Chúa Tể Đồng Ruộng Khởi Tạo Cả Thiên Hà!'",
        },
        {
          name: "Thần Tổ Cá Rô Phi Toàn Năng Thích Ăn Miến Vỉa Hè Đêm",
          emoji: "⚛️",
          rarity: "Vô Tri",
          price: 888,
          exp: 480,
          color: "#00e5ff",
          zones: ["tien_canh", "vu_tru"],
          achievement:
            "🏆 THÀNH TỰU: 'Sức Mạng Tuyệt Đối Nhưng Đam Mê Ẩm Thực Vỉa Hè!'",
        },
        {
          name: "Cá Trê Hư Vô Thách Thức Mọi Nồi Lẩu Đầu Bếp Khóc Ròng",
          emoji: "🌪️",
          rarity: "Vô Tri",
          price: 920,
          exp: 510,
          color: "#00e5ff",
          zones: ["tien_canh", "vu_tru"],
          achievement:
            "🏆 THÀNH TỰU: 'Thực Thể Không Thể Bị Luộc Chín Thách Thức Đầu Bếp!'",
        },
        {
          name: "Cá Trê Vĩnh Hằng Chờ Sếp Tăng Lương Đến Kỷ Băng Hà Tiếp",
          emoji: "♾️",
          rarity: "Vô Tri",
          price: 875,
          exp: 490,
          color: "#00e5ff",
          zones: ["tien_canh", "vu_tru"],
          achievement:
            "🏆 THÀNH TỰU: 'Kiên Nhẫn Vô Hạn, Đợi Chờ Đến Kỷ Băng Hà Tiếp Theo!'",
        },
        {
          name: "Hoàng Đế Vô Địch Toàn Bộ Gia Tộc Cá Trê Bất Ổn Tối Thượng",
          emoji: "🔯",
          rarity: "Vô Tri",
          price: 999,
          exp: 550,
          color: "#00e5ff",
          zones: ["tien_canh", "vu_tru"],
                    achievement:
            "🏆 THÀNH TỰU: 'HOÀNG ĐẾ VÔ ĐỊCH: Kẻ Đứng Đầu Toàn Bộ Gia Tộc Cá Trê Bất Ổn!'",
        },
      ];

      fishList.push(
        {
          name: "Cá Rô Phi Cầm Bằng Đại Học Nhưng Đi Giao Cơm",
          emoji: "🎓",
          rarity: "Hiếm",
          tier: "Giang Hồ Sông Nước",
          minLevel: 5,
          price: 82,
          exp: 32,
          color: "#e91e63",
          zones: ["ho_nuoc", "khu_bi_mat"],
        },
        {
          name: "Cá Trê Chấm Công Hộ Rồi Lặn Mất Tăm",
          emoji: "🕘",
          rarity: "Hiếm",
          tier: "Giang Hồ Sông Nước",
          minLevel: 6,
          price: 88,
          exp: 34,
          color: "#e91e63",
          zones: ["dam_lay", "khu_bi_mat"],
        },
        {
          name: "Cá Lóc Livestream Bán Khóa Học Thở Dưới Nước",
          emoji: "📹",
          rarity: "Hiếm",
          tier: "Giang Hồ Sông Nước",
          minLevel: 7,
          price: 92,
          exp: 36,
          color: "#e91e63",
          zones: ["bien_sau", "khu_bi_mat"],
        },
        {
          name: "Cá Kèo Đòi Tip Vì Đã Tự Mắc Câu",
          emoji: "🧾",
          rarity: "Siêu Bựa",
          tier: "Giang Hồ Sông Nước",
          minLevel: 8,
          price: 112,
          exp: 42,
          color: "#ab47bc",
          zones: ["khu_bi_mat", "dam_lay"],
        },
        {
          name: "Cá Chép Đi Thi Idol Bị Loại Vì Hát Như Máy Bơm",
          emoji: "🎤",
          rarity: "Siêu Bựa",
          tier: "Giang Hồ Sông Nước",
          minLevel: 8,
          price: 118,
          exp: 44,
          color: "#ab47bc",
          zones: ["ho_nuoc", "khu_bi_mat"],
        },
        {
          name: "Cá Bống Bấm Máy Tính Sai Nhưng Cãi Rất To",
          emoji: "🧮",
          rarity: "Siêu Bựa",
          tier: "Giang Hồ Sông Nước",
          minLevel: 9,
          price: 116,
          exp: 43,
          color: "#ab47bc",
          zones: ["song_nuoc", "khu_bi_mat"],
        },
        {
          name: "Cá Trê Ba Mắt Đọc Điều Khoản Sử Dụng Không Chớp",
          emoji: "👁️",
          rarity: "Cực Hiếm",
          tier: "Trùm Khu Nước Đục",
          minLevel: 10,
          price: 145,
          exp: 58,
          color: "#29b6f6",
          zones: ["khu_bi_mat", "suoi_doc"],
        },
        {
          name: "Cá Hồi Đột Biến Sợ Nước Nhưng Mê Đi Biển",
          emoji: "🧬",
          rarity: "Đột Biến",
          tier: "Trùm Khu Nước Đục",
          minLevel: 12,
          price: 156,
          exp: 62,
          color: "#ff7043",
          zones: ["khu_bi_mat", "bien_sau"],
        },
        {
          name: "Cá Mập Văn Phòng Gửi Mail Như Trao Đổi",
          emoji: "📧",
          rarity: "Cực Hiếm",
          tier: "Trùm Khu Nước Đục",
          minLevel: 11,
          price: 150,
          exp: 60,
          color: "#29b6f6",
          zones: ["bien_sau", "nha_may", "khu_bi_mat"],
        },
        {
          name: "Cá Chình Cắm Sạc Nhanh Làm Cháy Cả Đáy Ao",
          emoji: "🔌",
          rarity: "Đột Biến",
          tier: "Trùm Khu Nước Đục",
          minLevel: 13,
          price: 162,
          exp: 64,
          color: "#ff7043",
          zones: ["suoi_doc", "nha_may", "khu_bi_mat"],
        },
        {
          name: "Cá Nóc Influen Ao Review Nước Đục Năm Sao",
          emoji: "⭐",
          rarity: "Cực Hiếm",
          tier: "Trùm Khu Nước Đục",
          minLevel: 12,
          price: 148,
          exp: 59,
          color: "#29b6f6",
          zones: ["dam_lay", "khu_bi_mat"],
        },
        {
          name: "Cá Kiếm Mở Spa Cắt Tỉa Rong Rêu Giá Cắt Cổ",
          emoji: "✂️",
          rarity: "Đột Biến",
          tier: "Trùm Khu Nước Đục",
          minLevel: 14,
          price: 166,
          exp: 66,
          color: "#ff7043",
          zones: ["hang_ca", "khu_bi_mat"],
        },
        {
          name: "Cá Đuối Né Deadline Bằng Cách Giả Làm Thảm",
          emoji: "🧺",
          rarity: "Cực Hiếm",
          tier: "Trùm Khu Nước Đục",
          minLevel: 13,
          price: 152,
          exp: 61,
          color: "#29b6f6",
          zones: ["song_bang", "khu_bi_mat"],
        },
        {
          name: "Long Vương Thử Việc Ba Ngày Đòi Lương CEO",
          emoji: "🐉",
          rarity: "Huyền Thoại",
          tier: "Đại Ca Đáy Ao",
          minLevel: 18,
          price: 360,
          exp: 150,
          color: "#ffca28",
          zones: ["khu_bi_mat", "tien_canh"],
        },
        {
          name: "Cá Voi Tài Chính Tư Vấn All In Rong Biển",
          emoji: "📊",
          rarity: "Huyền Thoại",
          tier: "Đại Ca Đáy Ao",
          minLevel: 20,
          price: 372,
          exp: 154,
          color: "#ffca28",
          zones: ["vuc_toi", "khu_bi_mat"],
        },
        {
          name: "Cá Rồng Bán NFT Bong Bóng Xà Phòng Đáy Ao",
          emoji: "🫧",
          rarity: "Thần Thoại",
          tier: "Huyền Thoại Chưa Rửa Bát",
          minLevel: 25,
          price: 430,
          exp: 185,
          color: "#ec407a",
          zones: ["tien_canh", "khu_bi_mat"],
          hidden: 1,
        },
        {
          name: "Thần Cá Trê Chứng Khoán Xanh Ba Phút Rồi Sập",
          emoji: "📉",
          rarity: "Thần Thoại",
          tier: "Huyền Thoại Chưa Rửa Bát",
          minLevel: 26,
          price: 440,
          exp: 190,
          color: "#ec407a",
          zones: ["vuc_toi", "khu_bi_mat"],
          hidden: 1,
        },
        {
          name: "Nàng Tiên Cá Bùng Kèo Vì Kẹt Xe Dưới Biển",
          emoji: "🧜‍♀️",
          rarity: "Huyền Thoại",
          tier: "Đại Ca Đáy Ao",
          minLevel: 19,
          price: 352,
          exp: 148,
          color: "#ffca28",
          zones: ["bien_sau", "tien_canh"],
        },
        {
          name: "Cá Mập Luật Sư Cãi Thắng Cả Lưỡi Câu",
          emoji: "⚖️",
          rarity: "Huyền Thoại",
          tier: "Đại Ca Đáy Ao",
          minLevel: 21,
          price: 365,
          exp: 152,
          color: "#ffca28",
          zones: ["vuc_toi", "bien_sau"],
        },
        {
          name: "Cá Hồi Tiên Tri Biết Trước Bị Nướng Nhưng Vẫn Lên",
          emoji: "🔮",
          rarity: "Thần Thoại",
          tier: "Huyền Thoại Chưa Rửa Bát",
          minLevel: 25,
          price: 420,
          exp: 180,
          color: "#ec407a",
          zones: ["song_bang", "tien_canh"],
        },
        {
          name: "Cá Ngừ Tổng Tài Ký Hợp Đồng Bằng Vây Run",
          emoji: "💼",
          rarity: "Thần Thoại",
          tier: "Huyền Thoại Chưa Rửa Bát",
          minLevel: 27,
          price: 448,
          exp: 194,
          color: "#ec407a",
          zones: ["nha_may", "tien_canh"],
        },
        {
          name: "Cá Rô Đồng Đeo AirPods Nghe Sóng Não Crush",
          emoji: "🎧",
          rarity: "Hiếm",
          tier: "Giang Hồ Sông Nước",
          minLevel: 5,
          price: 86,
          exp: 33,
          color: "#e91e63",
          zones: ["song_nuoc", "ho_nuoc"],
        },
        {
          name: "Cá Thu Đi Họp Phụ Huynh Cho Cá Con Học Dốt",
          emoji: "📝",
          rarity: "Đột Biến",
          tier: "Trùm Khu Nước Đục",
          minLevel: 15,
          price: 170,
          exp: 68,
          color: "#ff7043",
          zones: ["dam_lay", "song_bang"],
        },
        {
          name: "Cá Mè Tự Ái Vì Bị Gọi Là Cá Mè",
          emoji: "😤",
          rarity: "Siêu Bựa",
          tier: "Giang Hồ Sông Nước",
          minLevel: 8,
          price: 110,
          exp: 41,
          color: "#ab47bc",
          zones: ["dam_lay", "ho_nuoc"],
        },
        {
          name: "Cá Robot Chạy Windows Lậu Đang Update Giữa Dòng",
          emoji: "🤖",
          rarity: "Đột Biến",
          tier: "Trùm Khu Nước Đục",
          minLevel: 16,
          price: 174,
          exp: 70,
          color: "#ff7043",
          zones: ["nha_may", "song_bang"],
        },
        {
          name: "Cá Tuyết Đóng Băng Cảm Xúc Vì Bị Seen Không Rep",
          emoji: "🧊",
          rarity: "Cực Hiếm",
          tier: "Trùm Khu Nước Đục",
          minLevel: 15,
          price: 158,
          exp: 63,
          color: "#29b6f6",
          zones: ["song_bang"],
        },
        {
          name: "Cá Mập Meta Tự Nerf Vì Quá Mạnh",
          emoji: "🛠️",
          rarity: "Tối Cao",
          tier: "Sinh Vật Không Nên Tồn Tại",
          minLevel: 30,
          price: 1020,
          exp: 560,
          color: "#ef5350",
          zones: ["vu_tru", "tien_canh"],
          hidden: 2,
        },
        {
          name: "Đấng Cá Trê Debug Vũ Trụ Bằng Console Log",
          emoji: "🖥️",
          rarity: "Vô Tri",
          tier: "Lỗi Hệ Thống Biết Bơi",
          minLevel: 35,
          price: 1111,
          exp: 620,
          color: "#00e5ff",
          zones: ["vu_tru"],
          hidden: 2,
        },
        {
          name: "Thực Thể Cá Mè Quên Render Nhưng Vẫn Có Hitbox",
          emoji: "📦",
          rarity: "Vô Tri",
          tier: "Lỗi Hệ Thống Biết Bơi",
          minLevel: 35,
          price: 1088,
          exp: 600,
          color: "#00e5ff",
          zones: ["vu_tru", "khu_bi_mat"],
          hidden: 2,
        },
        {
          name: "Cá Lóc Vô Tri Nuốt Mặt Trăng Rồi Hỏi Ai Tắt Đèn",
          emoji: "🌑",
          rarity: "Vô Tri",
          tier: "Lỗi Hệ Thống Biết Bơi",
          minLevel: 36,
          price: 1120,
          exp: 640,
          color: "#00e5ff",
          zones: ["vu_tru"],
          hidden: 2,
        },
        {
          name: "Hoàng Đế Cá Rô Phi Ban Sắc Lệnh Cấm Mưa",
          emoji: "👑",
          rarity: "Tối Cao",
          tier: "Sinh Vật Không Nên Tồn Tại",
          minLevel: 31,
          price: 980,
          exp: 540,
          color: "#ef5350",
          zones: ["tien_canh", "vu_tru"],
          hidden: 1,
        },
        {
          name: "Cá Chép Hóa Rồng Nhưng Quên Đổi Avatar",
          emoji: "🐲",
          rarity: "Tối Cao",
          tier: "Sinh Vật Không Nên Tồn Tại",
          minLevel: 30,
          price: 995,
          exp: 550,
          color: "#ef5350",
          zones: ["tien_canh", "vu_tru"],
          hidden: 1,
        },
        {
          name: "Sinh Vật Ao Làng Ping 999 Vẫn Né Được Lưỡi Câu",
          emoji: "📶",
          rarity: "Tối Cao",
          tier: "Sinh Vật Không Nên Tồn Tại",
          minLevel: 32,
          price: 1040,
          exp: 575,
          color: "#ef5350",
          zones: ["vu_tru", "vuc_toi"],
          hidden: 2,
        },
        {
          name: "Lỗi 404 Cá Không Tồn Tại Nhưng Bán Được Chín Trăm Chín",
          emoji: "❓",
          rarity: "Vô Tri",
          tier: "Lỗi Hệ Thống Biết Bơi",
          minLevel: 37,
          price: 999,
          exp: 599,
          color: "#00e5ff",
          zones: ["vu_tru", "khu_bi_mat"],
          hidden: 2,
        },
        {
          name: "Cá Trê Trầm Cảm Đắp Chăn Lạnh Như Deadline Tháng Mười Hai",
          emoji: "🥶",
          rarity: "Huyền Thoại",
          tier: "Đại Ca Đáy Ao",
          minLevel: 18,
          price: 348,
          exp: 146,
          color: "#ffca28",
          zones: ["song_bang", "vuc_toi"],
        },
        {
          name: "Cá Voi Nhà Máy Thở Ra Khói Nhưng Claim Sống Xanh",
          emoji: "🏭",
          rarity: "Thần Thoại",
          tier: "Huyền Thoại Chưa Rửa Bát",
          minLevel: 26,
          price: 436,
          exp: 188,
          color: "#ec407a",
          zones: ["nha_may", "vu_tru"],
        },
        {
          name: "Cá Hố Bí Mật Giữ Pass Wifi Cả Thủy Cung",
          emoji: "🔐",
          rarity: "Cực Hiếm",
          tier: "Trùm Khu Nước Đục",
          minLevel: 10,
          price: 149,
          exp: 59,
          color: "#29b6f6",
          zones: ["khu_bi_mat"],
          hidden: 1,
        },
        // NEW BATCH OF FISH (ĐẠI LỘ ẢO LÒI - LV 35)
        {
          name: "Cá Trê Dùng App Meitu Gánh Cong Cả Cột Nhà",
          emoji: "🤳",
          rarity: "Ảo Lòi",
          tier: "Sinh Vật Không Nên Tồn Tại",
          minLevel: 35,
          price: 1250,
          exp: 680,
          color: "#00ffcc",
          zones: ["dai_lo_ao"]
        },
        {
          name: "Cá Chép Nhận Vơ Làm Con Nuôi Tỷ Phú",
          emoji: "💵",
          rarity: "Ảo Lòi",
          tier: "Sinh Vật Không Nên Tồn Tại",
          minLevel: 35,
          price: 1220,
          exp: 670,
          color: "#00ffcc",
          zones: ["dai_lo_ao"]
        },
        {
          name: "Cá Mập Photoshop Bóp Eo Thon Như Ngọc Trinh",
          emoji: "👙",
          rarity: "Ảo Lòi",
          tier: "Sinh Vật Không Nên Tồn Tại",
          minLevel: 35,
          price: 1290,
          exp: 700,
          color: "#00ffcc",
          zones: ["dai_lo_ao"]
        },
        {
          name: "Cá Hồi Đăng Ảnh Đi Ghi Hình Show Thực Tế",
          emoji: "🎥",
          rarity: "Ảo Lòi",
          tier: "Sinh Vật Không Nên Tồn Tại",
          minLevel: 35,
          price: 1260,
          exp: 690,
          color: "#00ffcc",
          zones: ["dai_lo_ao"]
        },
        {
          name: "Cá Ngừ Tự Phong Danh Hiệu Chúa Tể Check-in",
          emoji: "📍",
          rarity: "Ảo Lòi",
          tier: "Sinh Vật Không Nên Tồn Tại",
          minLevel: 35,
          price: 1200,
          exp: 650,
          color: "#00ffcc",
          zones: ["dai_lo_ao"]
        },
        {
          name: "Cá Trích Kiếm Tiền Online Bằng Cách Xem Quảng Cáo",
          emoji: "📺",
          rarity: "Thần Thoại",
          tier: "Huyền Thoại Chưa Rửa Bát",
          minLevel: 35,
          price: 510,
          exp: 210,
          color: "#ec407a",
          zones: ["dai_lo_ao"]
        },
        // NEW BATCH OF FISH (ĐÁY XÃ HỘI - LV 40)
        {
          name: "Cá Trê Trốn Nợ Bị Dán Ảnh Khắp Cột Điện",
          emoji: "🧻",
          rarity: "Đáy Xã Hội",
          tier: "Lỗi Hệ Thống Biết Bơi",
          minLevel: 40,
          price: 1450,
          exp: 800,
          color: "#8a8a8a",
          zones: ["day_xa_hoi"]
        },
        {
          name: "Cá Lóc All-in Coin Rác Đu Đỉnh 3 Năm Chưa Về Bờ",
          emoji: "📉",
          rarity: "Đáy Xã Hội",
          tier: "Lỗi Hệ Thống Biết Bơi",
          minLevel: 40,
          price: 1420,
          exp: 780,
          color: "#8a8a8a",
          zones: ["day_xa_hoi"]
        },
        {
          name: "Cá Chép Chạy Grab 24h Vẫn Bị Khách Hủy Kèo",
          emoji: "🛵",
          rarity: "Đáy Xã Hội",
          tier: "Lỗi Hệ Thống Biết Bơi",
          minLevel: 40,
          price: 1390,
          exp: 760,
          color: "#8a8a8a",
          zones: ["day_xa_hoi"]
        },
        {
          name: "Cá Rô Đồng Thuê Nhà Trọ 8m2 Không Có Cửa Sổ",
          emoji: "🏚️",
          rarity: "Đáy Xã Hội",
          tier: "Lỗi Hệ Thống Biết Bơi",
          minLevel: 40,
          price: 1410,
          exp: 770,
          color: "#8a8a8a",
          zones: ["day_xa_hoi"]
        },
        {
          name: "Cá Thu Bị Vợ Quản Lý Chi Tiêu Năm Nghìn Một Ngày",
          emoji: "🪙",
          rarity: "Đáy Xã Hội",
          tier: "Lỗi Hệ Thống Biết Bơi",
          minLevel: 40,
          price: 1480,
          exp: 820,
          color: "#8a8a8a",
          zones: ["day_xa_hoi"]
        },
        {
          name: "Cá Mập Vay Nợ App Tín Dụng Đen Bị Gọi Điện Khủng Bố",
          emoji: "📞",
          rarity: "Đáy Xã Hội",
          tier: "Lỗi Hệ Thống Biết Bơi",
          minLevel: 40,
          price: 1500,
          exp: 850,
          color: "#8a8a8a",
          zones: ["day_xa_hoi"]
        }
      );
