from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.services import summary_service

router = APIRouter(prefix="/summary", tags=["summary"])


@router.get("")
def get_summary(db: Session = Depends(get_db)):
    return summary_service.get_summary(db)
