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
    current_user.wallet_stars += payload.stars_amount
    tx = Transaction(
        user_id=current_user.id,
        amount_stars=payload.stars_amount,
        tx_type="DEPOSIT_STARS",
        payment_method="TELEGRAM_STARS",
        status="COMPLETED"
    )
    db.add(tx)
    db.commit()
    return {"status": "SUCCESS", "new_stars": current_user.wallet_stars}

@router.post("/deposit/crypto")
def deposit_crypto(payload: DepositCryptoRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    converted_stars = int(payload.usdt_amount * 100)
    current_user.wallet_stars += converted_stars
    current_user.wallet_usdt += payload.usdt_amount

    tx = Transaction(
        user_id=current_user.id,
        amount_stars=converted_stars,
        amount_usdt=payload.usdt_amount,
        tx_type="DEPOSIT_USDT",
        payment_method=payload.network,
        tx_hash=payload.tx_hash,
        status="COMPLETED"
    )
    db.add(tx)
    db.commit()
    return {"status": "SUCCESS", "added_stars": converted_stars, "new_stars": current_user.wallet_stars}

@router.post("/withdraw")
def withdraw_funds(payload: WithdrawalRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.wallet_usdt < payload.usdt_amount:
        raise HTTPException(status_code=400, detail="موجودی ارز دیجیتال کافی نیست!")

    current_user.wallet_usdt -= payload.usdt_amount
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
    return {"status": "PENDING_APPROVAL", "message": "درخواست برداشت ثبت گردید و پس از تایید ادماین واریز می‌شود."}
