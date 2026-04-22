# poc-vite-crud

A simple, production-quality POC web application for managing **Comps** (comparable sales) records.

- **Frontend**: Vite + React (JavaScript)
- **Backend**: Node.js + Express REST API
- **Database**: PostgreSQL

## Features

- View all records in a sortable, filterable table
- Add / Edit / Delete records via a clean modal form
- Filter by Address, City, County, State, Zip Code, Sale Date range, Sale Price range
- Sort by any column
- Export filtered dataset as CSV

---

## Project Structure

```
poc-vite-crud/
├── backend/          # Node.js + Express API
│   ├── src/
│   │   ├── db/       # PostgreSQL connection pool
│   │   ├── routes/   # REST route handlers
│   │   └── app.js    # Express app
│   ├── server.js     # Entry point
│   └── .env.example  # Environment variable template
├── frontend/         # Vite + React UI
│   ├── src/
│   │   ├── api/      # API client functions
│   │   ├── components/
│   │   ├── App.jsx
│   │   └── App.css
│   └── vite.config.js
└── db/
    └── schema.sql    # PostgreSQL schema
```

---

## Prerequisites

- Node.js 18+
- PostgreSQL 14+

---

## Database Setup

1. Create a PostgreSQL database:

```sql
CREATE DATABASE poc_vite_crud;
```

2. Run the schema script:

```bash
psql -U postgres -d poc_vite_crud -f db/schema.sql
```

---

## Backend Setup

1. Install dependencies:

```bash
cd backend
npm install
```

2. Copy the environment template and fill in your values:

```bash
cp .env.example .env
```

3. Edit `.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=poc_vite_crud
DB_USER=postgres
DB_PASSWORD=yourpassword
PORT=3001
```

4. Start the backend:

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The API will be available at `http://localhost:3001`.

---

## Frontend Setup

1. Install dependencies:

```bash
cd frontend
npm install
```

2. Start the dev server:

```bash
npm run dev
```

The UI will be available at `http://localhost:5173`. The Vite dev server proxies API calls to `http://localhost:3001` automatically.

---

## Environment Variables

| Variable      | Default         | Description                   |
|---------------|-----------------|-------------------------------|
| `DB_HOST`     | `localhost`     | PostgreSQL host               |
| `DB_PORT`     | `5432`          | PostgreSQL port               |
| `DB_NAME`     | `poc_vite_crud` | Database name                 |
| `DB_USER`     | `postgres`      | Database user                 |
| `DB_PASSWORD` | *(empty)*       | Database password             |
| `PORT`        | `3001`          | Backend HTTP port             |

---

## API Reference

| Method | Endpoint      | Description                |
|--------|---------------|----------------------------|
| GET    | `/comps`      | List all comps (filterable)|
| POST   | `/comps`      | Create a new comp          |
| PUT    | `/comps/:id`  | Update an existing comp    |
| DELETE | `/comps/:id`  | Delete a comp              |
| GET    | `/health`     | Health check               |

### GET /comps — Query Parameters

| Parameter      | Description                        |
|----------------|------------------------------------|
| `address`      | Partial match on Address           |
| `city`         | Partial match on CityMunicipality  |
| `county`       | Partial match on County            |
| `state`        | Partial match on State             |
| `zipCode`      | Partial match on ZipCode           |
| `saleDateFrom` | Sale date ≥ this value (YYYY-MM-DD)|
| `saleDateTo`   | Sale date ≤ this value (YYYY-MM-DD)|
| `salePriceMin` | Sale price ≥ this value            |
| `salePriceMax` | Sale price ≤ this value            |
| `sortBy`       | Column name to sort by             |
| `sortDir`      | `asc` (default) or `desc`         |
