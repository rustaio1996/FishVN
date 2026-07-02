# Ke Hoach Nang Cap Ca, Cap Bac, Do Hiem, Khu Vuc

## Muc Tieu

Nang FishVN tu mot bang ca lon nhung con phan tan thanh he sinh thai co cap bac ro rang: ca co do hiem, cap bac sinh vat, level mo khoa, logic phan bo theo khu vuc, nang cap anh huong dung chuc nang, va ten goi bua hai de giu chat "Ngu Ong Bat On".

## Baseline Repo

- Du lieu chinh: `js/data/world-data.js`
- Trang thai nguoi choi: `js/game-state.js`
- Logic roll ca, level, khu vuc, nang cap: `js/game-core.js`
- Kiem tra nhanh: `npm run check:js`
- Hien co: 12 khu vuc, 206 ca/vat pham, 12 do hiem.
- Le ch phan bo dang duoc can bang lai: `khu_bi_mat` da co 21 loai ca, vuot qua muc tieu 18 entry.

## He Do Hiem De Xuat

Giu 12 rarity hien co de khong pha save cu, nhung dung `rarityConfig` de quan ly tap trung:

| Rarity | Vai tro | Unlock goi y | Muc tieu gameplay |
| --- | --- | --- | --- |
| Rac | Fail drop | Lv 1 | Tang nghiep, nguyen lieu lau rac |
| Phe Lieu | Fail drop co gia tri | Lv 1 | Ban/craft/co hoi doi may |
| Thuong | Ca nen | Lv 1 | Kiem vang, len cap dau game |
| Bat On | Thuong dac biet | Lv 3 | Bridge sang he hiem |
| Hiem | Rare dau tien | Lv 5 | Mo quest, achievement dau |
| Sieu Bua | Rare hai huoc | Lv 8 | Flavor, log dac biet, collection |
| Cuc Hiem | Mid rare | Lv 10 | Nguyen lieu lau/nang cap |
| Dot Bien | Mid rare bien the | Lv 12 | Khu doc/nha may, co risk-reward |
| Huyen Thoai | Late rare | Lv 18 | Achievement, jackpot nho |
| Than Thoai | Endgame | Lv 25 | Craft/lau cao cap |
| Toi Cao | Ultra | Lv 30 | Catch modal, flex, thanh tuu |
| Vo Tri | Meme ultra | Lv 35+ | Drop cuc hiem, boss/season reward |

`rarityConfig` gom: `rank`, `color`, `baseWeight`, `minLevel`, `priceBand`, `expBand`, `starBonus`, `modalPriority`, `isTrash`.

## He Cap Bac Ca

Do hiem la xac suat. Cap bac la "dang/caste" cua ca, dung de tao muc tieu suu tam va nang cap:

| Cap bac | Y nghia | Ap dung |
| --- | --- | --- |
| Mam Non Ao Lang | starter | Rac, Phe Lieu, Thuong |
| Dan Anh Vat Vo | early | Thuong, Bat On, Hiem |
| Giang Ho Song Nuoc | mid | Hiem, Sieu Bua, Cuc Hiem |
| Trum Khu Nuoc Duc | mid-late | Cuc Hiem, Dot Bien |
| Dai Ca Day Ao | late | Huyen Thoai |
| Huyen Thoai Chua Rua Bat | end | Huyen Thoai, Than Thoai |
| Sinh Vat Khong Nen Ton Tai | ultra | Toi Cao, Vo Tri |
| Loi He Thong Biet Boi | secret | Vo Tri, event/boss |

Truong moi tren fish:

```js
tier: "Giang Ho Song Nuoc",
minLevel: 8,
biomeTags: ["freshwater", "toxic"],
weightMod: 1.0
```

An toan cho save cu bang cach tu dong fallback ve rarity default tier neu thieu.

## Phan Bo Logic Theo Khu Vuc

Moi khu vuc hien co tu 18-28 entry kha dung, rieng endgame 24-34.

