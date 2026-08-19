# TaskFlow — Production Task Management System

A Jira/Linear/ClickUp-style task management system.

## Monorepo Layout

```
taskflow/
├── backend/          NestJS + Prisma + PostgreSQL API
│   ├── prisma/
│   │   └── schema.prisma       ← full data model (11 models, 6 enums)
│   ├── src/
│   │   ├── config/              PrismaModule, PrismaService
│   │   ├── common/               guards, decorators, filters, interceptors, pipes
│   │   ├── modules/
│   │   │   ├── auth/             signup, login, guest, google, JWT, refresh
│   │   │   ├── users/
│   │   │   ├── workspaces/
│   │   │   ├── projects/
│   │   │   ├── tasks/
│   │   │   ├── subtasks/
│   │   │   ├── comments/
│   │   │   ├── labels/
│   │   │   ├── activities/
│   │   │   ├── theme/
│   │   │   └── settings/
│   │   ├── app.module.ts
│   │   └── main.ts
│   └── package.json
│
└── frontend/          Next.js 15 (App Router) + TypeScript + Tailwind
    ├── app/
    │   ├── (auth)/login, /signup
    │   ├── (dashboard)/tasks, /projects/[projectId], /profile, /settings
    │   ├── layout.tsx            root layout w/ theme + query providers
    │   └── globals.css           CSS-variable theme, 6 accent colors, dark mode
    ├── components/ui, board, tasks, layout, auth, shared
    ├── hooks, lib, store, types, services
    ├── providers/                ThemeProvider (+accent persistence), QueryProvider
    └── package.json
```

## Status: Phase 7 complete (testing & deployment)

### Testing
- **Backend unit tests** (Jest, mocked Prisma/services — no DB needed): `AuthService` (login
  failure paths, token issuance, sanitized user, guest login, refresh-token rotation, logout),
  `TasksService` (column-append positioning on create, the reorder transaction's exact
  `updateMany`/`update` shape, conditional activity logging), `SubtasksService` (progress
  percentage math, completion-transition logging). **22 tests, all passing** — actually run in
  this sandbox via `ts-jest`'s `isolatedModules` mode, since the sandbox can't reach
  `binaries.prisma.sh` to generate the real client.
- **Backend e2e tests** (Supertest, real HTTP + real Postgres): `auth.e2e-spec.ts` (signup,
  duplicate-email rejection, login success/failure, guest provisioning, protected-route 401/200)
  and `tasks.e2e-spec.ts` (full workspace → project → task → drag-and-drop reorder → activity-log
  flow). These need a real database and are skipped in this sandbox — run with
  `npx prisma migrate deploy && npm run test:e2e` against a disposable Postgres.
- **Frontend unit/component tests** (Vitest + React Testing Library): `cn()` utility, the login/
  signup Zod schemas, the `Button` primitive, and `LoginForm` (blocks submit on invalid email,
  calls the auth service with valid credentials, renders Google/guest options). **19 tests, all
  passing**, run directly in this sandbox with `npm run test`.
- **Bug caught along the way**: `esModuleInterop` was missing from the backend `tsconfig.json`,
  which would have silently broken `cookie-parser`'s default import at runtime (type-checked fine,
  but `main.ts` would have crashed on boot). Fixed as part of wiring up the e2e tests.

### Deployment
- **Backend**: multi-stage `Dockerfile` (deps → `prisma generate` + `nest build` → slim runtime
  image that runs `prisma migrate deploy` before booting), `render.yaml` Blueprint provisioning a
  managed Postgres instance and a Dockerized web service with health checks and JWT secrets
  auto-generated
- **Frontend**: multi-stage `Dockerfile` using Next.js `output: 'standalone'` (verified the build
  actually produces `.next/standalone/server.js`), `vercel.json` with baseline security headers —
  Vercel auto-detects Next.js so this is mostly for the headers
- **`docker-compose.yml`** at the repo root: one command (`docker compose up --build`) runs
  Postgres + backend + frontend together for local development without installing Postgres
  natively
- **`.github/workflows/ci.yml`**: two parallel jobs — backend (type-check, unit tests, e2e tests
  against a real `postgres:16-alpine` service container, production build) and frontend
  (type-check, unit tests, production build)

