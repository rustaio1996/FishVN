/**
 * season-system.js
 * Hệ thống Bảng Xếp Hạng Mùa & Thử Thách cho Ngư Ông Bất Ổn
 * Mỗi mùa kéo dài 30 ngày, 30 cấp mùa với phần thưởng
 */

const SEASON_DURATION_DAYS = 30;
const SEASON_MAX_LEVEL = 30;

const seasonRewards = [
  { level: 1, reward: { gold: 50 }, desc: "50đ khởi đầu mùa mới" },
  { level: 2, reward: { gold: 80 }, desc: "80đ" },
  { level: 3, reward: { consumable: "luckyBait", qty: 1 }, desc: "1 Mồi May Mắn" },
  { level: 4, reward: { gold: 120 }, desc: "120đ" },
  { level: 5, reward: { title: "🎣 Ngư Dân Mùa Vụ" }, desc: "Danh hiệu: Ngư Dân Mùa Vụ" },
  { level: 6, reward: { gold: 150 }, desc: "150đ" },
  { level: 7, reward: { consumable: "karmaCleanser", qty: 1 }, desc: "1 Bình Giải Nghiệp" },
  { level: 8, reward: { gold: 200 }, desc: "200đ" },
  { level: 9, reward: { consumable: "speedChili", qty: 2 }, desc: "2 Ớt Tốc Độ" },
  { level: 10, reward: { title: "⭐ Sao Biển Chuyên Nghiệp" }, desc: "Danh hiệu: Sao Biển Chuyên Nghiệp" },
  { level: 11, reward: { gold: 250 }, desc: "250đ" },
  { level: 12, reward: { consumable: "luckyBait", qty: 2 }, desc: "2 Mồi May Mắn" },
  { level: 13, reward: { gold: 300 }, desc: "300đ" },
  { level: 14, reward: { consumable: "karmaCleanser", qty: 2 }, desc: "2 Bình Giải Nghiệp" },
  { level: 15, reward: { title: "🌊 Thuyền Trưởng Bất Ổn" }, desc: "Danh hiệu: Thuyền Trưởng Bất Ổn" },
  { level: 16, reward: { gold: 400 }, desc: "400đ" },
  { level: 17, reward: { consumable: "luckyBait", qty: 3 }, desc: "3 Mồi May Mắn" },
  { level: 18, reward: { gold: 500 }, desc: "500đ" },
  { level: 19, reward: { consumable: "speedChili", qty: 3 }, desc: "3 Ớt Tốc Độ" },
  { level: 20, reward: { title: "🔱 Đề Đốc Đại Dương" }, desc: "Danh hiệu: Đề Đốc Đại Dương" },
  { level: 21, reward: { gold: 600 }, desc: "600đ" },
  { level: 22, reward: { consumable: "karmaCleanser", qty: 3 }, desc: "3 Bình Giải Nghiệp" },
  { level: 23, reward: { gold: 700 }, desc: "700đ" },
  { level: 24, reward: { consumable: "luckyBait", qty: 5 }, desc: "5 Mồi May Mắn" },
  { level: 25, reward: { title: "👑 Vua Biển Bất Ổn" }, desc: "Danh hiệu: Vua Biển Bất Ổn" },
  { level: 26, reward: { gold: 900 }, desc: "900đ" },
  { level: 27, reward: { consumable: "speedChili", qty: 5 }, desc: "5 Ớt Tốc Độ" },
  { level: 28, reward: { gold: 1200 }, desc: "1200đ" },
  { level: 29, reward: { consumable: "luckyBait", qty: 8 }, desc: "8 Mồi May Mắn" },
  { level: 30, reward: { title: "🏆 Huyền Thoại Mùa Vụ", gold: 2000 }, desc: "Danh hiệu Huyền Thoại + 2000đ" },
];

// EXP needed per season level (progressively harder)
function getSeasonExpNeeded(level) {
  return Math.round(100 + level * 30 + Math.pow(level, 1.3) * 5);
}

let seasonData = {
  seasonNumber: 1,
  startDate: null,
  level: 0,
  exp: 0,
  claimedRewards: [],
  totalSeasonExp: 0,
  // Stats for this season
  stats: {
    totalCasts: 0,
    totalGoldEarned: 0,
    totalFishCaught: 0,
    rarestCatch: null,
    bestCleanStreak: 0,
    questsCompleted: 0,
    recipesCooked: 0,
  },
  // History of past seasons
  history: [],
};

