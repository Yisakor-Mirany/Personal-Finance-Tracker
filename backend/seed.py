"""
Seed script – populates the database with default categories and sample transactions.
Run with:  python seed.py
"""

import sys
from datetime import date
from app.database.db import engine, SessionLocal
from app.database.db import Base
from app.models.category import Category
from app.models.transaction import Transaction, TransactionType

Base.metadata.create_all(bind=engine)

DEFAULT_CATEGORIES = [
    "Food",
    "Transportation",
    "Bills",
    "Entertainment",
    "Shopping",
    "Salary",
    "Other",
]

SAMPLE_TRANSACTIONS = [
    # income
    dict(type=TransactionType.income, amount=4500.00, category="Salary",
         description="Monthly salary – March", date=date(2026, 3, 1)),
    dict(type=TransactionType.income, amount=250.00, category="Other",
         description="Freelance design project", date=date(2026, 3, 15)),
    dict(type=TransactionType.income, amount=4500.00, category="Salary",
         description="Monthly salary – April", date=date(2026, 4, 1)),
    # expenses
    dict(type=TransactionType.expense, amount=850.00, category="Bills",
         description="Rent", date=date(2026, 3, 3)),
    dict(type=TransactionType.expense, amount=120.00, category="Food",
         description="Grocery run", date=date(2026, 3, 5)),
    dict(type=TransactionType.expense, amount=45.00, category="Transportation",
         description="Monthly bus pass", date=date(2026, 3, 6)),
    dict(type=TransactionType.expense, amount=200.00, category="Shopping",
         description="New sneakers", date=date(2026, 3, 10)),
    dict(type=TransactionType.expense, amount=60.00, category="Entertainment",
         description="Concert tickets", date=date(2026, 3, 18)),
    dict(type=TransactionType.expense, amount=35.00, category="Food",
         description="Restaurant dinner", date=date(2026, 3, 22)),
    dict(type=TransactionType.expense, amount=99.00, category="Bills",
         description="Internet & streaming", date=date(2026, 3, 25)),
    dict(type=TransactionType.expense, amount=850.00, category="Bills",
         description="Rent", date=date(2026, 4, 3)),
    dict(type=TransactionType.expense, amount=90.00, category="Food",
         description="Weekly groceries", date=date(2026, 4, 6)),
    dict(type=TransactionType.expense, amount=25.00, category="Transportation",
         description="Rideshare rides", date=date(2026, 4, 7)),
]


def seed():
    db = SessionLocal()
    try:
        # Skip if data already exists
        if db.query(Category).first():
            print("Database already seeded – skipping.")
            return

        # Insert categories
        cat_map: dict[str, Category] = {}
        for name in DEFAULT_CATEGORIES:
            cat = Category(name=name)
            db.add(cat)
            cat_map[name] = cat
        db.flush()  # assign IDs without committing

        # Insert transactions
        for t in SAMPLE_TRANSACTIONS:
            category_name = t.pop("category")
            tx = Transaction(category_id=cat_map[category_name].id, **t)
            db.add(tx)

        db.commit()
        print(f"Seeded {len(DEFAULT_CATEGORIES)} categories and {len(SAMPLE_TRANSACTIONS)} transactions.")
    except Exception as exc:
        db.rollback()
        print(f"Seeding failed: {exc}", file=sys.stderr)
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