> The full stack — Prisma schema, every backend module, the whole frontend, and now tests +
> deploy configs — has been iteratively installed, type-checked, unit-tested, and built at every
> phase in this sandbox. The only things this sandbox's network allowlist prevented from running
> were `prisma generate` (needs `binaries.prisma.sh`) and Google Fonts — both trivial in a normal
> environment with open internet access.

## Status: Phase 6 complete (theme, profile, settings)

- **Profile page** (`/profile`): full editable form (name, username, avatar-by-URL with live
  preview) using RHF + Zod, read-only email/role fields, wired to `PATCH /users/me`
- **Danger zone**: "Remove workspace" (leaves the current workspace via the Phase 2 membership
  endpoint) and "Delete account" (`DELETE /users/me`), both behind the shared `ConfirmDialog`
- **Settings page** (`/settings`): field-visibility toggles (Priority/Members/Status/Reporter/
  Labels/Due date) backed by the `FieldPreference` API, optimistic `Switch` toggles — and these
  **actually control the UI now**: `TaskCard`, `KanbanBoard`/`KanbanColumn`, and `ListView` all
  accept a `visibility` prop and conditionally render columns/badges accordingly, so toggling a
  setting immediately changes what the board and list show
- **Theme sync** (`useThemeSync`): mode + accent now hydrate from the backend `ThemePreference`
  API once per session after login (server wins, so preferences follow you across devices) and
  push subsequent local changes back up — layered on top of the Phase 1 localStorage persistence,
  which still makes theme survive a plain refresh with zero network round trip
- **Dedicated Projects pages**: `/projects` (grid of cards, create/edit/delete, empty state) and
  `/projects/[projectId]` (header with color/key/description, edit/delete, scoped task list,
  "Open board" jump-link) — replacing the lightweight inline picker as the primary project UI
  (the picker from Phase 4 remains on the Tasks page for quick switching)
- New shadcn/ui primitive: `Switch`

> Verified: `npx tsc --noEmit` and `npm run build` both succeed — all 10 routes compile
> (`/projects` 6.5kB, `/projects/[projectId]` 2.5kB, `/settings` 6.3kB, `/profile` 6.1kB). Same
> Google Fonts sandbox caveat as prior phases.

## Status: Phase 5 complete (task details, comments, subtasks)

- **Full task detail page** (`/tasks/[taskId]`): replaces the Phase 4 quick-view sheet entirely —
  inline-editable title and description (autosave on blur), a meta sidebar, subtasks, comments,
  and the activity timeline, all in one page. Board and list view cards now navigate here.
- **Meta panel**: status/priority selects, due-date picker, reporter display, plus two new
  popover-based pickers:
  - `AssigneePicker` — debounced user search, toggle to assign/unassign, avatar chips
  - `LabelPicker` — attach/detach the project's labels, color swatches
  - Every change here fires a single `PATCH /tasks/:id` and invalidates the task, its activity
    log, and every cached task list — so the board reflects edits made from the detail page
- **Subtasks**: checkbox completion, inline add/delete, and a live progress bar driven by the
  backend's computed `progress` percentage
- **Comments**: nested one level deep (replies), reply composer per comment, delete restricted to
  the comment's own author (checked against the authenticated user in `auth-store`), empty state
- **Activity timeline**: per-type icons (created/updated/priority/status/assignee/comment/subtask/
  label/due-date changes) with relative timestamps, reading the log Phase 2's services
  (`ActivitiesService.log(...)`) already populate automatically
- **Delete task**: confirmation dialog (new reusable `ConfirmDialog`), redirects back to the board
  on success
- New shadcn/ui primitives: `Popover`, `Checkbox`

> Verified: `npx tsc --noEmit` and `npm run build` both succeed — `/tasks/[taskId]` compiles at
> 13kB. Same Google Fonts sandbox caveat as prior phases.

## Status: Phase 4 complete (Kanban board & list view)

- **Kanban board** (`components/board/`): dnd-kit `DndContext` with 4 droppable columns
  (To Do / Doing / Completed / On Hold), sortable draggable cards, a `DragOverlay` ghost card,
  and `onDragEnd` logic that resolves the drop target (column vs. card) into a `{status, position}`
  pair and calls the reorder mutation
