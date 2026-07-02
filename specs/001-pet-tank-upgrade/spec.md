# Feature Specification: Bể Cá Báo Thủ (Pet Tank Upgrade)

**Feature Branch**: `001-pet-tank-upgrade`

**Created**: 2026-07-02

**Status**: Completed

**Input**: User description: "Lập kế hoạch tạo ý tưởng và nâng cấp và cải tiến phần Bể Cá Báo Thủ ( Pet ) . Đề xuất làm 1 Tab riêng biệt ."

## User Scenarios & Testing

### User Story 1 - Dedicated Navigation Tab & Panel (Priority: P1)
As a player, I want to access my Pet Tank via a dedicated navigation tab so that it is clearly separated from other sections.

**Why this priority**: Core requirement for visual separation and ease of access.

**Independent Test**: Switching tabs updates body classes and displays only the pet tank container.

**Acceptance Scenarios**:
1. **Given** player is on Fishing tab, **When** they click "Bể Báo" bottom nav button, **Then** the page displays the full-screen Pet Tank panel.
2. **Given** player is on Pet tab, **When** they click "Hành Trang" bottom nav button, **Then** the Pet Tank panel is hidden and the Inventory panel is shown.

---

### User Story 2 - Multi-Slot Pet Tank & Upgrades (Priority: P1)
As a player, I want to store up to 3 pets and pay Gold to unlock additional slots.

**Why this priority**: Extends the game loop, introducing gold progression sinks.

**Independent Test**: Unlocking slot 2 and slot 3 deducts gold and updates slot layouts immediately.

**Acceptance Scenarios**:
1. **Given** player has 600đ and slot 2 is locked, **When** they click "Mở: 500đ", **Then** gold is reduced to 100đ, slot 2 is unlocked, and can host a pet.
2. **Given** player has 100đ and slot 3 is locked, **When** they click "Mở: 1500đ", **Then** slot 3 remains locked, and a warning log is shown.

---

### User Story 3 - Interactive Pet Actions (Priority: P2)
As a player, I want to choose a companion, poke my pets for funny comments, feed them, or release them back into the ocean.

**Why this priority**: Builds player-pet engagement and utility.

**Independent Test**: Petting reduces karma or gives XP, feeding consumes low-tier fish and gives XP.

**Acceptance Scenarios**:
1. **Given** player pokes their active pet, **When** cooldown is ready, **Then** they see dialogue, gain +5 XP or lose 2 Karma.
2. **Given** player feeds a Trash fish to their pet, **Then** fish count is reduced by 1 and the pet gains +10 XP.

---

### User Story 4 - Evolution & Class Choice (Priority: P2)
As a player, I want my pets to evolve at level 5 and pick a specialized class for gameplay buffs.

**Why this priority**: Adds progression payoff and specialized playstyles (speed, gold, safety).

**Acceptance Scenarios**:
1. **Given** pet is Level 5, **When** player chooses class "Báo Lửa 🔥", **Then** the pet gets speed buffs and can burn trash for gold.

## Requirements

### Functional Requirements
- **FR-001**: System MUST store multiple pets in `petTank` array (maximum 3 slots).
- **FR-002**: System MUST retain the active pet as `currentPet` for passive stat computations.
- **FR-003**: System MUST support upgrading slots 2 and 3 for 500đ and 1500đ.
- **FR-004**: System MUST allow choosing class (fire, lightning, money) once level 5 is reached.

## Success Criteria

### Measurable Outcomes
- **SC-001**: Old single-pet data is migrated to the new multi-slot array on first load without loss.
- **SC-002**: Tab switching is responsive and layout resets clean up all display states.
