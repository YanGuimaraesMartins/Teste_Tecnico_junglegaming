# REQUIREMENTS.md — Pirate Battle

> Source of truth: `readme.md` (original challenge). All requirements extracted directly from it.
> This file is the reference for all implementation and testing decisions.

---

## How to use

Each requirement follows this format:

```
REQ-[CATEGORY]-[NNN]
Description.

Requirement: technical detail
Acceptance criteria: what validates this requirement
Test: suggested Playwright spec
Status: TODO | IN PROGRESS | DONE
```

Categories: `GAME` · `ENEMY` · `MATCH` · `UI` · `API` · `MSW` · `TEST` · `PERF` · `DEPLOY`

---

## GAME — Gameplay, Physics and Collisions

---

### REQ-GAME-001
Player ship moves forward.

**Requirement:** Pressing W accelerates the ship forward in the direction it is facing. Releasing W decelerates it.

**Acceptance criteria:** Ship position changes in the direction of the current heading when W is held. Ship does not move when W is released and velocity reaches zero.

**Test:** `movement.spec.ts > player moves forward on W key`

**Status:** TODO

---

### REQ-GAME-002
Player ship rotates left and right.

**Requirement:** Pressing A rotates the ship counterclockwise; pressing D rotates clockwise. Rotation is instantaneous per input step.

**Acceptance criteria:** Ship heading changes when A or D is pressed. Rotation direction matches the key pressed.

**Test:** `movement.spec.ts > player rotates on A and D keys`

**Status:** TODO

---

### REQ-GAME-003
Player movement is bounded by the arena.

**Requirement:** The player ship cannot move beyond the arena boundaries. Collision with the arena edge stops movement in that direction.

**Acceptance criteria:** Ship position does not exceed arena width or height at any point. Ship does not teleport or clip through edges.

**Test:** `movement.spec.ts > player cannot leave arena bounds`

**Status:** TODO

---

### REQ-GAME-004
Player ship collides with islands.

**Requirement:** Islands are impassable obstacles. The player ship cannot move through or overlap with islands.

**Acceptance criteria:** Ship stops or slides when reaching an island tile. Ship position never overlaps island cells.

**Test:** `movement.spec.ts > player cannot move through island`

**Status:** TODO

---

### REQ-GAME-005
Player fires a single frontal projectile.

**Requirement:** Pressing Space fires one projectile in the direction the ship is currently facing (frontal cannon).

**Acceptance criteria:** Exactly one projectile is created per Space press when cooldown allows. Projectile travels in the ship's facing direction.

**Test:** `combat.spec.ts > frontal cannon fires single projectile`

**Status:** TODO

---

### REQ-GAME-006
Player fires three parallel lateral projectiles to the left.

**Requirement:** Pressing Q fires three projectiles parallel to each other from the left side of the ship.

**Acceptance criteria:** Exactly three projectiles are created. They travel perpendicular to the ship's facing direction, to the left.

**Test:** `combat.spec.ts > left broadside fires three projectiles`

**Status:** TODO

---

### REQ-GAME-007
Player fires three parallel lateral projectiles to the right.

**Requirement:** Pressing E fires three projectiles parallel to each other from the right side of the ship.

**Acceptance criteria:** Exactly three projectiles are created. They travel perpendicular to the ship's facing direction, to the right.

**Test:** `combat.spec.ts > right broadside fires three projectiles`

**Status:** TODO

---

### REQ-GAME-008
Each weapon has an independent cooldown.

**Requirement:** The frontal cannon (Space), left broadside (Q), and right broadside (E) each have their own cooldown timer. Firing one weapon does not reset the cooldown of the others.

**Acceptance criteria:** Pressing the same key before cooldown expires does not create a new projectile. Different weapons can fire independently of each other.

**Test:** `combat.spec.ts > weapon cooldowns are independent`

**Status:** TODO

---

### REQ-GAME-009
Projectiles have a time-to-live (TTL) and are destroyed when it expires.

**Requirement:** Each projectile is automatically destroyed after a configured duration if it has not hit anything.

**Acceptance criteria:** Projectile disappears from the arena after its TTL. No lingering projectile objects remain after TTL.

**Test:** `combat.spec.ts > projectile is destroyed after TTL`

**Status:** TODO

---

### REQ-GAME-010
Projectiles are destroyed on island collision.

**Requirement:** When a projectile reaches an island tile, it is destroyed immediately and does not pass through.

**Acceptance criteria:** Projectile disappears upon contact with an island. No damage or score change from island collision.

**Test:** `combat.spec.ts > projectile is destroyed on island collision`

**Status:** TODO

---

### REQ-GAME-011
Projectiles are destroyed on arena boundary collision.

**Requirement:** When a projectile reaches the arena edge, it is destroyed immediately.

**Acceptance criteria:** Projectile disappears upon reaching arena bounds. Projectile does not exit the arena.

**Test:** `combat.spec.ts > projectile is destroyed at arena boundary`

**Status:** TODO

---

### REQ-GAME-012
Projectiles deal damage exactly once.

**Requirement:** A projectile applies its damage effect only once and is then destroyed. It cannot hit multiple targets or deal damage more than once.

**Acceptance criteria:** A single projectile causes exactly one damage event. No double-damage scenario is possible.

**Test:** `combat.spec.ts > projectile deals damage only once`

**Status:** TODO

---

### REQ-GAME-013
Player has configurable starting health (HP).

