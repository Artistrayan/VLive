from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional

from app.database import get_db
from app.models import User, BookingSlot, Transaction
from app.auth import get_current_user

router = APIRouter(prefix="/api/booking", tags=["Private Call Booking Calendar"])

class BookingCreateRequest(BaseModel):
    host_username: str
    booking_date: str # "2026-07-25"
    time_slot: str # "22:00 - 22:30"
    cost_stars: int = 500

class BookingResponse(BaseModel):
    id: int
    host_username: str
    booking_date: str
    time_slot: str
    status: str
    cost_stars: int

@router.get("/my-bookings", response_model=List[BookingResponse])
def get_my_bookings(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    bookings = db.query(BookingSlot).filter(
        (BookingSlot.user_id == current_user.id) | (BookingSlot.host_id == current_user.id)
    ).all()

    if not bookings and current_user.username == "demo_user":
        # Seed initial sample booking
        host = db.query(User).filter(User.username == "Sogand_Live").first()
        b = BookingSlot(
            host_id=host.id if host else 1,
            user_id=current_user.id,
            booking_date="2026-07-25",
            time_slot="22:00 - 22:30",
            status="CONFIRMED ✅",
            cost_stars=500
        )
        db.add(b)
        db.commit()
        bookings = [b]

    res = []
    for b in bookings:
        host = db.query(User).filter(User.id == b.host_id).first()
        res.append({
            "id": b.id,
            "host_username": host.username if host else "Sogand_Live",
            "booking_date": b.booking_date,
            "time_slot": b.time_slot,
            "status": b.status,
            "cost_stars": b.cost_stars
        })
    return res

@router.post("/book", response_model=BookingResponse)
def book_private_call_slot(
    payload: BookingCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.wallet_stars < payload.cost_stars:
        raise HTTPException(status_code=400, detail="موجودی سکه کافی نیست!")

    host = db.query(User).filter(User.username == payload.host_username).first()
    if not host:
        host = User(username=payload.host_username, role="HOST", gender="FEMALE")
        db.add(host)
        db.commit()
        db.refresh(host)

    current_user.wallet_stars -= payload.cost_stars
    booking = BookingSlot(
        host_id=host.id,
        user_id=current_user.id,
        booking_date=payload.booking_date,
        time_slot=payload.time_slot,
        status="CONFIRMED ✅",
        cost_stars=payload.cost_stars
    )
    tx = Transaction(user_id=current_user.id, amount_stars=payload.cost_stars, tx_type="CALL_BOOKING")

    db.add(booking)
    db.add(tx)
    db.commit()
    db.refresh(booking)

    return {
        "id": booking.id,
        "host_username": host.username,
        "booking_date": booking.booking_date,
        "time_slot": booking.time_slot,
        "status": booking.status,
        "cost_stars": booking.cost_stars
    }