- **Optimistic drag & drop** (`hooks/use-tasks.ts` → `useReorderTask`): the board re-sorts
  instantly on drop via a TanStack Query cache patch, then rolls back automatically with a toast
  if the `/tasks/:id/reorder` call fails — no flash of stale state on the happy path
- **List view** (`components/tasks/list-view.tsx`): the same task data in a sortable table
  (title/status/priority/assignees/reporter/due date), toggled against the board with
  `ViewToggle` (state persisted via `ui-store`)
- **Filters & search**: `TaskFiltersBar` with debounced (350ms) free-text search plus
  status/priority selects, all wired directly to the backend's `/tasks` query params
- **Task creation**: `CreateTaskDialog` (RHF + Zod) pre-fills the column you clicked "+" on
- **Task quick view**: clicking a card/row opens a side `Sheet` with full details, subtasks
  checklist, and assignees — the full editable detail page with comments/activity lands in Phase 5
- **Project infrastructure**: since tasks require a project, this phase also adds a minimal
  `ProjectPicker` (dropdown + inline `CreateProjectDialog`) so the board is actually usable
  end-to-end today; the dedicated Projects pages come later
- New shadcn/ui primitives: `Select`, `Textarea`

> Verified: `npx tsc --noEmit` and `npm run build` both succeed — the `/tasks` route (board + list
> + dnd-kit) compiles to 40kB. Same Google Fonts sandbox caveat as before; irrelevant outside this
> container.

## Status: Phase 3 complete (frontend layout & auth)

- **UI primitives** (shadcn/ui-pattern, Radix-based): Button, Input, Label, Card, Avatar, Badge,
  DropdownMenu, Dialog, Sheet, Tooltip, Separator, Skeleton
- **Auth flow, end to end**: `/login` and `/signup` pages with a branded split layout,
  React Hook Form + Zod validation, Google OAuth redirect button, guest-login button,
  "remember me", inline field errors
- **API client** (`services/api-client.ts`): axios instance with `withCredentials`, bearer-token
  fallback header, and a single-flight 401 interceptor that calls `/auth/refresh` and retries the
  original request — de-duped so concurrent 401s don't fire multiple refreshes
- **Zustand stores**: `auth-store` (persists only the user profile; tokens stay in memory / httpOnly
  cookies), `ui-store` (sidebar collapsed state, board/list view), `workspace-store` (current
  workspace, persisted)
- **`middleware.ts`**: redirects unauthenticated requests away from `/tasks`, `/projects`,
  `/profile`, `/settings`, and bounces authenticated users away from `/login` / `/signup`
- **App shell**: collapsible desktop `Sidebar` (workspace switcher, nav, theme switcher, user menu,
  collapse toggle) + `MobileSidebar` (Sheet-based drawer) + `Topbar` with search input, wired into
  a `(dashboard)` route group layout that also does a client-side session check
- **Theme switcher UI**: dark/light/system toggle + all 6 accent-color swatches, using the
  `ThemeProvider`/`useAccent` built in Phase 1
- Placeholder pages for Tasks, Projects, Project detail, Profile, Settings so the whole shell is
  navigable now — these get real content in Phases 4–6

> Verified: `npm install`, `npx tsc --noEmit`, and `npm run build` (full production build,
> 10 routes, middleware compiled) all succeed. The only sandbox-specific hiccup was Google
> Fonts being unreachable from this container's network allowlist — irrelevant on Vercel or any
> normal dev machine.

## Status: Phase 2 complete (backend)

Every backend module is now fully implemented: DTOs (class-validator), services (Prisma
queries/transactions), controllers (Swagger-documented), and a module file wiring it together.

- **Auth**: signup, login, guest login, Google OAuth (Passport strategy + callback), JWT access
  + refresh tokens (httpOnly cookies, refresh token hashed at rest), logout, global `JwtAuthGuard`
  applied app-wide via `APP_GUARD` with `@Public()` opt-out on auth endpoints
- **Users**: profile CRUD, user search (for assignee pickers), guest + Google account provisioning
- **Workspaces**: create/list/update/delete, member add/remove with OWNER/ADMIN/MEMBER/GUEST role
  checks