**Requirement:** The player ship begins each match with a configurable number of hit points. The HUD displays remaining health as hearts.

**Acceptance criteria:** HUD shows the correct initial HP count. HP count decreases by exactly 1 per damage event.

**Test:** `combat.spec.ts > player HP displayed and decremented correctly`

**Status:** TODO

---

### REQ-GAME-014
Player HP reaches zero triggers game over.

**Requirement:** When the player's HP drops to zero, the match ends with end reason `death`.

**Acceptance criteria:** Match enters FINISHED state when HP == 0. End reason recorded as `death`.

**Test:** `match.spec.ts > game over on player death`

**Status:** TODO

---

### REQ-GAME-015
Score increases when an enemy is destroyed.

**Requirement:** Destroying an enemy adds points to the player's score. The score is displayed continuously in the HUD.

**Acceptance criteria:** Score value increases after each enemy is destroyed. Score does not increase when a projectile hits an island or misses.

**Test:** `combat.spec.ts > score increases on enemy destruction`

**Status:** TODO

---

### REQ-GAME-016
Score does not increase from duplicate events.

**Requirement:** A single enemy destruction event produces exactly one score increment. No duplicate scoring from re-processing the same event.

**Acceptance criteria:** Destroying one enemy adds points exactly once. Score is consistent across rapid repeated actions.

**Test:** `combat.spec.ts > no duplicate score from single enemy`

**Status:** TODO

---

### REQ-GAME-017
Arena dimensions are configurable.

**Requirement:** The arena size (width × height in tiles) is configurable via GameConfig. The game generates the arena using a seed for deterministic island placement.

**Acceptance criteria:** Changing arena size in config creates a different-sized arena. Islands are generated at the same positions given the same seed.

**Test:** `options.spec.ts > arena size persists and applies`

**Status:** TODO

---

### REQ-GAME-018
Arena is composed of water tiles and island tiles.

**Requirement:** The arena grid contains water tiles (traversable) and island tiles (impassable obstacles). Island layout is generated once at match start using a seed.

**Acceptance criteria:** Islands are visible and impassable. Water tiles allow free movement.

**Test:** `movement.spec.ts > island blocks movement`

**Status:** TODO

---

### REQ-GAME-019
Game loop is time-based and frame-rate independent.

**Requirement:** All movement, physics, AI, and timers are computed using delta time (time elapsed since last frame). Behavior must be consistent regardless of frame rate.

**Acceptance criteria:** Simulation behaves the same at 30 FPS and 60 FPS. No speed-up or slow-down at different frame rates.

**Test:** (covered by deterministic seed tests)

**Status:** TODO

---

## ENEMY — Enemy AI and Spawn

---

### REQ-ENEMY-001
Chaser enemy pursues the player.

**Requirement:** The Chaser enemy continuously moves toward the player's position, adjusting its heading each frame.

**Acceptance criteria:** Chaser reduces distance to player over time when no obstacles are in between. Chaser does not remain stationary when player is visible.

**Test:** `enemies.spec.ts > chaser pursues player`

**Status:** TODO

---

### REQ-ENEMY-002
Chaser avoids islands.

**Requirement:** The Chaser navigates around island obstacles and does not pass through them while pursuing the player.

**Acceptance criteria:** Chaser does not overlap with island tiles. Chaser finds an alternate path when blocked by an island.

**Test:** `enemies.spec.ts > chaser avoids islands`

**Status:** TODO

---

### REQ-ENEMY-003
Chaser damages player on collision.

**Requirement:** When the Chaser ship collides with the player ship, the player loses 1 HP. The Chaser is destroyed upon collision.

**Acceptance criteria:** Player HP decreases by 1 on Chaser collision. Chaser entity is removed from the arena after collision.

**Test:** `enemies.spec.ts > chaser damages player and is destroyed on collision`

**Status:** TODO

---

### REQ-ENEMY-004
Chaser destruction does not award score.

**Requirement:** When a Chaser collides with and destroys itself against the player, no score is awarded. Score is only awarded when the player destroys an enemy with a projectile.

**Acceptance criteria:** Player score does not increase after Chaser self-destructs on collision.

**Test:** `enemies.spec.ts > chaser collision does not award score`

**Status:** TODO

---

### REQ-ENEMY-005
Shooter enemy maintains distance and fires at player.

**Requirement:** The Shooter enemy positions itself at a configured attack range from the player and fires projectiles toward the player at a configured cooldown interval.

**Acceptance criteria:** Shooter stays approximately at attack range distance. Shooter fires at player within cooldown intervals. Shooter projectile travels toward player position at time of firing.

**Test:** `enemies.spec.ts > shooter maintains distance and fires at player`

**Status:** TODO

---

### REQ-ENEMY-006
Shooter repositions when player leaves attack range.

**Requirement:** If the player moves out of the Shooter's attack range, the Shooter moves to reposition itself within range before firing again.

**Acceptance criteria:** Shooter moves toward player when distance exceeds attack range. Shooter does not fire while out of range (or fires only when in range).

**Test:** `enemies.spec.ts > shooter repositions when player out of range`

**Status:** TODO

---

### REQ-ENEMY-007
Shooter projectile damages player.

**Requirement:** A projectile fired by the Shooter follows the same physics rules as player projectiles. When it hits the player, the player loses 1 HP.

**Acceptance criteria:** Player HP decreases by 1 when hit by Shooter projectile. Projectile is destroyed on impact.