function initSeason() {
  const now = new Date();
  if (!seasonData.startDate) {
    seasonData.startDate = now.toISOString();
    seasonData.seasonNumber = 1;
  }

  // Check if season expired
  const start = new Date(seasonData.startDate);
  const elapsed = (now - start) / (1000 * 60 * 60 * 24);
  if (elapsed >= SEASON_DURATION_DAYS) {
    // Archive current season
    seasonData.history.push({
      seasonNumber: seasonData.seasonNumber,
      finalLevel: seasonData.level,
      totalExp: seasonData.totalSeasonExp,
      stats: { ...seasonData.stats },
      startDate: seasonData.startDate,
      endDate: now.toISOString(),
    });

    // Start new season
    seasonData.seasonNumber++;
    seasonData.startDate = now.toISOString();
    seasonData.level = 0;
    seasonData.exp = 0;
    seasonData.claimedRewards = [];
    seasonData.totalSeasonExp = 0;
    seasonData.stats = {
      totalCasts: 0,
      totalGoldEarned: 0,
      totalFishCaught: 0,
      rarestCatch: null,
      bestCleanStreak: 0,
      questsCompleted: 0,
      recipesCooked: 0,
    };

    if (typeof addLog === 'function') {
      addLog(`🎊 <b style="color: #ffd600;">[MÙA MỚI]</b> Mùa ${seasonData.seasonNumber} đã bắt đầu! Thời hạn: ${SEASON_DURATION_DAYS} ngày. Hãy câu cá và hoàn thành thử thách để nhận phần thưởng mùa!`, "success");
    }
  }
}

function addSeasonExp(amount, source) {
  if (seasonData.level >= SEASON_MAX_LEVEL) return;

  seasonData.exp += amount;
  seasonData.totalSeasonExp += amount;

  let needed = getSeasonExpNeeded(seasonData.level + 1);
  while (seasonData.exp >= needed && seasonData.level < SEASON_MAX_LEVEL) {
    seasonData.exp -= needed;
    seasonData.level++;

    if (typeof addLog === 'function') {
      const reward = seasonRewards.find(r => r.level === seasonData.level);
      addLog(
        `🏆 <b style="color: #ffd600;">[MÙA LÊN CẤP]</b> Đạt <b>Cấp Mùa ${seasonData.level}/${SEASON_MAX_LEVEL}</b>! ${reward ? `Phần thưởng: <b>${reward.desc}</b>` : ""}`,
        "success"
      );
    }

    needed = getSeasonExpNeeded(seasonData.level + 1);
  }
}

function claimSeasonReward(level) {
  if (seasonData.claimedRewards.includes(level)) return false;
  if (seasonData.level < level) return false;

  const rewardData = seasonRewards.find(r => r.level === level);
  if (!rewardData) return false;

  return rewardData.reward;
}

function markSeasonRewardClaimed(level) {
  if (!seasonData.claimedRewards.includes(level)) {
    seasonData.claimedRewards.push(level);
  }
}

function getSeasonDaysLeft() {
  if (!seasonData.startDate) return SEASON_DURATION_DAYS;
  const start = new Date(seasonData.startDate);
  const now = new Date();
  const elapsed = (now - start) / (1000 * 60 * 60 * 24);
  return Math.max(0, Math.ceil(SEASON_DURATION_DAYS - elapsed));
}

function getSeasonProgress() {
  return {
    level: seasonData.level,
    exp: seasonData.exp,
    expNeeded: getSeasonExpNeeded(seasonData.level + 1),
    maxLevel: SEASON_MAX_LEVEL,
    daysLeft: getSeasonDaysLeft(),
    seasonNumber: seasonData.seasonNumber,
    stats: seasonData.stats,
    history: seasonData.history,
    claimedRewards: seasonData.claimedRewards,
  };
}

