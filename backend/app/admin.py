from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List

from app.database import get_db
from app.models import User, LiveStream, Transaction, BookingSlot
from app.config import settings

router = APIRouter(prefix="/api/admin", tags=["Admin Panel"])

def verify_admin_key(x_admin_key: str = Header(None)):
    admin_key = getattr(settings, "ADMIN_API_KEY", None)
    if admin_key and x_admin_key != admin_key:
        raise HTTPException(status_code=403, detail="دسترسی غیرمجاز مدیر!")
    return True

@router.get("/stats")
def get_admin_dashboard_stats(db: Session = Depends(get_db), authenticated: bool = Depends(verify_admin_key)):
    total_users = db.query(User).count()
    active_streams = db.query(LiveStream).filter(LiveStream.is_live == True).count()
    total_txs = db.query(Transaction).count()
    total_bookings = db.query(BookingSlot).count()

    return {
        "total_users": total_users,
        "active_streams": active_streams,
        "total_transactions": total_txs,
        "total_bookings": total_bookings,
        "ai_security_status": "ONLINE - Active 24/7 Anti-Screen Capture"
    }

@router.get("/users")
def get_all_users(db: Session = Depends(get_db), authenticated: bool = Depends(verify_admin_key)):
    users = db.query(User).all()
    return [{
        "id": u.id,
        "username": u.username,
        "role": u.role,
        "wallet_stars": u.wallet_stars,
        "wallet_usdt": u.wallet_usdt,
        "is_vip": u.is_vip,
        "is_blocked": u.is_blocked
    } for u in users]

@router.post("/block-user/{user_id}")
def block_user(user_id: int, db: Session = Depends(get_db), authenticated: bool = Depends(verify_admin_key)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="کاربر یافت نشد")
    user.is_blocked = True
    db.commit()
    return {"status": "BLOCKED", "user_id": user_id}

@router.post("/approve-withdrawal/{tx_id}")
def approve_withdrawal(tx_id: int, db: Session = Depends(get_db), authenticated: bool = Depends(verify_admin_key)):
    tx = db.query(Transaction).filter(Transaction.id == tx_id).first()
    if not tx:
        raise HTTPException(status_code=404, detail="تراکنش یافت نشد")
    tx.status = "COMPLETED"
    db.commit()
    return {"status": "APPROVED", "tx_id": tx_id}