**Test:** `enemies.spec.ts > shooter projectile damages player`

**Status:** TODO

---

### REQ-ENEMY-008
Both enemy types are destroyed by one player projectile.

**Requirement:** Chaser and Shooter each have 1 HP. A single player projectile destroys either enemy type.

**Acceptance criteria:** Enemy is removed from arena after one projectile hit. Score increases by the configured amount.

**Test:** `combat.spec.ts > one projectile destroys enemy`

**Status:** TODO

---

### REQ-ENEMY-009
Enemies respect arena boundaries and island collisions.

**Requirement:** Enemy ships cannot move outside the arena boundaries or through island tiles.

**Acceptance criteria:** Enemy position never exceeds arena bounds. Enemy does not overlap island tiles.

**Test:** `enemies.spec.ts > enemies respect arena bounds and islands`

**Status:** TODO

---

### REQ-ENEMY-010
Enemies spawn periodically at a configurable interval.

**Requirement:** New enemies are spawned at a configurable time interval (enemySpawnInterval). Both Chaser and Shooter types can appear in a normal match.

**Acceptance criteria:** Enemy count increases over time at the configured interval. Both Chaser and Shooter enemies appear during a match.

**Test:** `enemies.spec.ts > enemies spawn at configured interval`

**Status:** TODO

---

### REQ-ENEMY-011
Enemy spawn position is safe.

**Requirement:** Enemies do not spawn inside islands or directly on top of (or immediately adjacent to) the player.

**Acceptance criteria:** No enemy spawns on an island tile. Spawn position is not within a minimum safe distance from the player.

**Test:** `enemies.spec.ts > enemy spawn position is safe`

**Status:** TODO

---

### REQ-ENEMY-012
Enemy behavior is deterministic given a seed.

**Requirement:** When the RNG is seeded, enemy AI behavior (movement, pathfinding, spawn positions) produces the same results across runs.

**Acceptance criteria:** With the same seed, enemy positions and actions match across two identical runs.

**Test:** (used internally in other tests via `__GAME_TEST_HOOKS__.setSeed`)

**Status:** TODO

---

## MATCH — Match Lifecycle, Timer, Pause

---

### REQ-MATCH-001
Match has configurable duration.

**Requirement:** The match timer counts down from a configurable duration (1–10 minutes). The timer is displayed in the HUD.

**Acceptance criteria:** Timer starts at the configured duration. Timer counts down every second. Timer reaches zero and triggers game over.

**Test:** `match.spec.ts > match ends when timer reaches zero`

**Status:** TODO

---

### REQ-MATCH-002
Match ends when timer reaches zero (timeout).

**Requirement:** When the countdown timer reaches zero, the match ends with end reason `timeout`.

**Acceptance criteria:** Match enters FINISHED state when timer == 0. End reason recorded as `timeout`.

**Test:** `match.spec.ts > game over on timeout`

**Status:** TODO

---

### REQ-MATCH-003
Match ends when player HP reaches zero (death).

**Requirement:** When the player's HP drops to zero or below, the match ends with end reason `death`.

**Acceptance criteria:** Match enters FINISHED state when HP <= 0. End reason recorded as `death`.

**Test:** `match.spec.ts > game over on death`

**Status:** TODO

---

### REQ-MATCH-004
Match FINISHED state stops all simulation.

**Requirement:** When the match ends, all movement, shooting, AI, damage, spawn, and the timer stop immediately. The score is locked.

**Acceptance criteria:** No entity moves after FINISHED. No new enemies spawn. No damage events occur. Score does not change.

**Test:** `match.spec.ts > simulation stops on game over`

**Status:** TODO

---

### REQ-MATCH-005
Match can be restarted with a clean state.

**Requirement:** The player can start a new match from the result screen. The new match starts with fresh HP, score, timer, and no leftover entities from the previous match.

**Acceptance criteria:** No old entities remain after restart. HP, score, and timer reset to configured initial values.

**Test:** `match.spec.ts > restart produces clean state`

**Status:** TODO

---

### REQ-MATCH-006
Match can be paused manually with P key.

**Requirement:** Pressing P during a RUNNING match pauses the simulation. Pressing P again or clicking Resume resumes it.

**Acceptance criteria:** Timer stops on pause. All entities stop moving on pause. Timer and entities resume correctly on unpause.

**Test:** `pause.spec.ts > P key pauses and resumes match`

**Status:** TODO

---

### REQ-MATCH-007
Match is automatically paused on window blur or tab hidden.

**Requirement:** When the browser window loses focus (blur) or the tab becomes hidden (document.hidden), the match is automatically paused.

**Acceptance criteria:** Timer stops immediately on blur/hidden. Entities stop. Match does not auto-resume when focus returns.

**Test:** `pause.spec.ts > match auto-pauses on window blur`

**Status:** TODO

---

### REQ-MATCH-008
Match does not auto-resume after auto-pause; requires explicit user action.

**Requirement:** After auto-pause (blur/hidden), the match displays a "GAME PAUSED — Resume" prompt. The match resumes only when the user explicitly acts (e.g., clicks Resume or presses P).

**Acceptance criteria:** Match remains paused after focus returns. Resume action restores RUNNING state.

**Test:** `pause.spec.ts > match requires explicit resume after auto-pause`

**Status:** TODO

---

### REQ-MATCH-009
Timer does not advance during pause.

