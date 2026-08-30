# OpenHouse Platform — Complete Screen & Pipeline Implementation Plan

Based on the 35 design reference images and our locked-in component library (`WorkspaceShell`, design tokens, button styling, typography, and card primitives), this plan outlines the exact roadmap to align all screens with the official design system.

---

## 1. Unified Navigation & Shell Architecture

Update the global sidebar navigation in `WorkspaceShell.tsx` to match the official design:
- **Brand Header**: OpenHouse Logo + wordmark
- **Primary CTA**: `+ Add property`
- **`WORKSPACE` Section**:
  - `Properties` (`/shows` / `/properties`)
  - `Capture requests` (`/capture-requests`)
  - `Experiences` (`/experiences` / `/productions`)
  - `Approvals` (`/approvals`)
  - `Activity` (`/activity`)
- **`ACCOUNT` Section**:
  - `Usage` (`/usage`)
  - `Team` (`/team`)
  - `Settings` (`/settings`)
- **Bottom Profile**: User avatar (`Kiki Casa` / `David Olabowale`), name, email, context menu

---

## 2. Screen-by-Screen Implementation Scope

### Phase 1: Property Workspace & Core Hubs (High Priority)

#### 1. Properties Dashboard (`src/screens/ShowsHomeScreen.tsx`)
- **Hero "Needs Your Attention" Banner**: Split card (16:9 photo left with address badge; warning details right with orange badge `● CAPTURE NEEDED`, segmented space progress bar `6 of 7 spaces`, and `Record now` / `See why` CTAs).
- **"In Progress" Active Queue**: Horizontal progress cards with animated dotted spinner, ETA (`Expected in 18–25 minutes`), and status.
- **"Your Properties" Grid**: Responsive 3-column card grid with cover photo, property specs, status dot, and kebab menu.

#### 2. Property Detail & Spatial Hub (`src/screens/ShowOverviewScreen.tsx`)
- **Dynamic Tab Switcher**: `Overview`, `Evidence / Captures`, `Reconstruction`, `Experience`, `Approvals`, `Activity`.
- **Overview Tab**:
  - Hero Reconstruction card with milestone pipeline stepper (`Evidence review` → `Reconstruction` → `Verification` → `Ready for review`).
  - 2D Floor Plan Coverage Map with room checkmarks, missing room dashed highlight, and 88% donut gauge.
  - Property summary sidebar, latest capture card, and recent activity timeline.
- **Experience Review Tab** (as in reference `media_1787695938841.jpg`):
  - Interactive 3D room viewer with HUD overlays (`LIVING ROOM / 01`, connectivity pill, room switcher carousel).
  - Confidence meter breakdown (`|||` verified signal bars for Room coverage, Balcony connection, Dimensions).
  - Resolved issues accordion and `Approve and publish` sticky action bar.
- **Reconstruction Tab** (as in reference `media_1787696017629.png`):
  - 3D Point cloud wireframe preview with camera trajectory vector.
  - Property evidence room status table with source badges (`Phone capture`, `Original video`).

#### 3. Experiences Pipeline Table (`src/screens/ProductionsScreen.tsx`)
- **Filter Tabs**: `All`, `Preparing`, `Ready for review`, `Live`, `Failed`.
- **Data Table Layout**:
  - Columns: `Experience` (thumbnail + title + address), `State` (status dot + room summary), `Visibility` (Unlisted / Public icon badge), `Updated`, `Action` (`Review` / `Open` / `Open experience`).
- **Pagination**: Numbered page footer (`1, 2, 3 ... 5`).

---

### Phase 2: Capture Management & Approvals Workflow

#### 4. Capture Requests Dashboard (`src/screens/CaptureRequestsScreen.tsx` — [NEW])
- **Header & Metric Counters**: `2 awaiting capture · 1 received · 6 resolved this month`.
- **Filter Tabs**: `Open`, `Awaiting capture`, `Received`, `Checking`, `Resolved`.
- **Requests Table**: Thumbnail, property title, capture needed (`Kitchen-to-dining connection`), recipient, status pill, updated timestamp, action button (`View request`, `Check footage`, `View history`).
- **Footer Guidance Card**: "A good request is specific" with example copy.

