from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.schemas.transaction import TransactionCreate, TransactionUpdate, TransactionOut
from app.services import transaction_service

router = APIRouter(prefix="/transactions", tags=["transactions"])


@router.get("", response_model=list[TransactionOut])
def list_transactions(db: Session = Depends(get_db)):
    return transaction_service.get_all_transactions(db)


@router.post("", response_model=TransactionOut, status_code=status.HTTP_201_CREATED)
def create_transaction(payload: TransactionCreate, db: Session = Depends(get_db)):
    return transaction_service.create_transaction(db, payload)


@router.put("/{transaction_id}", response_model=TransactionOut)
def update_transaction(
    transaction_id: int,
    payload: TransactionUpdate,
    db: Session = Depends(get_db),
):
    return transaction_service.update_transaction(db, transaction_id, payload)


@router.delete("/{transaction_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_transaction(transaction_id: int, db: Session = Depends(get_db)):
    transaction_service.delete_transaction(db, transaction_id)