**Requirement:** The timer uses performance.now() delta to track elapsed time. Time does not accumulate while the match is paused.

**Acceptance criteria:** Timer value after resume is the same as at pause time (within one frame). No time drift after multiple pause/resume cycles.

**Test:** `pause.spec.ts > timer does not drift during pause`

**Status:** TODO

---

### REQ-MATCH-010
Weapon cooldowns do not advance during pause.

**Requirement:** Cooldown timers for all weapons are also suspended during a pause.

**Acceptance criteria:** Cooldown state is the same at resume as at pause. No free shots immediately after resume.

**Test:** `pause.spec.ts > cooldowns do not advance during pause`

**Status:** TODO

---

### REQ-MATCH-011
Input state is cleared on pause.

**Requirement:** Any keys that were held when the match paused are cleared so that no residual input persists after resume.

**Acceptance criteria:** Ship does not move immediately after resume if no keys are actively pressed. No phantom movement after resume.

**Test:** `pause.spec.ts > input cleared on pause`

**Status:** TODO

---

### REQ-MATCH-012
Configuration snapshot is taken at match start.

**Requirement:** At the moment a match begins, the current GameConfig is snapshotted. Changes to Options during the match do not affect the active session.

**Acceptance criteria:** Changing Options during a running match has no effect on the current match. The next match uses the updated config.

**Test:** `options.spec.ts > config changes do not affect running match`

**Status:** TODO

---

### REQ-MATCH-013
Match result stores score, duration, and end reason.

**Requirement:** When a match ends, the following data is recorded: final score, effective play duration (excluding paused time), and end reason (timeout or death).

**Acceptance criteria:** Result screen shows correct score, duration, and reason. Data matches what is sent to POST /match.

**Test:** `match.spec.ts > result screen shows correct data`

**Status:** TODO

---

## UI — Interface, HUD, Options, Accessibility, Mobile

---

### REQ-UI-001
Main Menu displays navigation options.

**Requirement:** The Main Menu screen provides buttons to: Play, Options, Leaderboard/Ranking, Match History, and shows game controls.

**Acceptance criteria:** All buttons are present and functional. Navigation reaches the correct screen for each button.

**Test:** `navigation.spec.ts > main menu navigates to all screens`

**Status:** TODO

---

### REQ-UI-002
Options screen exposes game session duration.

**Requirement:** The Options screen includes a control to configure the match duration. The minimum required configurable fields are session duration and enemy spawn interval.

**Acceptance criteria:** Session duration control is present. Value changes are reflected in the next match.

**Test:** `options.spec.ts > session duration is configurable`

**Status:** TODO

---

### REQ-UI-003
Options screen exposes enemy spawn interval.

**Requirement:** The Options screen includes a control to configure how frequently new enemies spawn.

**Acceptance criteria:** Spawn interval control is present. Value changes affect enemy spawn frequency in the next match.

**Test:** `options.spec.ts > spawn interval is configurable`

**Status:** TODO

---

### REQ-UI-004
Options are persisted in localStorage.

**Requirement:** When the player saves options, the values are stored in localStorage and restored on the next visit.

**Acceptance criteria:** After page reload, Options screen shows previously saved values. Match starts with the persisted configuration.

**Test:** `options.spec.ts > options persist across page reload`

**Status:** TODO

---

### REQ-UI-005
Options are validated in real time.

**Requirement:** Invalid values (out-of-range numbers, empty fields) are shown as validation errors immediately as the user types, without requiring form submission.

**Acceptance criteria:** Error message appears for invalid values. Play button is disabled or shows error when options are invalid.

**Test:** `options.spec.ts > invalid options show validation error`

**Status:** TODO

---

### REQ-UI-006
Asset loading shows progress or loading state.

**Requirement:** When the game assets are being loaded before a match, the UI displays a loading progress indicator or a visible loading state.

**Acceptance criteria:** A progress bar or loading indicator is visible during asset load. The game does not start until assets are ready.

**Test:** `loading.spec.ts > loading progress is visible`

**Status:** TODO

---

### REQ-UI-007
Asset loading failures show an error and allow retry.

**Requirement:** If assets fail to load, an error state is displayed and the player can retry loading.

**Acceptance criteria:** Error message is shown on load failure. Retry button reinitiates the loading process.

**Test:** `loading.spec.ts > load failure shows error and retry`

**Status:** TODO

---

### REQ-UI-008
HUD displays score, timer, and HP during gameplay.

**Requirement:** During a match, the HUD always shows: current score, countdown timer, and remaining HP (as hearts).

**Acceptance criteria:** All three HUD elements are visible during gameplay. Values update in real time.

**Test:** `match.spec.ts > HUD shows score, timer, HP`

**Status:** TODO

---

### REQ-UI-009
HUD displays a pause indicator when paused.

**Requirement:** When the match is paused, the HUD or overlay shows a visible pause indicator or "GAME PAUSED" message.

**Acceptance criteria:** Pause message is visible when game is paused. Pause message is hidden when game is running.

**Test:** `pause.spec.ts > pause indicator is visible when paused`

**Status:** TODO

---

### REQ-UI-010
Result screen displays final score, duration, and end reason.

**Requirement:** After a match ends, the Result screen shows the final score, effective play duration, the reason the match ended, the registration status (pending/saved/error), and buttons to Play Again and go to Main Menu.

**Acceptance criteria:** All fields are present and correct. Navigation buttons work.

**Test:** `result.spec.ts > result screen shows all required fields`

