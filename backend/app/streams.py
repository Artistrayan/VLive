from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
import uuid

from app.database import get_db
from app.models import User, LiveStream, MediaVaultItem, VaultUnlock, Transaction
from app.auth import get_current_user

router = APIRouter(prefix="/api/streams", tags=["Live Streams & Media Vault"])

class StreamCreate(BaseModel):
    title: str

class StreamResponse(BaseModel):
    id: int
    host_username: str
    host_avatar: str
    title: str
    stream_key: str
    is_live: bool
    viewer_count: int
    active_ar_filter: str

class VaultItemResponse(BaseModel):
    id: int
    host_username: str
    title: str
    unlock_cost_stars: int
    is_video: bool
    is_unlocked: bool

class VaultCreate(BaseModel):
    title: str
    unlock_cost_stars: int
    is_video: bool = False

@router.get("/active", response_model=List[StreamResponse])
def get_active_streams(db: Session = Depends(get_db)):
    streams = db.query(LiveStream).filter(LiveStream.is_live == True).all()
    if not streams:
        # Seed initial active demo streams if database is fresh
        seed_users = [
            ("Sogand_Live", "https://api.dicebear.com/7.x/avataaars/svg?seed=Sogand", "استودیو چت VIP و اجرای نئونی 4K"),
            ("Elena_Stream", "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena", "گفتگوی خصوصی و پاسخ به سوالات حامیان"),
            ("Sara_Vip", "https://api.dicebear.com/7.x/avataaars/svg?seed=Sara", "لایو موسیقی و رقص نور نئونی 💃")
        ]
        for username, avatar, title in seed_users:
            u = db.query(User).filter(User.username == username).first()
            if not u:
                u = User(username=username, avatar_url=avatar, role="HOST", gender="FEMALE")
                db.add(u)
                db.commit()
                db.refresh(u)
            
            s = LiveStream(host_id=u.id, title=title, stream_key=f"live_{uuid.uuid4().hex[:8]}", viewer_count=1420)
            db.add(s)
        db.commit()
        streams = db.query(LiveStream).filter(LiveStream.is_live == True).all()

    result = []
    for s in streams:
        host = db.query(User).filter(User.id == s.host_id).first()
        result.append({
            "id": s.id,
            "host_username": host.username if host else "Host",
            "host_avatar": host.avatar_url if host else "",
            "title": s.title,
            "stream_key": s.stream_key,
            "is_live": s.is_live,
            "viewer_count": s.viewer_count,
            "active_ar_filter": s.active_ar_filter
        })
    return result

@router.post("/start", response_model=StreamResponse)
def start_stream(
    payload: StreamCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    stream_key = f"live_{uuid.uuid4().hex[:10]}"
    stream = LiveStream(
        host_id=current_user.id,
        title=payload.title,
        stream_key=stream_key,
        is_live=True,
        viewer_count=1
    )
    db.add(stream)
    db.commit()
    db.refresh(stream)

    return {
        "id": stream.id,
        "host_username": current_user.username,
        "host_avatar": current_user.avatar_url or "",
        "title": stream.title,
        "stream_key": stream.stream_key,
        "is_live": True,
        "viewer_count": 1,
        "active_ar_filter": stream.active_ar_filter
    }

@router.post("/{stream_id}/stop")
def stop_stream(stream_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    stream = db.query(LiveStream).filter(LiveStream.id == stream_id, LiveStream.host_id == current_user.id).first()
    if not stream:
        raise HTTPException(status_code=44, detail="استریم یافت نشد!")
    stream.is_live = False
    db.commit()
    return {"status": "STOPPED"}

# Media Vault Endpoints
@router.get("/vault", response_model=List[VaultItemResponse])
def get_vault_items(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    items = db.query(MediaVaultItem).all()
    if not items:
        # Seed initial vault item
        host = db.query(User).filter(User.username == "Sogand_Live").first()
        if host:
            v = MediaVaultItem(host_id=host.id, title="آلبوم اختصاصی ۴K نئونی استودیو", unlock_cost_stars=150)
            db.add(v)
            db.commit()
            items = db.query(MediaVaultItem).all()

    unlocked_ids = set(u.vault_item_id for u in db.query(VaultUnlock).filter(VaultUnlock.user_id == current_user.id).all())

    res = []
    for item in items:
        host = db.query(User).filter(User.id == item.host_id).first()
        res.append({
            "id": item.id,
            "host_username": host.username if host else "Host",
            "title": item.title,
            "unlock_cost_stars": item.unlock_cost_stars,
            "is_video": item.is_video,
            "is_unlocked": (item.id in unlocked_ids) or (item.host_id == current_user.id)
        })
    return res

@router.post("/vault/unlock/{item_id}")
def unlock_vault_item(item_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    item = db.query(MediaVaultItem).filter(MediaVaultItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="آیتم یافت نشد")

    existing = db.query(VaultUnlock).filter(VaultUnlock.user_id == current_user.id, VaultUnlock.vault_item_id == item_id).first()
    if existing:
        return {"status": "ALREADY_UNLOCKED"}

    if current_user.wallet_stars < item.unlock_cost_stars:
        raise HTTPException(status_code=400, detail="موجودی سکه کافی نیست!")

    current_user.wallet_stars -= item.unlock_cost_stars
    unlock = VaultUnlock(user_id=current_user.id, vault_item_id=item_id)
    tx = Transaction(user_id=current_user.id, amount_stars=item.unlock_cost_stars, tx_type="VAULT_UNLOCK")

    db.add(unlock)
    db.add(tx)
    db.commit()

    return {"status": "UNLOCKED", "remaining_stars": current_user.wallet_stars}

@router.post("/vault/publish", response_model=VaultItemResponse)
def publish_vault_item(payload: VaultCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    item = MediaVaultItem(
        host_id=current_user.id,
        title=payload.title,
        media_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
        unlock_cost_stars=payload.unlock_cost_stars,
        is_video=payload.is_video
    )
    db.add(item)
    db.commit()
    db.refresh(item)

    return {
        "id": item.id,
        "host_username": current_user.username,
        "title": item.title,
        "unlock_cost_stars": item.unlock_cost_stars,
        "is_video": item.is_video,
        "is_unlocked": True
    }