function renderSeasonTab() {
  const container = document.getElementById("seasonTabContent");
  if (!container) return;

  const progress = getSeasonProgress();
  const progressPercent = progress.level >= SEASON_MAX_LEVEL ? 100 : (progress.exp / progress.expNeeded) * 100;
  const isVi = typeof rn === 'function' && rn("Rác") === "Rác";

  let rewardsHtml = seasonRewards.map(r => {
    const claimed = progress.claimedRewards.includes(r.level);
    const canClaim = !claimed && progress.level >= r.level;
    const locked = progress.level < r.level;
    const bgColor = claimed ? "#1b3a1b" : canClaim ? "#2a2a1a" : "#1a1a2a";
    const borderColor = claimed ? "#4caf50" : canClaim ? "#ffd600" : "#333";

    return `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 10px; border-radius: 6px; background: ${bgColor}; border: 1px solid ${borderColor}; margin-bottom: 4px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-weight: bold; color: ${claimed ? '#4caf50' : canClaim ? '#ffd600' : '#666'}; min-width: 30px;">Lv${r.level}</span>
          <span style="font-size: 11px; color: ${locked ? '#555' : '#ddd'};">${r.desc}</span>
        </div>
        <div>
          ${claimed ? '<span style="color: #4caf50; font-size: 11px;">✅ Đã nhận</span>' :
            canClaim ? `<button class="shop-btn" style="padding: 3px 8px; font-size: 10px; background-color: #ffd600; color: #000;" onclick="claimSeasonRewardUI(${r.level})">🎁 ${isVi ? 'Nhận' : 'Claim'}</button>` :
            `<span style="color: #555; font-size: 11px;">🔒 Lv${r.level}</span>`}
        </div>
      </div>
    `;
  }).join("");

  container.innerHTML = `
    <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 14px; border-radius: 10px; border: 1px solid #ffd600; margin-bottom: 10px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <div>
          <div style="font-weight: bold; color: #ffd600; font-size: 16px;">🏆 ${isVi ? 'MÙA' : 'SEASON'} ${progress.seasonNumber}</div>
          <div style="font-size: 11px; color: #aaa; margin-top: 2px;">⏳ ${isVi ? 'Còn' : 'Left'}: <b style="color: #ff9800;">${progress.daysLeft} ${isVi ? 'ngày' : 'days'}</b></div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 20px; font-weight: bold; color: #ffd600;">Lv ${progress.level}/${progress.maxLevel}</div>
        </div>
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 10px; color: #aaa; margin-bottom: 3px;">
        <span>${isVi ? 'EXP Mùa' : 'Season EXP'}</span>
        <span>${progress.level >= progress.maxLevel ? (isVi ? 'TỐI ĐA' : 'MAX') : `${progress.exp}/${progress.expNeeded}`}</span>
      </div>
      <div style="background: #0a0a15; border-radius: 5px; height: 12px; overflow: hidden; border: 1px solid #333;">
        <div style="background: linear-gradient(90deg, #ff9800, #ffd600); height: 100%; width: ${progressPercent}%; transition: width 0.3s ease;"></div>
      </div>
    </div>

    <div style="font-weight: bold; color: #ffd600; font-size: 13px; margin-bottom: 8px;">🎁 ${isVi ? 'PHẦN THƯỞNG MÙA' : 'SEASON REWARDS'}</div>
    <div style="max-height: 350px; overflow-y: auto; padding-right: 4px;">
      ${rewardsHtml}
    </div>

    ${progress.history.length > 0 ? `
    <div style="margin-top: 14px; font-weight: bold; color: #aaa; font-size: 12px;">📜 ${isVi ? 'LỊCH SỬ MÙA' : 'SEASON HISTORY'}</div>
    ${progress.history.map(h => `
      <div style="padding: 6px 10px; background: #12121e; border-radius: 6px; border: 1px solid #2a2a3f; margin-top: 4px; font-size: 11px; color: #888;">
        ${isVi ? 'Mùa' : 'Season'} ${h.seasonNumber} — Lv${h.finalLevel} — ${h.totalExp} EXP — ${h.stats.totalFishCaught} ${isVi ? 'cá' : 'fish'}
      </div>
    `).join("")}
    ` : ""}
  `;
}

// Export to window
if (typeof window !== 'undefined') {
  window.seasonData = seasonData;
  window.initSeason = initSeason;
  window.addSeasonExp = addSeasonExp;
  window.claimSeasonReward = claimSeasonReward;
  window.markSeasonRewardClaimed = markSeasonRewardClaimed;
  window.getSeasonProgress = getSeasonProgress;
  window.renderSeasonTab = renderSeasonTab;
  window.seasonRewards = seasonRewards;
}