#### 5. Capture Request Detail Screen (`src/screens/CaptureRequestDetailScreen.tsx` — [NEW])
- **Perspective Spatial Annotation Canvas**: Photo with yellow dashed doorway frame overlay and floor trajectory dots.
- **Capture Instructions Card**: Direction copy ("Start in dining room..."), estimated recording time (20s), video example thumbnail with play button.
- **What to Include Checklist**: Green checkmarks for angle requirements.
- **Right Sidebar Panels**:
  - Request details (Recipient, Delivery channels, Sent date, Secure link with `Copy link` & `Resend` buttons).
  - Status history timeline (`Request created` → `Secure link generated` → `Awaiting capture` → `Quality check`).
  - Request controls (`Edit instructions`, `Cancel request`).

#### 6. Approvals Dashboard (`src/screens/ApprovalsScreen.tsx` — [NEW])
- **Filter Tabs**: `Ready`, `Changes requested`, `Published`.
- **Hero Featured Approval Card**: Large property photo + "Ready to publish" checklist (6/6 rooms, 2 issues resolved) + `Review experience` and `Preview as visitor` CTAs.
- **Pending Approvals List**: Compact property rows with room representation status and direct `Review` buttons.

---

### Phase 3: Operations, Analytics & Administration

#### 7. Usage & Analytics Dashboard (`src/screens/UsageScreen.tsx` — [MODIFY])
- **3 Top Metric Cards**:
  - Properties processed: `18 / 25 this month` (with green progress bar).
  - Reconstruction time: `7.4h / 20h included` (with green progress bar).
  - Active storage: `14.2 GB / 50 GB` (with green progress bar).
- **Usage by Property Table**: Cover thumbnail, property name, processing duration, storage used, experience status, updated time, kebab menu.
- **Plan Footer Card**: "Professional" plan tier details and `View plan details` button.

#### 8. Team Management Dashboard (`src/screens/TeamScreen.tsx` — [NEW])
- **Header & Stats**: `4 active members · 1 pending invitation` + `Invite member` CTA.
- **Members Table**: Avatar, Name & email, Role (`Owner`, `Property manager`, `Reviewer`, `Capture contributor`), Property access scope, Last active, Status, Kebab menu.
- **Roles & Permissions Guide**: Explanatory cards for each permission tier.

#### 9. Workspace Settings (`src/screens/SettingsScreen.tsx` — [MODIFY])
- **Tabs**: `Workspace`, `Connections`, `Security`.
- **Workspace Form**: Workspace name, URL slug (`openhouse.app/workspaces/david`), Workspace type dropdown.
- **Region & Localization**: Timezone (`Africa/Lagos`), Language (`English`), Currency (`NGN`), Date format.
- **Default Contact & Danger Zone**: Agent contact fields + `Delete workspace` button.

#### 10. Published Experience Sharing Hub (`src/screens/PublishedExperienceScreen.tsx` — [NEW])
- **3D Viewer HUD Preview**: Interactive room canvas with live status badge.
- **Distribution Suite**:
  - Clean URL link box (`openhouse.app/h/8-admiralty-way`) + `Copy link`.
  - Quick share buttons: WhatsApp, Email, QR Code.
  - Embed code generator (`<iframe src="...">`) + `Copy listing button`.
  - Visitor contact card (`Book an inspection` lead capture button + agent routing).

---

## 3. Implementation Order & Milestones

1. **Step 1 — Global Shell & Routes**: Update `WorkspaceShell.tsx` navigation items, routes in `App.tsx`, and shared types.
2. **Step 2 — Properties Dashboard**: Refactor `ShowsHomeScreen.tsx` to add Attention Banner and In-Progress queue.
3. **Step 3 — Property Detail Screen**: Upgrade `ShowOverviewScreen.tsx` with all 4 view modes (Overview, 3D Experience Review, Reconstruction, Evidence).
4. **Step 4 — Experiences & Approvals**: Build `ProductionsScreen.tsx` table and `ApprovalsScreen.tsx`.
5. **Step 5 — Capture Requests Hub & Detail**: Build `CaptureRequestsScreen.tsx` and `CaptureRequestDetailScreen.tsx`.
6. **Step 6 — Usage, Team & Settings**: Build `UsageScreen.tsx`, `TeamScreen.tsx`, and `SettingsScreen.tsx`.
7. **Step 7 — Published Experience Hub**: Build `PublishedExperienceScreen.tsx`.

---

## 4. Verification Plan

### Automated Build & Typecheck
- Run `npx tsc -b` to verify TypeScript compile integrity with zero errors.
- Run `npx vite build` to ensure production bundle packaging succeeds.

### Interactive UI Verification
- Verify responsive layout across 1280px, 1440px, and 1920px viewports on `http://localhost:5173`.
- Verify navigation between all sidebar tabs and sub-tabs.
- Verify 3D viewer HUD, floor plan coverage map, confidence meters, and filter states.