**Status:** TODO

---

### REQ-UI-011
Result screen data persists after page refresh.

**Requirement:** The result data (score, duration, reason) is stored locally so that a page refresh still shows the last match result.

**Acceptance criteria:** After refresh, Result screen shows the same data as before refresh.

**Test:** `result.spec.ts > result persists after refresh`

**Status:** TODO

---

### REQ-UI-012
Leaderboard shows paginated ranking.

**Requirement:** The Leaderboard/Ranking tab shows a paginated list of top scores, ordered by score. Pagination controls allow navigating between pages.

**Acceptance criteria:** Ranking data is shown. Pagination works. Loading, empty, and error states are handled.

**Test:** `leaderboard.spec.ts > ranking shows paginated data`

**Status:** TODO

---

### REQ-UI-013
Match History shows paginated history for the player.

**Requirement:** The Match History tab shows a paginated list of the current player's past matches.

**Acceptance criteria:** History data is shown. Pagination works. Loading, empty, and error states are handled.

**Test:** `leaderboard.spec.ts > match history shows paginated data`

**Status:** TODO

---

### REQ-UI-014
Game is fully operable on desktop with keyboard.

**Requirement:** All menus, dialogs, and game controls can be used with a keyboard only (Tab, Enter, Escape, and game keys).

**Acceptance criteria:** All interactive elements are reachable via Tab. Enter activates buttons/links. Escape closes dialogs.

**Test:** `accessibility.spec.ts > keyboard navigation works in all menus`

**Status:** TODO

---

### REQ-UI-015
All interactive elements have visible focus indicators.

**Requirement:** When an element is focused via keyboard, a visible focus outline (focus-visible) is displayed.

**Acceptance criteria:** Focus ring is visible on buttons, inputs, and links when focused. Focus is not hidden with outline:0 without an alternative.

**Test:** `accessibility.spec.ts > focus visible on interactive elements`

**Status:** TODO

---

### REQ-UI-016
All form inputs have labels.

**Requirement:** Every form input in the Options screen has an associated label element.

**Acceptance criteria:** Each input has a visible label or aria-label. Screen readers can identify each field.

**Test:** `accessibility.spec.ts > inputs have labels`

**Status:** TODO

---

### REQ-UI-017
Color contrast meets WCAG AA minimum.

**Requirement:** Text and interactive elements maintain at least 4.5:1 contrast ratio (WCAG AA) against their backgrounds.

**Acceptance criteria:** No text/background combination falls below AA contrast ratio.

**Test:** (automated contrast check or manual audit)

**Status:** TODO

---

### REQ-UI-018
Error messages are accessible.

**Requirement:** Error messages (validation, load failure, API errors) are rendered with `role="alert"` so screen readers announce them automatically.

**Acceptance criteria:** Error elements have role="alert". Errors are announced without manual focus.

**Test:** `accessibility.spec.ts > error messages use role=alert`

**Status:** TODO

---

### REQ-UI-019
Score, timer, and HP are represented semantically in the DOM.

**Requirement:** Even though the game renders on a PixiJS canvas, the score, timer, and HP are also represented as semantic HTML elements (e.g., aria-live regions). Screen readers must not be spammed every frame.

**Acceptance criteria:** Score, timer, and HP have corresponding DOM elements. aria-live="polite" is used for timer and score. Updates are batched (not every frame).

**Test:** `accessibility.spec.ts > HUD elements are semantic`

**Status:** TODO

---

### REQ-UI-020
Game keys are only captured during active gameplay.

**Requirement:** W, A, S, D, Space, Q, E are captured as game inputs only when the gameplay context is active. They must not interfere with menu navigation or form inputs.

**Acceptance criteria:** Game keys do not fire in menu screens or form inputs. Tab/Enter/Escape work normally in menus.

**Test:** `accessibility.spec.ts > game keys inactive in menus`

**Status:** TODO

---

### REQ-UI-021
Game is playable on mobile with touch controls.

**Requirement:** The game provides on-screen touch controls on mobile: a virtual D-pad for movement and separate buttons for frontal and lateral cannons.

**Acceptance criteria:** Player can move and fire using touch controls. Simultaneous touch for movement and firing works correctly.

**Test:** `touch.spec.ts > touch controls allow movement and firing`

**Status:** TODO

---

### REQ-UI-022
Mobile layout uses landscape orientation.

**Requirement:** The supported mobile orientation is landscape. The game and HUD have no clipped areas in landscape orientation on mobile devices.

**Acceptance criteria:** No UI element is cut off in landscape mode. Arena is fully visible.

**Test:** `touch.spec.ts > game visible in mobile landscape`

**Status:** TODO

---

### REQ-UI-023
Layout adapts to window resize without altering game rules.

**Requirement:** When the browser window is resized, the layout adjusts accordingly. Game rules, simulation, and collision logic are not altered by viewport changes.

**Acceptance criteria:** UI elements reflow on resize. Game state is preserved during resize.

**Test:** (layout check in responsive tests)

**Status:** TODO

---

### REQ-UI-024
Keyboard focus is trapped in dialogs.

**Requirement:** When a modal dialog or pause overlay is open, keyboard focus stays within it and does not reach elements behind it.

**Acceptance criteria:** Tab cycling stays inside open dialog. Focus returns to the trigger element on close.

**Test:** `accessibility.spec.ts > focus trapped in dialog`

**Status:** TODO