| Khu vuc (ID) | Level | Chu de | Rarity nen co |
| --- | --- | --- | --- |
| Mương Nước Thất Tình (`song_nuoc`) | 1 | tan binh, rac doi song | Rac, Phe Lieu, Thuong, Bat On |
| Ao Đình Thần Chưởng (`ho_nuoc`) | 5 | linh thieng nua mua | Thuong, Bat On, Hiem |
| Khu Chứa Bí Mật (`khu_bi_mat`) | 8 | hidden/tutorial hiem | Hiem, Sieu Bua, Cuc Hiem, hidden |
| Suối Độc Đột Biến (`suoi_doc`) | 8 | doc, loi gen | Phe Lieu, Bat On, Dot Bien |
| Vùng Biển Bất Ổn (`bien_sau`) | 10 | bien mo | Thuong -> Cuc Hiem |
| Đầm Lầy Ăn Vạ (`dam_lay`) | 12 | ca tre, drama | Hiem, Sieu Bua, Cuc Hiem |
| Hang Động Sĩ Diện (`hang_ca`) | 15 | bi an, delay | Cuc Hiem, Dot Bien, Huyen Thoai |
| Sông Băng Tê Tái (`song_bang`) | 18 | hiem lanh | Cuc Hiem, Huyen Thoai |
| Vực Thẳm Trầm Cảm (`vuc_toi`) | 20 | high risk | Dot Bien, Huyen Thoai, Than Thoai |
| Nhà Máy Xả Thải (`nha_may`) | 22 | rac cong nghe | Phe Lieu, Dot Bien, Huyen Thoai |
| Đảo Ngáo Ngơ Huyền Diệu (`tien_canh`) | 25 | than thoai meme | Huyen Thoai, Than Thoai, Toi Cao |
| Không Gian Vô Tri (`vu_tru`) | 30 | endgame | Than Thoai, Toi Cao, Vo Tri |

Quy tac can them vao `rollFish()`:

- Loc theo `zones`.
- Loc them `minLevel <= playerLevel`.
- Ap dung `zoneWeightMods[currentZone][rarity]`.
- Ap dung `tierWeightMods` neu co.
- Giu `hidden` va Dragon Eye nhu hien tai.
- Neu khu co qua it ca hop le, fallback ve ca cung rarity thap hon de tranh pool rong.

## Nang Cap Va Level

Giu 5 nang cap hien co, nhung dat ten vui hon va ro tac dung:

- Can cau: "Can Cau Gia Truyen Dinh Loi Lua" - tang luck va unlock rarity floor.
- Tai nhay/toc do: "Mang WiFi Bat Song Ca Can" - giam wait time.
- Vi tri: "Google Maps Day Ao Ban Crack" - tang chance khu hiem va mo zone hint.
- Tro thu: "De Tu Bao Doi An Chia" - tang EXP, gold nho, mastery.
- Auto: "Thang Em Treo May Co Tam" - auto on dinh hon, giam fail.

Level nguoi choi mo khoa theo milestone:

- Lv 1-7: hoc loop cau-ban-nang cap.
- Lv 8-15: bat dau khu doc/bi mat, them Sieu Bua/Cuc Hiem.
- Lv 16-24: mastery khu, Dot Bien/Huyen Thoai.
- Lv 25-34: Than Thoai/Toi Cao, lau cao cap.
- Lv 35+: Vo Tri, event/boss/season chase.

## Lo Trinh Trien Khai

1. `[x] Done` Tao `rarityConfig` va helper dung chung.
   - File: `js/data/world-data.js`, `js/game-core.js`
   - Thay cac map lap lai: `rarityWeights`, `getRarityRank`, `rarityStarBonus`, `fishInventory` default.

2. `[x] Done` Them cap bac ca.
   - Them `fishTierConfig`.
   - Helper `getFishTier(fish)`.
   - UI bach khoa va card item hien `Cap bac`.

3. `[x] Done` Can bang phan bo khu.
   - Mo rong object `zones` de chua `rarityMods`.
   - Bo sung ca cho `khu_bi_mat` len 21 entry.

4. `[x] Done` Sua `rollFish()` va `selectFishFromList()`.
   - Tach inline gacha/weather bang cach dung helper function chung `applyGachaAndWeatherMods()`.
   - Dung rank so sanh thay vi hardcode string rarity.

5. `[x] Done` Nang cap level va shop.
   - Doi ten tier shop trong `progression-data.js`.
   - Them milestone unlock log khi mo rarity/khu moi vao `gainExp()`.
   - Xu ly multi-level khi EXP vuot nhieu cap bang `while` loop.

6. `[x] Done` Them batch ca moi.
   - Them 38 con ca/vat pham moi hoan toan vao `world-data.js`.

7. `[x] Done` Test va can bang.
   - `npm run check:js` de test syntax.
   - Script scratch `scratch/simulate_fish_rolls.js` de test ty le roll 10.000 lan/zone va balance game.

## Acceptance Criteria

- Khong co syntax error voi `npm run check:js`.
- Moi rarity co config tap trung, da xoa bo `rarityWeights` trung lap.
- Be ca bao thu co the tha ca ma khong bi chan boi confirm message cua browser.
- UI game dung confirm modal thiet ke rieng cho game, matching theme.
- UI bach khoa hoac item card hien duoc cap bac ca.
- Save cu van load duoc khi fish thieu `tier`/`minLevel`.
- Run simulation script de dam bao ty le cac khu vuc dung nhu mong muon.

