# Personal Finance Tracker

A full-stack personal finance web application built with **FastAPI**, **React (Vite)**, **PostgreSQL**, and **Recharts**.

---

## Features

- **Dashboard** – total balance, income & expense cards, pie chart of expenses by category, monthly income vs. expenses bar chart
- **Transactions** – add, edit, delete; filter by type or keyword search
- **Categories** – 7 default categories (Food, Transportation, Bills, Entertainment, Shopping, Salary, Other)
- **Seed data** – pre-populated transactions for immediate exploration

---

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 18 · Vite · Tailwind CSS · Recharts |
| Backend   | FastAPI · SQLAlchemy 2 · Pydantic v2 |
| Database  | PostgreSQL 16                       |
| Runtime   | Python 3.12 · Node 20               |

---

## Project Structure

```
Personal-Finance-Tracker/
├── backend/
│   ├── app/
│   │   ├── main.py               # FastAPI app entry point
│   │   ├── database/
│   │   │   └── db.py             # Engine, session, Base, settings
│   │   ├── models/
│   │   │   ├── category.py       # Category SQLAlchemy model
│   │   │   └── transaction.py    # Transaction SQLAlchemy model
│   │   ├── schemas/
│   │   │   ├── category.py       # Pydantic schemas for categories
│   │   │   └── transaction.py    # Pydantic schemas for transactions
│   │   ├── routes/
│   │   │   ├── transactions.py   # CRUD endpoints
│   │   │   ├── summary.py        # GET /summary
│   │   │   └── categories.py     # GET /categories
│   │   └── services/
│   │       ├── transaction_service.py
│   │       └── summary_service.py
│   ├── seed.py                   # Populates default categories + sample data
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
│
├── frontend/
│   ├── index.html
│   ├── vite.config.js            # Dev proxy -> backend at :8000
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   └── src/
│       ├── main.jsx
│       ├── App.jsx               # Router setup
│       ├── index.css             # Tailwind + component classes
│       ├── api/
│       │   └── client.js         # Axios wrapper for all API calls
│       ├── components/
│       │   ├── Layout.jsx
│       │   ├── Navbar.jsx
│       │   ├── StatCard.jsx
│       │   ├── CategoryChart.jsx          # Recharts PieChart
│       │   ├── MonthlySummaryChart.jsx    # Recharts BarChart
│       │   ├── TransactionForm.jsx        # Add / Edit form
│       │   └── TransactionTable.jsx       # Filterable table
│       └── pages/
│           ├── Dashboard.jsx
│           └── Transactions.jsx
│
├── docker-compose.yml
└── README.md
```

---

## Database Schema

### `categories`
| Column | Type         | Notes          |
|--------|--------------|----------------|
| id     | INTEGER PK   | auto-increment |
| name   | VARCHAR(100) | unique         |

### `transactions`
| Column      | Type                    | Notes                  |
|-------------|-------------------------|------------------------|
| id          | INTEGER PK              | auto-increment         |
| type        | ENUM(income, expense)   |                        |
| amount      | NUMERIC(12,2)           | > 0                    |
| category_id | INTEGER FK -> categories|                        |
| description | VARCHAR(255)            | nullable               |
| date        | DATE                    |                        |
| created_at  | TIMESTAMPTZ             | server default = now() |

---

## API Endpoints

| Method | Path                   | Description              |
|--------|------------------------|--------------------------|
| GET    | /transactions          | List all transactions    |
| POST   | /transactions          | Create a transaction     |
| PUT    | /transactions/{id}     | Update a transaction     |
| DELETE | /transactions/{id}     | Delete a transaction     |
| GET    | /summary               | Aggregate stats + charts |
| GET    | /categories            | List all categories      |
| GET    | /health                | Health check             |

Interactive docs: `http://localhost:8000/docs`

---

## Quick Start (Docker - recommended)

### Prerequisites
- Docker Desktop >= 24

```bash
# 1. Clone the repo
git clone https://github.com/yisakor-mirany/personal-finance-tracker.git
cd personal-finance-tracker

# 2. Start all services (db + backend + frontend)
docker compose up --build

# 3. Open the app
#    Frontend:  http://localhost:5173
#    API docs:  http://localhost:8000/docs
```

The backend seed script runs automatically on first startup.

---

## Manual Setup (without Docker)

### 1. PostgreSQL

```sql
CREATE DATABASE finance_tracker;
```

### 2. Backend

```bash
cd backend

python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate

pip install -r requirements.txt

cp .env.example .env
# Edit .env and set DATABASE_URL

python seed.py

uvicorn app.main:app --reload --port 8000
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

---

## Environment Variables

### `backend/.env`
| Variable     | Default                                                         |
|--------------|-----------------------------------------------------------------|
| DATABASE_URL | `postgresql://postgres:password@localhost:5432/finance_tracker` |

---

## Seed Data

Running `python seed.py` inserts:

- **7 categories**: Food, Transportation, Bills, Entertainment, Shopping, Salary, Other
- **13 sample transactions** across March-April 2026

---

## Future Improvements

- [ ] JWT-based user authentication (multi-user support)
- [ ] Monthly budget limits per category with alerts
- [ ] CSV / PDF export
- [ ] Recurring transactions (weekly / monthly)
- [ ] Dark mode
- [ ] Server-side pagination for large datasets
- [ ] pytest suite for backend; Vitest + Testing Library for frontend
- [ ] Alembic migrations (replace `create_all` with versioned schema changes)