---

## API — HTTP Integration (Axios + TanStack Query)

---

### REQ-API-001
Ranking is fetched with GET /ranking.

**Requirement:** The app fetches the leaderboard via `GET /ranking?page=N&limit=10&config=<hash>`. The response includes paginated MatchRecord entries ordered by score.

**Acceptance criteria:** Ranking data displays on screen. Page parameter changes the visible records.

**Test:** `leaderboard.spec.ts > ranking is fetched and displayed`

**Status:** TODO

---

### REQ-API-002
Match history is fetched with GET /history.

**Requirement:** The app fetches the player's match history via `GET /history?playerId=<id>&page=N&limit=10`. The response includes paginated MatchRecord entries.

**Acceptance criteria:** History data displays for the current player. Page parameter changes the visible records.

**Test:** `leaderboard.spec.ts > match history is fetched and displayed`

**Status:** TODO

---

### REQ-API-003
Completed match is registered with POST /match.

**Requirement:** When a match ends, the app sends `POST /match` with: matchId, playerId, score, duration, endReason, config. The server responds with the created record.

**Acceptance criteria:** POST is sent automatically when match ends. Payload contains all required fields.

**Test:** `register.spec.ts > match is registered after game over`

**Status:** TODO

---

### REQ-API-004
API failure does not block gameplay or navigation.

**Requirement:** If the ranking, history, or match registration API fails, the error is shown to the user but the game remains accessible. The player can still start and play matches.

**Acceptance criteria:** Game loads with API errors. Player can navigate and play despite API failures.

**Test:** `register.spec.ts > API failure does not block gameplay`

**Status:** TODO

---

### REQ-API-005
Loading, empty, and error states are handled in UI.

**Requirement:** The Ranking and Match History screens handle: loading (spinner), empty (no records), and error (network/API failure) states with appropriate visual feedback.

**Acceptance criteria:** Loading state shown while fetching. Empty state shown when list is empty. Error state shown on failure.

**Test:** `leaderboard.spec.ts > handles loading, empty, and error states`

**Status:** TODO

---

### REQ-API-006
Background refresh and cache invalidation work correctly.

**Requirement:** TanStack Query manages stale-time, background refresh, and cache. After registering a match, both ranking and history queries are invalidated so they refetch.

**Acceptance criteria:** After POST /match success, ranking and history refresh. Stale data is not shown after invalidation.

**Test:** `register.spec.ts > both tabs update after match registration`

**Status:** TODO

---

### REQ-API-007
Stale responses do not overwrite more recent data.

**Requirement:** If a delayed API response arrives after a more recent response for the same query, the delayed response is discarded.

**Acceptance criteria:** Out-of-order responses do not cause the UI to show older data after newer data has been displayed.

**Test:** `register.spec.ts > stale responses do not overwrite recent data`

**Status:** TODO

---

### REQ-API-008
Ranking comparison uses the same GameConfig for fairness.

**Requirement:** Ranking entries are compared only among matches that used the same configuration. A deterministic tiebreaker is applied.

**Acceptance criteria:** Rankings filtered by config hash show only matching config entries. Tiebreaker is consistent (e.g., earlier date wins).

**Test:** (covered via MSW fixtures)

**Status:** TODO

---

## API (Idempotency and Pending Matches)

---

### REQ-API-009
Each completed match generates exactly one record.

**Requirement:** A finished match produces exactly one entry in history and one entry in ranking. Repeated submissions of the same match (same matchId) return the existing record without creating a duplicate.

**Acceptance criteria:** POST /match twice with same matchId returns same record. Ranking and history each show exactly one entry per matchId.

**Test:** `register.spec.ts > no duplicate on repeated POST`

**Status:** TODO

---

### REQ-API-010
Match submission uses a client-generated UUID as matchId.

**Requirement:** Before starting a match, the client generates a UUID v4 as the matchId. This ID is included in the POST /match body and used for idempotency.

**Acceptance criteria:** matchId is a valid UUID. Same matchId is reused on retry.

**Test:** (internal implementation detail, verified via MSW)

**Status:** TODO

---

### REQ-API-011
Pending match records survive a page refresh.

**Requirement:** If a match ends but the POST /match has not yet been confirmed (pending), the pending submission data is stored in localStorage. After a page refresh, the app detects and retries the pending submission.

**Acceptance criteria:** After refresh with a pending match, the app retries POST /match. On success, the pending record is cleared.

**Test:** `register.spec.ts > pending match is recovered after refresh`

**Status:** TODO

---

### REQ-API-012
Player can start a new match while a pending submission exists.

**Requirement:** The presence of an unresolved pending match registration does not block the player from starting a new match.

**Acceptance criteria:** "Play Again" works even when a pending submission exists. The pending submission continues in the background.

**Test:** `register.spec.ts > new match starts with pending submission`

**Status:** TODO

---

### REQ-API-013
Retry on timeout does not create duplicate records.

**Requirement:** If POST /match times out and the client retries, the server (MSW) recognizes the same matchId and returns the existing record without creating a second entry.

**Acceptance criteria:** Two POST requests with the same matchId produce one record. No duplicate in ranking or history.

**Test:** `register.spec.ts > timeout retry does not duplicate record`

**Status:** TODO

---

## MSW — Mock Service Worker

---

### REQ-MSW-001
MSW mocks GET /ranking, GET /history, and POST /match.

