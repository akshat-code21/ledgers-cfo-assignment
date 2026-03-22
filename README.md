# Mini Compliance Tracker

A simple web app to track compliance tasks (filings, taxes, etc.) for multiple clients, built for LedgersCFO.

## Live Links

- **App**: [https://ledgers-cfo-assignment-eta.vercel.app/](https://ledgers-cfo-assignment-eta.vercel.app/)
- **API**: [https://ledgers-cfo-assignment.onrender.com](https://ledgers-cfo-assignment.onrender.com)

---

## Features

- View list of clients and select one
- View tasks for the selected client
- Add new tasks
- Update task status (Pending → In Progress → Completed / Cancelled)
- Filter tasks by status and priority
- Summary stats (pending, completed, in progress, cancelled counts)
- Overdue task highlighting

---

## Tech Stack

- **Frontend**: React, TypeScript, Vite, TanStack Query, Tailwind CSS, shadcn/ui
- **Backend**: Express, Bun, Prisma, PostgreSQL
- **Validation**: Zod

---

## Setup

### Prerequisites

- [Bun](https://bun.sh) (v1.2+)
- [Node.js](https://nodejs.org) (v18+)
- PostgreSQL database (or use [Neon](https://neon.tech) / similar for a hosted DB)

### Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Create a `.env` file with:
   ```
   DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require
   ```

4. Run Prisma migrations:
   ```bash
   bunx prisma migrate deploy
   ```

5. (Optional) Seed the database with sample clients and tasks:
   ```bash
   bun run seed
   ```

6. Start the server:
   ```bash
   bun run dev
   ```

   The API runs at `http://localhost:3000`.

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with:
   ```
   VITE_API_URL=http://localhost:3000
   ```

   For production, set this to your deployed backend URL (e.g. `https://ledgers-cfo-assignment.onrender.com`).

4. Start the dev server:
   ```bash
   npm run dev
   ```

   The app runs at `http://localhost:5173`.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/clients` | Get all clients |
| GET | `/api/v1/tasks/:clientId` | Get tasks for a client |
| POST | `/api/v1/tasks/:clientId` | Create a task |
| PUT | `/api/v1/tasks/:clientId/:taskId/status` | Update task status |

---

## Project Structure

```
ledgers-cfo/
├── backend/          # Express API, Prisma, PostgreSQL
│   ├── controllers/
│   ├── services/
│   ├── routes/
│   ├── validators/
│   └── prisma/
├── frontend/         # React + Vite app
│   └── src/
│       ├── components/
│       ├── api/
│       └── types/
└── README.md
```

## Tradeoffs & Assumptions

- No auth or user management—the app is single-user and demo-oriented.
- Clients are read-only (no create/edit/delete)
- Tasks can only have their status updated. 
- Category is free text instead of an enum, and filtering is by Status and Priority rather than by Category for more predictable filters. 
- New tasks cannot have past due dates. 
- CORS is fully open, and errors may leak implementation details. 
- Scope was kept small to ship quickly 
- Client CRUD, Task edit/delete, pagination, and auth were left out for this version.