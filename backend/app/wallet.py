from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional

from app.database import get_db
from app.models import User, Transaction
from app.auth import get_current_user

router = APIRouter(prefix="/api/wallet", tags=["Wallet & Payments"])

class DepositStarsRequest(BaseModel):
    stars_amount: int
    telegram_charge_id: Optional[str] = None

class DepositCryptoRequest(BaseModel):
    usdt_amount: float
    network: str = "TRC20" # TRC20, TON
    tx_hash: Optional[str] = None

class WithdrawalRequest(BaseModel):
    usdt_amount: float
    wallet_address: str

@router.get("/balance")
def get_wallet_balance(current_user: User = Depends(get_current_user)):
    return {
        "wallet_stars": current_user.wallet_stars,
        "wallet_usdt": current_user.wallet_usdt,
        "estimated_usdt_value": current_user.wallet_stars / 100.0 + current_user.wallet_usdt
    }

@router.post("/deposit/stars")
def deposit_stars(payload: DepositStarsRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if payload.stars_amount <= 0:
        raise HTTPException(status_code=400, detail="Invalid stars amount!")
    if not payload.telegram_charge_id:
        raise HTTPException(status_code=400, detail="Missing payment verification charge ID!")
    
    # Deposits require official payment gateway verification
    tx = Transaction(
        user_id=current_user.id,
        amount_stars=payload.stars_amount,
        tx_type="DEPOSIT_STARS",
        payment_method="TELEGRAM_STARS",
        status="PENDING_VERIFICATION"
    )
    db.add(tx)
    db.commit()
    return {"status": "PENDING_VERIFICATION", "message": "Deposit recorded. Awaiting payment gateway confirmation."}

@router.post("/deposit/crypto")
def deposit_crypto(payload: DepositCryptoRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if payload.usdt_amount <= 0:
        raise HTTPException(status_code=400, detail="Invalid USDT amount!")
    if not payload.tx_hash:
        raise HTTPException(status_code=400, detail="Missing blockchain transaction hash!")

    converted_stars = int(payload.usdt_amount * 100)
    tx = Transaction(
        user_id=current_user.id,
        amount_stars=converted_stars,
        amount_usdt=payload.usdt_amount,
        tx_type="DEPOSIT_USDT",
        payment_method=payload.network,
        tx_hash=payload.tx_hash,
        status="PENDING_VERIFICATION"
    )
    db.add(tx)
    db.commit()
    return {"status": "PENDING_VERIFICATION", "message": "Crypto deposit submitted for blockchain verification."}

@router.post("/withdraw")
def withdraw_funds(payload: WithdrawalRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if payload.usdt_amount <= 0:
        raise HTTPException(status_code=400, detail="Withdrawal amount must be positive!")
    if payload.usdt_amount < 50.0:
        raise HTTPException(status_code=400, detail="Minimum withdrawal amount is $50 USDT!")
    if not payload.wallet_address or len(payload.wallet_address.strip()) < 10:
        raise HTTPException(status_code=400, detail="Invalid wallet destination address!")

    # Lock user row FOR UPDATE to prevent race conditions
    user_db = db.query(User).filter(User.id == current_user.id).with_for_update().first()
    if not user_db or user_db.wallet_usdt < payload.usdt_amount:
        raise HTTPException(status_code=400, detail="Insufficient USDT balance!")

    user_db.wallet_usdt -= payload.usdt_amount
    tx = Transaction(
        user_id=current_user.id,
        amount_usdt=payload.usdt_amount,
        tx_type="WITHDRAWAL",
        payment_method="TRC20",
        tx_hash=payload.wallet_address,
        status="PENDING"
    )
    db.add(tx)
    db.commit()
    return {"status": "PENDING_APPROVAL", "message": "Withdrawal request submitted for admin review."}