**Requirement:** MSW v2 intercepts all three API endpoints. State is managed in-memory with localStorage persistence. Handlers are shared between development, tests, and the published build.

**Acceptance criteria:** All API calls are intercepted in dev, test, and prod build. No real network requests are made.

**Test:** (all API tests rely on MSW)

**Status:** TODO

---

### REQ-MSW-002
14 configurable network scenarios are available.

**Requirement:** The following scenarios are selectable via `VITE_MSW_SCENARIO` env var or a UI selector:
1. `success`, 2. `empty`, 3. `paginated`, 4. `slow` (3s latency), 5. `variable-latency` (random with seed), 6. `out-of-order` (responses out of sequence), 7. `timeout` (AbortError after 10s), 8. `network-error`, 9. `http-error-4xx`, 10. `http-error-5xx`, 11. `ranking-fail`, 12. `history-fail`, 13. `match-timeout-recover` (timeout then success, no duplicate), 14. `match-unavailable-recover` (fails then registers after recovery).

**Acceptance criteria:** Each scenario produces the correct network behavior. Scenario is selectable without rebuilding the app.

**Test:** `network-scenarios.spec.ts > each scenario behaves as expected`

**Status:** TODO

---

### REQ-MSW-003
MSW state can be reset to initial state.

**Requirement:** A "Reset State" control clears the in-memory data store and removes MSW-related localStorage entries, restoring the mock to its initial state.

**Acceptance criteria:** After reset, ranking and history are empty (or at fixture defaults). No previously registered matches remain.

**Test:** `network-scenarios.spec.ts > reset state clears mock data`

**Status:** TODO

---

### REQ-MSW-004
MSW randomness is controllable via a seed.

**Requirement:** Scenarios that involve randomness (e.g., `variable-latency`) use a seeded RNG. The seed can be injected to make tests deterministic.

**Acceptance criteria:** Same seed produces same behavior across runs. Seed injection works in both dev and test environments.

**Test:** (used internally via test fixtures)

**Status:** TODO

---

### REQ-MSW-005
MSW works in the published production build.

**Requirement:** The MSW service worker is included in the production build and activated when `VITE_MSW_SCENARIO` is set (or by default). The published game must run ranking and history mocks.

**Acceptance criteria:** API calls are intercepted in the deployed build. Ranking and history work on the public URL.

**Test:** `deploy.spec.ts > MSW works on deployed URL`

**Status:** TODO

---

### REQ-MSW-006
Confirmed records appear in subsequent queries.

**Requirement:** After a successful POST /match, the new record appears when GET /ranking or GET /history is called. State is consistent between the two tabs.

**Acceptance criteria:** Newly registered match appears in both Ranking and History on the next fetch.

**Test:** `register.spec.ts > registered match appears in ranking and history`

**Status:** TODO

---

## TEST — Playwright E2E

---

### REQ-TEST-001 through REQ-TEST-012
The 12 mandatory E2E test groups are as specified in the challenge README section 8:

1. Navigation, validation, and persistence of options.
2. Asset loading, failures, and retry.
3. Match start, movement, rotation, arena limits, and island collision.
4. Frontal and lateral shots, damage, cooldown, and score without duplication.
5. Chaser and Shooter behaviors and spawn interval.
6. End by timeout and by death, simulation interruption, and clean restart.
7. Pause, loss of focus, and resume without advancing timer.
8. Result screen display and persistence after refresh.
9. Match abandonment, repeated navigation, and touch controls.
10. Ranking and Match History queries: loading, empty, error, pagination.
11. Match registration, update of both tabs, recovery of pending submission after refresh.
12. Retry after timeout without duplication; delayed responses do not overwrite recent data.

**Requirement:** All 12 groups must have Playwright specs. Each spec starts from an isolated state (beforeEach clears localStorage and reinitializes MSW).

**Acceptance criteria:** All specs pass in CI. No cross-test contamination.

**Test:** all `*.spec.ts` files

**Status:** TODO

---

### REQ-TEST-013
Tests run on Chromium desktop and mobile.

**Requirement:** The Playwright configuration includes both a desktop Chromium project and a mobile Chromium project (iPhone 12 viewport).

**Acceptance criteria:** All main flows pass in both configurations.

**Test:** playwright.config.ts project configuration

**Status:** TODO

---

### REQ-TEST-014
Visual regression tests exist for Menu, Arena, and Result screens.

**Requirement:** Screenshot-based visual regression tests exist for: Main Menu, the game arena in a stable state, and the Result screen. Baselines are versioned in the repository.

**Acceptance criteria:** Screenshots match baselines within threshold. Deviations cause test failure with diff output.

**Test:** `visual.spec.ts > menu, arena, result screenshots`

**Status:** TODO

---

### REQ-TEST-015
Game clock and RNG are controllable from tests.

**Requirement:** Tests can control the game simulation clock (to fast-forward time) and inject an RNG seed via `window.__GAME_TEST_HOOKS__`. The actual game rules, physics, and rendering continue to execute normally.

**Acceptance criteria:** `__GAME_TEST_HOOKS__.setSeed(n)` sets the RNG seed. `__GAME_TEST_HOOKS__.setTime(ms)` advances the simulation clock. Hooks do not break production behavior.

**Test:** (used across all gameplay tests)

**Status:** TODO

---

### REQ-TEST-016
Playwright delivers HTML report and failure traces.

**Requirement:** The Playwright test run produces an HTML report. On test failure, a trace file is captured for debugging.

