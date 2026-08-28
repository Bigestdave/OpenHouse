# OpenHouse Design Protocol — Strict Rules

## 1. Codebase & Git-History First (Never Invent New Screens)
- When a route, button, or flow needs fixing, **always check existing files and git history first** to restore the exact original component the user approved.
- Never draft a replacement screen from scratch when one already exists.

## 2. Canonical Screen Registry (Locked-In Approved Screens)
These screens and routes are final. Do not replace, redesign, or substitute them:

| Route | Screen Component | Description |
|---|---|---|
| `/create-show` | `CreateShowBasicsScreen` | 3-step wizard Step 1: Property specs |
| `/create-show/style` | `CreateShowStyleScreen` | 3-step wizard Step 2: Review & capture method |
| `/create-show/characters` | `CreateShowCharactersScreen` | 3-step wizard Step 3: Spaces & coverage |
| `/properties` | `ShowsHomeScreen` | Realtor Attention Inbox (4 sections) |
| `/property/:id` | `ShowOverviewScreen` | 5-tab progressive disclosure lifecycle |
| `/approvals` | `ApprovalsScreen` | Split-screen tour review + 1-click publish |
| `/capture/:id` | `MobileCaptureScreen` | 4-step mobile capture flow |
| `/view/:id` | `PublicPropertyViewerScreen` | Renter 3D walkthrough + Stories + Q&A |
| `/experience/:id/published` | `PublishedExperienceScreen` | Post-publish sharing & embed |

## 3. Confirm Before Any Structural UI Changes
- Preserve existing layout, styles, and multi-step structure.
- Make only functional/data wiring changes without altering the approved design.
- If a new screen is truly needed, propose it and wait for user approval before building.

## 4. Design System Tokens (Do Not Override)
- `--color-canvas: #F2EEE5` (warm limestone)
- `--color-surface: #FBF8F2` (card surface)
- `--color-primary: #194534` (deep architectural green)
- `--color-sidebar: #0B1713` (dark green-black sidebar)
- `--color-accent: #D97945` (copper accent)
- `--color-ink: #17231E` (primary text)
- All new screens must use these tokens and the `src/components/ui/` design system primitives.

## 5. TypeScript Rules
- Use `import type { ... }` for type-only imports (`verbatimModuleSyntax` is enabled).
- Always run `npx.cmd tsc -b` before declaring work complete.
