from decimal import Decimal
from datetime import date
from sqlalchemy.orm import Session
from sqlalchemy import extract, func
from app.models.transaction import Transaction, TransactionType
from app.models.category import Category


def get_summary(db: Session) -> dict:
    all_transactions = db.query(Transaction).all()

    total_income = sum(
        t.amount for t in all_transactions if t.type == TransactionType.income
    )
    total_expenses = sum(
        t.amount for t in all_transactions if t.type == TransactionType.expense
    )
    balance = total_income - total_expenses

    today = date.today()
    monthly_expenses_by_category = (
        db.query(Category.name, func.sum(Transaction.amount).label("total"))
        .join(Transaction, Transaction.category_id == Category.id)
        .filter(
            Transaction.type == TransactionType.expense,
            extract("year", Transaction.date) == today.year,
            extract("month", Transaction.date) == today.month,
        )
        .group_by(Category.name)
        .all()
    )

    monthly_summary = _get_monthly_summary(db)

    return {
        "balance": float(balance),
        "total_income": float(total_income),
        "total_expenses": float(total_expenses),
        "expenses_by_category": [
            {"category": name, "total": float(total)}
            for name, total in monthly_expenses_by_category
        ],
        "monthly_summary": monthly_summary,
    }


def _get_monthly_summary(db: Session) -> list[dict]:
    rows = (
        db.query(
            extract("year", Transaction.date).label("year"),
            extract("month", Transaction.date).label("month"),
            Transaction.type,
            func.sum(Transaction.amount).label("total"),
        )
        .group_by("year", "month", Transaction.type)
        .order_by("year", "month")
        .all()
    )

    months: dict[tuple, dict] = {}
    for row in rows:
        key = (int(row.year), int(row.month))
        if key not in months:
            month_label = date(int(row.year), int(row.month), 1).strftime("%b %Y")
            months[key] = {"month": month_label, "income": 0.0, "expenses": 0.0}
        if row.type == TransactionType.income:
            months[key]["income"] = float(row.total)
        else:
            months[key]["expenses"] = float(row.total)

    return list(months.values())
