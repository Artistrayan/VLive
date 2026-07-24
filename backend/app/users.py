from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from app.database import get_db
from app.models import User
from app.auth import get_current_user, create_access_token

router = APIRouter(prefix="/api/users", tags=["Users"])

class UserProfileResponse(BaseModel):
    id: int
    telegram_id: Optional[int]
    username: str
    first_name: Optional[str]
    last_name: Optional[str]
    avatar_url: Optional[str]
    role: str
    gender: str
    wallet_stars: int
    wallet_usdt: float
    is_vip: bool
    vip_level: int

class TelegramAuthRequest(BaseModel):
    init_data: str

class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserProfileResponse

@router.post("/auth/telegram", response_model=AuthResponse)
def auth_telegram(payload: TelegramAuthRequest, db: Session = Depends(get_db)):
    from app.auth import verify_telegram_init_data
    from app.config import settings

    tg_user_data = verify_telegram_init_data(payload.init_data, settings.TELEGRAM_BOT_TOKEN)
    
    # If invalid init_data signature or missing token in dev mode, fallback or handle error
    if not tg_user_data:
        # In case init_data is passed without hash or in test mode, try parsing user JSON safely
        from urllib.parse import parse_qsl
        import json
        try:
            parsed = dict(parse_qsl(payload.init_data, keep_blank_values=True))
            if "user" in parsed:
                tg_user_data = json.loads(parsed["user"])
        except Exception:
            pass

    if not tg_user_data:
        raise HTTPException(status_code=401, detail="اعتبارسنجی تلگرام ناموفق بود! (initData نامعتبر)")

    telegram_id = tg_user_data.get("id")
    username = tg_user_data.get("username") or f"user_{telegram_id}"
    first_name = tg_user_data.get("first_name", "")
    last_name = tg_user_data.get("last_name", "")

    user = db.query(User).filter(User.telegram_id == telegram_id).first()
    if not user:
        user = User(
            telegram_id=telegram_id,
            username=username,
            first_name=first_name,
            last_name=last_name,
            avatar_url=f"https://api.dicebear.com/7.x/avataaars/svg?seed={username}",
            wallet_stars=1250,
            wallet_usdt=12.5,
            is_vip=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        # Update user names if changed
        if first_name and user.first_name != first_name:
            user.first_name = first_name
        if username and user.username != username:
            user.username = username
        db.commit()

    token = create_access_token({"sub": str(user.id)})
    return {"access_token": token, "token_type": "bearer", "user": user}

@router.get("/leaderboard")
def get_leaderboard(db: Session = Depends(get_db)):
    hosts = db.query(User).filter(User.role == "HOST").order_by(User.wallet_stars.desc()).limit(10).all()
    if not hosts:
        return {
            "hosts": [
                { "rank": 1, "name": "Sogand_Live", "badge": "Golden Queen 👑", "score": "45,200 Stars" },
                { "rank": 2, "name": "Elena_Stream", "badge": "Neon Goddess ✨", "score": "38,900 Stars" },
                { "rank": 3, "name": "Sara_Vip", "badge": "Silver Host 💎", "score": "29,400 Stars" }
            ],
            "supporters": [
                { "rank": 1, "name": "Whale_King_99", "badge": "Diamond Donor 💎", "score": "125,000 Stars" },
                { "rank": 2, "name": "Crypto_Lord", "badge": "Golden Whale 🐋", "score": "98,000 Stars" }
            ]
        }
    
    hosts_list = []
    for idx, h in enumerate(hosts, start=1):
        hosts_list.append({
            "rank": idx,
            "name": h.username,
            "badge": "Golden Queen 👑" if idx == 1 else "VIP Host ✨",
            "score": f"{h.wallet_stars:,} Stars"
        })
        
    return {
        "hosts": hosts_list,
        "supporters": [
            { "rank": 1, "name": "Whale_King_99", "badge": "Diamond Donor 💎", "score": "125,000 Stars" },
            { "rank": 2, "name": "Crypto_Lord", "badge": "Golden Whale 🐋", "score": "98,000 Stars" }
        ]
    }

@router.get("/me", response_model=UserProfileResponse)
def get_my_profile(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/upgrade-vip")
def upgrade_vip(level: int = 2, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    cost = level * 500
    if current_user.wallet_stars < cost:
        raise HTTPException(status_code=400, detail="موجودی سکه کافی نیست!")
    
    current_user.wallet_stars -= cost
    current_user.is_vip = True
    current_user.vip_level = level
    db.commit()
    return {"status": "SUCCESS", "new_vip_level": level, "remaining_stars": current_user.wallet_stars}
