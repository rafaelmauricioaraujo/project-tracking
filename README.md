# Project Tracking System

A full-stack application for managing projects with status tracking and due dates. Built with React and Express.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, Vite, Tailwind CSS, React Router v6, React Hook Form, Axios |
| Backend | Express, MongoDB, Mongoose, Joi |

## Prerequisites

- **Node.js** v18 or higher
- **MongoDB** running locally on port 27017 (or a remote URI)

## Setup

### 1. Backend

```bash
cd backend
npm install
```

Create a `.env` file (or edit the existing one):

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/project-tracker
CLIENT_URL=http://localhost:3000
```

Start the development server:

```bash
npm run dev
```

The API will be available at `http://localhost:5000`.

### 2. Frontend

```bash
cd frontend
npm install
```

Create a `.env` file (or edit the existing one):

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

### Production Build

```bash
# Frontend
cd frontend
npm run build      # outputs to dist/
npm run preview    # preview the build locally

# Backend
cd backend
npm start
```

## API Documentation

**Base URL:** `http://localhost:5000/api`

### Project Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/projects` | Create a project |
| `GET` | `/projects` | List projects (filter, search, paginate) |
| `GET` | `/projects/:id` | Get a project by ID |
| `PATCH` | `/projects/:id` | Update a project |
| `DELETE` | `/projects/:id` | Delete a project |

### Create Project

**`POST /projects`**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `name` | string | Yes | Max 200 chars |
| `clientName` | string | Yes | Max 200 chars |
| `status` | string | No | `ACTIVE`, `COMPLETED`, or `ON_HOLD`. Default: `ON_HOLD`. Case-insensitive input. |
| `startDate` | string | No | `YYYY-MM-DD` |
| `endDate` | string | No | `YYYY-MM-DD`. Requires `startDate` and must be after it. |

```json
// Request
{ "name": "Website Redesign", "clientName": "Acme Corp", "status": "active" }

// Response — 201 Created
{
  "id": "507f1f77bcf86cd799439011",
  "name": "Website Redesign",
  "clientName": "Acme Corp",
  "status": "ACTIVE",
  "createdAt": "2024-01-10T14:30:00.000Z",
  "updatedAt": "2024-01-10T14:30:00.000Z"
}
```

### List Projects

**`GET /projects`**

| Parameter | Type | Default | Notes |
|-----------|------|---------|-------|
| `status` | string | — | Filter by status (case-insensitive) |
| `search` | string | — | Searches `name` and `clientName` (partial, case-insensitive) |
| `page` | number | `1` | Min 1 |
| `limit` | number | `10` | Min 1, max 100 |

```json
// Response — 200 OK
{
  "data": [ { "id": "...", "name": "...", ... } ],
  "pagination": { "page": 1, "limit": 10, "total": 25, "totalPages": 3 }
}
```

### Get Project

**`GET /projects/:id`** — Returns the project object. `404` if not found.

### Update Project

**`PATCH /projects/:id`** — Accepts any subset of the create fields. At least one field required. Returns the updated project.

### Delete Project

**`DELETE /projects/:id`** — Returns `204 No Content`. `404` if not found.

### Error Format

All errors follow this structure:

```json
{
  "error": {
    "message": "Validation failed",
    "details": [
      { "field": "name", "message": "\"name\" is required" }
    ]
  }
}
```

| Status | Meaning |
|--------|---------|
| `400` | Validation error or malformed request |
| `404` | Resource not found |
| `500` | Internal server error |

## Assumptions and Trade-offs

### Assumptions

- **MongoDB is available locally.** The app expects a MongoDB instance at `localhost:27017` by default. There is no embedded database or Docker setup included.
- **No authentication.** The system is designed as a single-user tool without login or user management. All projects are globally accessible.
- **Dates are date-only.** Start and end dates use `YYYY-MM-DD` format and represent calendar dates, not precise timestamps.
- **Status values are finite.** Only three statuses exist (`ACTIVE`, `COMPLETED`, `ON_HOLD`). Custom statuses are not supported.

### Trade-offs

- **Context API over Redux.** React Context is used for global state. This keeps the dependency footprint small and is sufficient for the current scale, but may cause unnecessary re-renders in larger apps.
- **Client-side filtering vs. server-side.** Filters and search are handled server-side through query parameters, which scales better with large datasets but adds a network round-trip for every filter change (mitigated by debouncing search input).
- **No optimistic updates.** Status changes and deletions wait for the API response before updating the UI. This is simpler and avoids inconsistent state, but feels slightly slower to the user.
- **Pagination limit capped at 100.** The backend enforces a max of 100 items per page. Dashboard stats use the `pagination.total` field from the API response rather than fetching all records, which is efficient but requires multiple requests for per-status counts.
- **No caching layer.** Every page navigation re-fetches data from the API. This ensures freshness but increases server load. A caching strategy (SWR, React Query) could improve performance.
- **Tailwind CSS utility classes.** Styling is done with utility classes directly in JSX. This avoids maintaining separate CSS files but can make component markup verbose.


## AI Usage Policy

Tools used: Claude Code

Used on: Frontend, Backend, Debugging.
