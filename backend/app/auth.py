import hmac
import hashlib
import json
from urllib.parse import parse_qsl
from datetime import datetime, timedelta
from fastapi import Depends, HTTPException, status, Header
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)

def verify_telegram_init_data(init_data_raw: str, bot_token: str) -> dict:
    """
    Verifies Telegram WebApp initData HMAC-SHA256 signature.
    """
    if not bot_token:
        return None
    try:
        parsed_data = dict(parse_qsl(init_data_raw, keep_blank_values=True))
        if "hash" not in parsed_data:
            return None
        
        received_hash = parsed_data.pop("hash")
        data_check_string = "\n".join(f"{k}={v}" for k, v in sorted(parsed_data.items()))

        secret_key = hmac.new(b"WebAppData", bot_token.encode(), hashlib.sha256).digest()
        calculated_hash = hmac.new(secret_key, data_check_string.encode(), hashlib.sha256).hexdigest()

        if hmac.compare_digest(calculated_hash, received_hash):
            user_json = parsed_data.get("user")
            if user_json:
                return json.loads(user_json)
        return None
    except Exception:
        return None

def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    secret = settings.JWT_SECRET_KEY or "unconfigured_jwt_secret_key"
    return jwt.encode(to_encode, secret, algorithm=settings.JWT_ALGORITHM)

def get_current_user(
    token: str = Depends(oauth2_scheme),
    x_telegram_init_data: str = Header(None),
    db: Session = Depends(get_db)
) -> User:
    # 1. First check Telegram initData header
    if x_telegram_init_data and settings.TELEGRAM_BOT_TOKEN:
        tg_user_data = verify_telegram_init_data(x_telegram_init_data, settings.TELEGRAM_BOT_TOKEN)
        if tg_user_data:
            telegram_id = tg_user_data.get("id")
            username = tg_user_data.get("username") or f"user_{telegram_id}"
            user = db.query(User).filter(User.telegram_id == telegram_id).first()
            if not user:
                user = User(
                    telegram_id=telegram_id,
                    username=username,
                    first_name=tg_user_data.get("first_name"),
                    last_name=tg_user_data.get("last_name"),
                    avatar_url=f"https://api.dicebear.com/7.x/avataaars/svg?seed={username}"
                )
                db.add(user)
                db.commit()
                db.refresh(user)
            return user

    # 2. Fallback to JWT Token
    if token:
        try:
            secret = settings.JWT_SECRET_KEY or "unconfigured_jwt_secret_key"
            payload = jwt.decode(token, secret, algorithms=[settings.JWT_ALGORITHM])
            user_id: int = payload.get("sub")
            if user_id:
                user = db.query(User).filter(User.id == int(user_id)).first()
                if user:
                    return user
        except JWTError:
            pass

    # 3. Authentication Failed
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Unauthorized",
        headers={"WWW-Authenticate": "Bearer"},
    )
