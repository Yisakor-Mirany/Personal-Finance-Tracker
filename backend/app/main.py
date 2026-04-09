from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.db import engine
from app.models import Category, Transaction  # noqa: F401 – registers models with Base
from app.database.db import Base
from app.routes import transactions, summary, categories

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Personal Finance Tracker API",
    description="Track income, expenses, and spending patterns.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(transactions.router)
app.include_router(summary.router)
app.include_router(categories.router)


@app.get("/health", tags=["health"])
def health_check():
    return {"status": "ok"}