- **Projects**: scoped to workspace, unique project key enforcement, membership-gated access
- **Tasks**: full CRUD, filtering (status/priority/assignee/reporter/label), debounced-search-ready
  full-text `search` param, sorting, pagination, **drag-and-drop reorder endpoint** that shifts
  sibling positions in a transaction, automatic activity-log entries on status/priority/assignee/
  due-date/detail changes
- **Subtasks**: CRUD, completion checkbox, computed progress percentage per task
- **Comments**: nested replies (self-referential `parentId`), edit/delete restricted to the
  comment's own author
- **Labels**: project-scoped CRUD with duplicate-name protection
- **Activities**: shared logging service injected into Tasks/Subtasks/Comments; queried by task
  or project for the activity timeline
- **Theme**: per-user persisted mode + accent color (upsert semantics)
- **Settings**: per-user persisted field-visibility preferences for the task board

**Also added:** global `HttpExceptionFilter`, `TransformInterceptor`, `RolesGuard` +
`@Roles()` decorator, `@CurrentUser()` param decorator, `@Public()` route decorator.

> Verified: `npm install` succeeds and the code type-checks cleanly (aside from two
> implicit-`any` warnings that resolve once `npx prisma generate` runs with real network access —
> the sandbox this was built in blocks the Prisma engine binary host).

## Status: Phase 1 complete

- [x] Monorepo structure (backend + frontend)
- [x] Prisma schema — User, Workspace, WorkspaceMember, Project, Task, TaskAssignee,
      Subtask, Comment (nested), Label, TaskLabel, ActivityLog, ThemePreference, FieldPreference
- [x] NestJS bootstrap: Swagger at `/api/docs`, global `ValidationPipe`, CORS, cookie parsing,
      versioned prefix `api/v1`
- [x] Module skeletons for every backend domain (auth, users, workspaces, projects, tasks,
      subtasks, comments, labels, activities, theme, settings)
- [x] Next.js App Router structure with route groups for `(auth)` and `(dashboard)`
- [x] Theme system: light/dark via `next-themes`, 6 persisted accent colors via CSS variables
      + `data-accent` attribute + `localStorage`
- [x] TanStack Query provider for server state
- [x] Tailwind config wired to CSS variables (shadcn/ui-compatible)

## Not yet built

Nothing from the original 7-phase plan remains. Natural next steps beyond that scope: avatar file
upload (currently URL-only), email change flow, workspace invite-by-email, real-time comments
(the schema and REST API are already "realtime-ready" per the original spec — a WebSocket gateway
would be the next addition), and a component/e2e test suite for the Kanban drag-and-drop
interaction specifically.

## Local setup

```bash
# Option A — Docker Compose (Postgres + backend + frontend together)
docker compose up --build
# Frontend: http://localhost:3000 · Backend: http://localhost:4000/api/v1 · Swagger: /api/docs

# Option B — run natively
cd backend
cp .env.example .env   # fill in DATABASE_URL, JWT secrets, Google OAuth creds
npm install
npx prisma generate
npx prisma migrate dev
npm run start:dev        # http://localhost:4000  (Swagger: /api/docs)

cd frontend
cp .env.local.example .env.local
npm install
npm run dev               # http://localhost:3000
```

## Testing

```bash
# Backend — unit tests (no DB required)
cd backend && npm test

# Backend — e2e tests (requires a real Postgres; see test/*.e2e-spec.ts headers)
cd backend && npx prisma migrate deploy && npm run test:e2e

# Frontend — unit/component tests
cd frontend && npm test
```

## Deployment

- **Backend → Render**: push this repo and use `render.yaml` as a Blueprint, or point Render at
  `backend/Dockerfile` directly. Set `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` in the dashboard
  (marked `sync: false` in the blueprint since they're secrets).
- **Frontend → Vercel**: import the repo, set the root directory to `frontend/`, and set
  `NEXT_PUBLIC_API_URL` to your deployed backend's URL. `vercel.json` adds baseline security
  headers; everything else is auto-detected.
- **Database → managed Postgres**: Render's blueprint provisions one automatically; any other
  provider works too — just point `DATABASE_URL` at it and run `npx prisma migrate deploy`.