**Acceptance criteria:** `playwright-report/index.html` is generated after each run. Trace files are present for failing tests.

**Test:** playwright.config.ts reporter configuration

**Status:** TODO

---

## PERF — Performance

---

### REQ-PERF-001
Game targets 60 FPS in optimized build.

**Requirement:** In a production build (`npm run build && npm run preview`), the game combat loop maintains 60 FPS as a target on the reference hardware.

**Acceptance criteria:** Average FPS ≥ 60 during a 3-minute match. Measured and documented in PERFORMANCE.md.

**Test:** (manual profiling with Chrome DevTools)

**Status:** TODO

---

### REQ-PERF-002
p95 frame time is measured and documented.

**Requirement:** The 95th percentile of frame-to-frame time is recorded during the 3-minute match.

**Acceptance criteria:** p95 value is documented in PERFORMANCE.md with hardware context.

**Test:** (manual profiling)

**Status:** TODO

---

### REQ-PERF-003
Entity count during a 3-minute match is documented.

**Requirement:** The number of active entities (player, enemies, projectiles) at peak and average during the match is recorded.

**Acceptance criteria:** Entity count documented in PERFORMANCE.md.

**Test:** (manual profiling)

**Status:** TODO

---

### REQ-PERF-004
Memory does not grow continuously across 5 match cycles.

**Requirement:** After 5 cycles of: start match → play → exit to menu, memory usage must not show continuous unbounded growth. Investigate any leak.

**Acceptance criteria:** Memory at cycle 5 is not significantly higher than at cycle 1. Any observed growth is explained and documented.

**Test:** (manual profiling with Chrome Memory tab)

**Status:** TODO

---

### REQ-PERF-005
Performance evidence is documented.

**Requirement:** PERFORMANCE.md includes: hardware spec, browser and version, resolution, GameConfig used, measured FPS, p95, entity count, memory results, and any limitations observed.

**Acceptance criteria:** PERFORMANCE.md is present and complete.

**Test:** (documentation check)

**Status:** TODO

---

## DEPLOY — Delivery and Deployment

---

### REQ-DEPLOY-001
Public URL is provided and functional.

**Requirement:** The solution includes a public URL (Vercel, Netlify, or Cloudflare Pages) where the game is deployed and accessible.

**Acceptance criteria:** URL loads the game. Game is playable from the public URL.

**Test:** `deploy.spec.ts > game loads at public URL`

**Status:** TODO

---

### REQ-DEPLOY-002
Game works on direct URL open and page refresh.

**Requirement:** The game works correctly when the URL is opened directly or when the page is refreshed (not just from navigation).

**Acceptance criteria:** Refreshing the URL shows the correct screen. No blank screen or 404 on refresh.

**Test:** `deploy.spec.ts > game works on refresh`

**Status:** TODO

---

### REQ-DEPLOY-003
Published version matches delivered code.

**Requirement:** The deployed URL runs the exact same code that is delivered in the repository. No divergence between the two.

**Acceptance criteria:** Build artifacts correspond to the committed source. Deploy is triggered from the same commit.

**Test:** (deployment process verification)

**Status:** TODO

---

### REQ-DEPLOY-004
Repository includes source, lockfile, assets, mocks, fixtures, and tests.

**Requirement:** The submitted repository must include: source code, package lockfile (npm or pnpm), assets/, mocks/, fixtures/, and test files.

**Acceptance criteria:** All listed items are present in the repository root.

**Test:** (repository content check)

**Status:** TODO

---

### REQ-DEPLOY-005
Solution runs from a clean checkout without private services.

**Requirement:** After `git clone` and `npm install`, the solution must run (`npm run dev`) without depending on any private API, private service, or external credentials.

**Acceptance criteria:** `npm install && npm run dev` works on a clean machine. All API calls are handled by MSW.

**Test:** (local clean-checkout test)

**Status:** TODO

---

### REQ-DEPLOY-006
README.md of the solution includes all required documentation.

**Requirement:** The solution README includes: setup instructions, environment variables, game controls, gameplay config explanation, MSW scenario selection and reset, and commands for dev/build/preview/lint/typecheck/playwright.

**Acceptance criteria:** All listed sections are present and accurate.

**Test:** (documentation review)

**Status:** TODO

---

### REQ-DEPLOY-007
ARCHITECTURE.md documents the technical decisions.

**Requirement:** ARCHITECTURE.md covers: React/PixiJS integration, simulation cycle, collision system (with rationale), resource management, local persistence, TanStack Query contracts/cache/pending recovery, balancing decisions, and observed limitations.

**Acceptance criteria:** All listed topics are covered. Decisions explain the *why*, not just the *what*.

**Test:** (documentation review)

**Status:** TODO

---

## Status Summary

| Category | Total | TODO | In Progress | Done |
|----------|------:|-----:|------------:|-----:|
| GAME | 19 | 19 | 0 | 0 |
| ENEMY | 12 | 12 | 0 | 0 |
| MATCH | 13 | 13 | 0 | 0 |
| UI | 24 | 24 | 0 | 0 |
| API | 13 | 13 | 0 | 0 |
| MSW | 6 | 6 | 0 | 0 |
| TEST | 16 | 16 | 0 | 0 |
| PERF | 5 | 5 | 0 | 0 |
| DEPLOY | 7 | 7 | 0 | 0 |
| **Total** | **115** | **115** | **0** | **0** |
