/**
 * boss-system.js
 * Chứa dữ liệu Cá Boss của từng vùng nước và cơ chế QTE (Quick Time Event) để "đấm" Boss.
 * LƯU Ý: File này được tạo theo yêu cầu nhưng KHÔNG được tích hợp trực tiếp vào mạch game chính.
 */

const bossPool = {
  song_nuoc: {
    name: "🐋 Cá Trê Tổng Tài Học Yêu",
    hp: 15, // Số lần bấm cần thiết
    timeLimit: 12, // Giờ giới hạn (giây)
    desc: "Cá Trê có râu dài như râu rồng, chuyên nói đạo lý tình yêu trên TikTok. Sức sát thương tinh thần cực lớn!",
    reward: { gold: 150, title: "Kẻ Huỷ Diệt Tổng Tài" }
  },
  ho_nuoc: {
    name: "🐢 Cụ Rùa Đòi Rửa Bát Hộ",
    hp: 20,
    timeLimit: 10,
    desc: "Cụ rùa thọ 100 tuổi nhưng đam mê rửa chén bát bằng xà phòng lỏ. Gặp cụ là chỉ có nước rửa tay!",
    reward: { gold: 300, title: "Chúa Tể Nước Rửa Chén" }
  },
  suoi_doc: {
    name: "🐟 Cá Chép 3 Mắt Biết Bay",
    hp: 25,
    timeLimit: 10,
    desc: "Đột biến phóng xạ cấp độ vũ trụ. Nó không bơi dưới nước mà bay lơ lửng chửi thề bằng tiếng Alien.",
    reward: { gold: 500, title: "Nhà Đột Biến Học Vô Tri" }
  },
  bien_sau: {
    name: "🦈 Cá Mập CEO Đa Cấp",
    hp: 30,
    timeLimit: 8,
    desc: "Nó sẽ dụ bạn mua gói đầu tư 'Lưới Câu Vô Cực' với lãi suất 999%/ngày. Rất khó nuốt!",
    reward: { gold: 800, title: "Nạn Nhân Đa Cấp" }
  },
  vuc_toi: {
    name: "🐙 Kraken Ăn Vạ Chuyên Nghiệp",
    hp: 35,
    timeLimit: 8,
    desc: "Mực khổng lồ 8 vòi. Cứ chạm nhẹ vào râu nó là nó lăn ra đất khóc lóc đòi bồi thường 500đ tiền thuốc men.",
    reward: { gold: 1200, title: "Chúa Tể Giải Quyết Tranh Chấp" }
  },
  vu_tru: {
    name: "🌌 Vị Thần Cá Trê Mù Chữ Vô Cực",
    hp: 50,
    timeLimit: 7,
    desc: "Thực thể tối cao của Thiên Hà Vô Tri. Thần có sức mạnh huỷ diệt nhưng không biết đọc bảng chữ cái.",
    reward: { gold: 2000, title: "Đấng Xoá Mù Chữ Vũ Trụ" }
  },
  dai_lo_ao: {
    name: "🤳 Cá Trê Đệ Nhất Meitu",
    hp: 60,
    timeLimit: 7,
    desc: "Nó dùng app chỉnh ảnh bóp nát không gian xung quanh, khiến cần câu của bạn bị cong vẹo bất thường!",
    reward: { gold: 2500, title: "Kẻ Bóc Phốt Sống Ảo" }
  },
  day_xa_hoi: {
    name: "📉 Cá Lóc Chúa Tể Đu Đỉnh",
    hp: 70,
    timeLimit: 6,
    desc: "Kẻ all-in coin rác mất hết tất cả, nó sẽ bám lấy chân bạn để xin tiền đổ xăng chạy Grab!",
    reward: { gold: 3000, title: "Chúa Tể Về Bờ" }
  }
};

class BossQTE {
  constructor(bossKey) {
    this.boss = bossPool[bossKey] || bossPool.song_nuoc;
    this.currentHits = 0;
    this.timer = null;
    this.timeLeft = this.boss.timeLimit;
    this.isActive = false;
  }

  start(onProgress, onSuccess, onFailure) {
    this.isActive = true;
    this.currentHits = 0;
    this.timeLeft = this.boss.timeLimit;

    // Bắt đầu đếm ngược
    this.timer = setInterval(() => {
      this.timeLeft--;
      if (onProgress) {
        onProgress({
          timeLeft: this.timeLeft,
          progress: (this.currentHits / this.boss.hp) * 100,
          currentHits: this.currentHits,
          targetHits: this.boss.hp
        });
      }

      if (this.timeLeft <= 0) {
        this.end(false, onFailure);
      }
    }, 1000);
  }

  // Người chơi bấm nút (mash button) để tấn công
  hit(onProgress, onSuccess) {
    if (!this.isActive) return;

    this.currentHits++;
    if (onProgress) {
      onProgress({
        timeLeft: this.timeLeft,
        progress: (this.currentHits / this.boss.hp) * 100,
        currentHits: this.currentHits,
        targetHits: this.boss.hp
      });
    }

    if (this.currentHits >= this.boss.hp) {
      this.end(true, onSuccess);
    }
  }

  end(isWin, callback) {
    this.isActive = false;
    clearInterval(this.timer);
    if (callback) {
      callback({
        isWin: isWin,
        bossName: this.boss.name,
        reward: isWin ? this.boss.reward : null
      });
    }
  }
}

// Export ra window hoặc module tùy môi trường
if (typeof window !== "undefined") {
  window.bossPool = bossPool;
  window.BossQTE = BossQTE;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = { bossPool, BossQTE };
}
