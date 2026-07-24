import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, BigInteger, Float, Text
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    telegram_id = Column(BigInteger, unique=True, index=True, nullable=True)
    username = Column(String, unique=True, index=True)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)
    role = Column(String, default="USER") # USER, HOST, ADMIN
    gender = Column(String, default="FEMALE") # FEMALE, MALE
    wallet_stars = Column(BigInteger, default=1250)
    wallet_usdt = Column(Float, default=12.5)
    is_vip = Column(Boolean, default=True)
    vip_level = Column(Integer, default=1)
    is_blocked = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    streams = relationship("LiveStream", back_populates="host_user")
    vault_items = relationship("MediaVaultItem", back_populates="host_user")
    transactions = relationship("Transaction", back_populates="user")

class LiveStream(Base):
    __tablename__ = "live_streams"

    id = Column(Integer, primary_key=True, index=True)
    host_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String, nullable=False)
    stream_key = Column(String, unique=True, index=True)
    rtmp_url = Column(String, nullable=True)
    hls_url = Column(String, nullable=True)
    is_live = Column(Boolean, default=True)
    viewer_count = Column(Integer, default=0)
    active_ar_filter = Column(String, default="Studio Glow 💖")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    host_user = relationship("User", back_populates="streams")
    messages = relationship("ChatMessage", back_populates="stream")

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    stream_id = Column(Integer, ForeignKey("live_streams.id"))
    sender_id = Column(Integer, ForeignKey("users.id"))
    sender_username = Column(String)
    message = Column(Text, nullable=True)
    gift_type = Column(String, nullable=True) # e.g., "👑 Crown", "💖 Heart"
    stars_spent = Column(BigInteger, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    stream = relationship("LiveStream", back_populates="messages")

class MediaVaultItem(Base):
    __tablename__ = "media_vault"

    id = Column(Integer, primary_key=True, index=True)
    host_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String, nullable=False)
    media_url = Column(String, nullable=False)
    unlock_cost_stars = Column(BigInteger, default=150)
    is_video = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    host_user = relationship("User", back_populates="vault_items")

class VaultUnlock(Base):
    __tablename__ = "vault_unlocks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    vault_item_id = Column(Integer, ForeignKey("media_vault.id"))
    unlocked_at = Column(DateTime, default=datetime.datetime.utcnow)

class BookingSlot(Base):
    __tablename__ = "booking_slots"

    id = Column(Integer, primary_key=True, index=True)
    host_id = Column(Integer, ForeignKey("users.id"))
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    booking_date = Column(String, nullable=False) # "2026-07-25"
    time_slot = Column(String, nullable=False) # "22:00 - 22:30"
    status = Column(String, default="CONFIRMED") # PENDING, CONFIRMED, COMPLETED, CANCELLED
    cost_stars = Column(BigInteger, default=500)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    amount_stars = Column(BigInteger, default=0)
    amount_usdt = Column(Float, default=0.0)
    tx_type = Column(String) # DEPOSIT_STARS, DEPOSIT_USDT, GIFT_SENT, VAULT_UNLOCK, CALL_BOOKING, WITHDRAWAL
    payment_method = Column(String) # TELEGRAM_STARS, USDT_TRC20, TON
    tx_hash = Column(String, nullable=True)
    status = Column(String, default="COMPLETED") # PENDING, COMPLETED, FAILED
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="transactions")

class Follow(Base):
    __tablename__ = "follows"

    id = Column(Integer, primary_key=True, index=True)
    follower_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    followed_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Like(Base):
    __tablename__ = "likes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    target_type = Column(String, nullable=False)  # STREAM, VAULT_ITEM, HOST_PROFILE
    target_id = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    notification_type = Column(String, default="SYSTEM")  # SYSTEM, GIFT, LIVE_START, BOOKING
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    reporter_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    reported_user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    reason = Column(Text, nullable=False)
    status = Column(String, default="PENDING")  # PENDING, INVESTIGATING, RESOLVED, DISMISSED
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Block(Base):
    __tablename__ = "blocks"

    id = Column(Integer, primary_key=True, index=True)
    blocker_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    blocked_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class UserVerification(Base):
    __tablename__ = "user_verifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    document_type = Column(String, nullable=False)  # PASSPORT, NATIONAL_ID, SELFIE
    document_url = Column(String, nullable=False)
    status = Column(String, default="PENDING")  # PENDING, APPROVED, REJECTED
    notes = Column(Text, nullable=True)
    verified_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class DeviceSession(Base):
    __tablename__ = "device_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    device_info = Column(String, nullable=True)
    ip_address = Column(String, nullable=True)
    user_agent = Column(String, nullable=True)
    last_active = Column(DateTime, default=datetime.datetime.utcnow)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class RefreshToken(Base):
    __tablename__ = "refresh_tokens"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    token = Column(String, unique=True, index=True, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    is_revoked = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class UserSettings(Base):
    __tablename__ = "user_settings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    notifications_enabled = Column(Boolean, default=True)
    dark_mode = Column(Boolean, default=True)
    language = Column(String, default="fa")
    privacy_profile = Column(String, default="PUBLIC")  # PUBLIC, FRIENDS_ONLY, PRIVATE
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

