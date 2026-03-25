# Phase 01 — Frontend Prototype

## Overview

This phase implements the complete frontend prototype of the **BU Monitor** (Parallel Election Tabulation System). The application is built with React + TypeScript + Vite and uses only mocked data — no backend integration exists yet.

The prototype covers the full user flow:
- Login with role-based access
- Upload of Boletim de Urna (BU) PDF files
- Listing of all uploaded BUs with processing status
- Aggregated election results by office and candidate

---

## Architecture Decisions

### React + Vite + TypeScript
Chosen for fast development iteration, strong typing, and modern tooling. Vite provides near-instant HMR.

### React Router v6
Used for client-side routing with nested routes. The `createBrowserRouter` API is used for future-proof configuration.

### CSS Variables (no Tailwind)
A single `index.css` file with CSS custom properties was chosen over Tailwind to avoid build complexity in the prototype phase. All design tokens are defined as CSS variables in `:root`.

### AuthContext (React Context API)
Authentication state is managed via a React Context (`AuthContext`) with a custom hook (`useAuth`). This avoids external state management libraries while keeping auth state globally accessible.

### ProtectedRoute pattern
All authenticated routes are wrapped in a `ProtectedRoute` component that redirects unauthenticated users to `/login`.

### Service layer (`buService`)
All data access goes through `src/services/buService.ts`. Components never access mock data directly. This ensures a clean separation that will allow replacing mock calls with real API calls in future phases.

### User identity on uploads
Every BU upload is associated with the authenticated user's `id` and `name`. This is passed explicitly to `buService.uploadFile(file, user)` and stored in the `UploadedFile` record.

### Role-based navigation
The sidebar navigation filters items based on the user's role. The "Enviar BU" page is only visible to users with the `inspector` role.

---

## Folder Structure

```
frontend/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── docs/
│   └── implementation/
│       └── phase_01_frontend_prototype.md
└── src/
    ├── main.tsx                  # Entry point
    ├── App.tsx                   # Root component (AuthProvider + RouterProvider)
    ├── index.css                 # Global styles and CSS variables
    ├── types/
    │   └── index.ts              # All TypeScript interfaces and types
    ├── contexts/
    │   └── AuthContext.tsx       # Auth state, login/logout, useAuth hook
    ├── routes/
    │   ├── index.tsx             # Route definitions (createBrowserRouter)
    │   └── ProtectedRoute.tsx    # Auth guard component
    ├── layouts/
    │   └── MainLayout.tsx        # Sidebar + topbar + Outlet
    ├── pages/
    │   ├── LoginPage.tsx         # Login form with mock credentials
    │   ├── DashboardPage.tsx     # Stats, progress, vote preview, timeline
    │   ├── UploadPage.tsx        # Drag-and-drop upload with status tracking
    │   ├── BoletinsPage.tsx      # BU list with filters and user column
    │   └── ResultadosPage.tsx    # Aggregated results by office + coverage
    ├── components/
    │   ├── StatusBadge.tsx       # Colored badge for processing status
    │   ├── ProgressBar.tsx       # Labeled progress bar with percentage
    │   └── VoteBarChart.tsx      # Horizontal bar chart for vote results
    ├── services/
    │   └── buService.ts          # All data access (mocked with delay simulation)
    └── mocks/
        └── data.ts               # Mock datasets: BUs, votes, stats, timeline
```

---

## Key Components

### Pages

| Page | Path | Description |
|------|------|-------------|
| `LoginPage` | `/login` | Email/password form. Redirects to dashboard on success. |
| `DashboardPage` | `/` | Overview: stats cards, progress bar, vote preview, upload timeline. |
| `UploadPage` | `/upload` | Drag-and-drop PDF upload. Simulates pending → processing → processed transitions. Only visible to `inspector` role. |
| `BoletinsPage` | `/boletins` | Full BU list with filters by status, zone, and text search. Shows uploader identity. |
| `ResultadosPage` | `/resultados` | Aggregated results by office. Includes coverage stats and detailed table. |

### Components

| Component | Description |
|-----------|-------------|
| `StatusBadge` | Renders a colored pill badge for `pending`, `processing`, `processed`, `failed`. |
| `ProgressBar` | Displays a labeled progress bar with percentage and absolute counts. |
| `VoteBarChart` | Renders horizontal bars for each candidate with vote count and percentage. |

### Services

