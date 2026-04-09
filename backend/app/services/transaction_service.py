from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.transaction import Transaction
from app.models.category import Category
from app.schemas.transaction import TransactionCreate, TransactionUpdate


def get_all_transactions(db: Session) -> list[Transaction]:
    return (
        db.query(Transaction)
        .join(Category)
        .order_by(Transaction.date.desc(), Transaction.created_at.desc())
        .all()
    )


def get_transaction_by_id(db: Session, transaction_id: int) -> Transaction:
    tx = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    if not tx:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Transaction {transaction_id} not found",
        )
    return tx


def create_transaction(db: Session, payload: TransactionCreate) -> Transaction:
    _validate_category(db, payload.category_id)
    tx = Transaction(**payload.model_dump())
    db.add(tx)
    db.commit()
    db.refresh(tx)
    return tx


def update_transaction(
    db: Session, transaction_id: int, payload: TransactionUpdate
) -> Transaction:
    tx = get_transaction_by_id(db, transaction_id)
    updates = payload.model_dump(exclude_unset=True)
    if "category_id" in updates:
        _validate_category(db, updates["category_id"])
    for field, value in updates.items():
        setattr(tx, field, value)
    db.commit()
    db.refresh(tx)
    return tx


def delete_transaction(db: Session, transaction_id: int) -> None:
    tx = get_transaction_by_id(db, transaction_id)
    db.delete(tx)
    db.commit()


def _validate_category(db: Session, category_id: int) -> None:
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Category {category_id} does not exist",
        )
