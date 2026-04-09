from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, condecimal
from app.models.transaction import TransactionType
from app.schemas.category import CategoryOut


class TransactionBase(BaseModel):
    type: TransactionType
    amount: condecimal(gt=0, decimal_places=2)  # type: ignore[valid-type]
    category_id: int
    description: Optional[str] = None
    date: date


class TransactionCreate(TransactionBase):
    pass


class TransactionUpdate(BaseModel):
    type: Optional[TransactionType] = None
    amount: Optional[condecimal(gt=0, decimal_places=2)] = None  # type: ignore[valid-type]
    category_id: Optional[int] = None
    description: Optional[str] = None
    date: Optional[date] = None


class TransactionOut(TransactionBase):
    id: int
    created_at: datetime
    category: CategoryOut

    model_config = {"from_attributes": True}