| Service | Method | Description |
|---------|--------|-------------|
| `buService` | `getBoletins()` | Returns all mock BUs. |
| `buService` | `getDashboardStats()` | Returns aggregate stats. |
| `buService` | `getSectionCoverage()` | Returns section coverage data. |
| `buService` | `getAggregatedResults()` | Computes vote totals per candidate per office. |
| `buService` | `getUploadTimeline()` | Returns hourly upload counts. |
| `buService` | `uploadFile(file, user)` | Simulates upload with 1.5s delay. Associates upload with user. |

### Auth

| Item | Description |
|------|-------------|
| `AuthContext` | Provides `user`, `login()`, `logout()`, `isAuthenticated`. |
| `useAuth()` | Hook to consume auth context in any component. |
| `ProtectedRoute` | Redirects to `/login` if not authenticated. |
| Mock users | `inspetor@bumonitor.br` / `123456` (inspector), `analista@bumonitor.br` / `123456` (analyst). |

---

## Data Model

### Types (`src/types/index.ts`)

```typescript
type ProcessingStatus = 'pending' | 'processing' | 'processed' | 'failed';
type UserRole = 'inspector' | 'analyst';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  municipality: string;
}

interface BoletimUrna {
  id: string;
  municipality: string;
  zone: number;
  section: number;
  uploadDate: string;
  status: ProcessingStatus;
  fileName: string;
  fileHash?: string;
  errorMessage?: string;
  uploadedBy?: string;       // User.id
  uploadedByName?: string;   // User.name
}

interface UploadedFile {
  id: string;
  fileName: string;
  fileSize: number;
  status: ProcessingStatus;
  uploadedAt: string;
  uploadedBy: string;        // User.id (required)
  uploadedByName: string;    // User.name (required)
  municipality?: string;
  zone?: number;
  section?: number;
  errorMessage?: string;
}
```

### Mock Data (`src/mocks/data.ts`)

- **12 BUs** from Florianópolis, zones 107–110, with mixed statuses.
- **Vote records** for 3 offices: Presidente, Governador, Senador.
- **3 candidates** per office with realistic vote counts.
- **Upload timeline** with 6 hourly entries.
- All BUs have `uploadedBy` and `uploadedByName` fields.

---

## How to Extend

### Add a new page
1. Create `src/pages/NewPage.tsx`.
2. Add a route in `src/routes/index.tsx` under the protected layout.
3. Add a nav item in `src/layouts/MainLayout.tsx` (`navItems` array).
4. Optionally restrict by role using the `roles` field in the nav item.

### Add a new API call
1. Add the method to `src/services/buService.ts`.
2. Add mock data to `src/mocks/data.ts` if needed.
3. Call the service from the page component using `useEffect`.

### Add a new user role
1. Add the role to `UserRole` type in `src/types/index.ts`.
2. Add the mock user to `MOCK_USERS` in `src/contexts/AuthContext.tsx`.
3. Add role label to `roleLabels` in `src/layouts/MainLayout.tsx`.
4. Restrict nav items using the `roles` field.

### Replace mock data with real API
1. Replace the body of each `buService` method with a `fetch()` or `axios` call.
2. No changes needed in pages or components — they consume the service interface.

### Add a new component
1. Create `src/components/NewComponent.tsx`.
2. Export a named function component.
3. Import and use in any page.

---

## Known Limitations

- **No backend integration** — all data is mocked in memory.
- **No real authentication** — credentials are hardcoded in `AuthContext.tsx`.
- **No session persistence** — login state is lost on page refresh.
- **No real file upload** — files are not sent to any server or S3.
- **No real-time updates** — status transitions are simulated with `setTimeout`.
- **No S3 signed URL flow** — upload bypasses the intended backend flow.
- **No tests implemented** — testing infrastructure not yet set up.
- **No map visualization** — section coverage map is a placeholder.
- **Single municipality** — UI is hardcoded for Florianópolis.

---

## Next Suggested Steps

1. **Phase 02 — Backend API**: Implement FastAPI backend with PostgreSQL, BU parser, and S3 integration.
2. **Phase 03 — API Integration**: Replace `buService` mock methods with real HTTP calls to the backend API.
3. **Phase 04 — Authentication**: Implement JWT-based authentication. Replace mock login with real `/auth/login` endpoint.
4. **Phase 05 — Real-time**: Add WebSocket or polling for live status updates on BU processing.
5. **Phase 06 — Testing**: Add Jest + React Testing Library tests for critical components and pages.
6. **Phase 07 — Infrastructure**: Deploy frontend to S3 + CloudFront via Terraform.
