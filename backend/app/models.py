import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, BigInteger, Float, Text
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    telegram_id = Column(BigInteger, unique=True, index=True, nullable=True)
    username = Column(String, unique=True, index=True)
    password_hash = Column(String, nullable=True)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)
    role = Column(String, default="user") # user, admin, super_admin
    gender = Column(String, default="FEMALE") # FEMALE, MALE
    bio = Column(Text, nullable=True)
    city = Column(String, default="Tehran")
    birthdate = Column(String, nullable=True)
    level = Column(Integer, default=1)
    xp = Column(BigInteger, default=0)
    wallet_stars = Column(BigInteger, default=1250)
    wallet_diamonds = Column(BigInteger, default=50)
    wallet_usdt = Column(Float, default=12.5)
    is_vip = Column(Boolean, default=True)
    vip_level = Column(Integer, default=1)
    is_verified = Column(Boolean, default=False)
    is_blocked = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    streams = relationship("LiveStream", back_populates="host_user")
    vault_items = relationship("MediaVaultItem", back_populates="host_user")
    transactions = relationship("Transaction", back_populates="user")
    profile_details = relationship("ProfileDetails", back_populates="user", uselist=False)

class ProfileDetails(Base):
    __tablename__ = "profile_details"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    interests = Column(Text, default="Music, Streaming, Gaming")
    social_links = Column(Text, default='{"telegram": "@user", "instagram": "@user"}')
    privacy_settings = Column(Text, default='{"show_online": true, "allow_direct_messages": true}')
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="profile_details")

class DirectMessage(Base):
    __tablename__ = "direct_messages"

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    recipient_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    message_text = Column(Text, nullable=True)
    file_url = Column(String, nullable=True)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class LiveStream(Base):
    __tablename__ = "live_streams"

    id = Column(Integer, primary_key=True, index=True)
    host_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String, nullable=False)
    stream_key = Column(String, unique=True, index=True)
    rtmp_url = Column(String, nullable=True)
    hls_url = Column(String, nullable=True)
    is_live = Column(Boolean, default=True)
    status = Column(String, default="ACTIVE") # ACTIVE, ENDED
    viewer_count = Column(Integer, default=0)
    duration_seconds = Column(Integer, default=0)
    category = Column(String, default="Chat & Music")
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
    gift_type = Column(String, nullable=True)
    stars_spent = Column(BigInteger, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    stream = relationship("LiveStream", back_populates="messages")

class GiftRecord(Base):
    __tablename__ = "gift_records"

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    recipient_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    gift_type = Column(String, nullable=False) # Crown, Rose, Rocket, Diamond
    price_stars = Column(BigInteger, default=100)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Story(Base):
    __tablename__ = "stories"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    media_url = Column(String, nullable=False)
    media_type = Column(String, default="IMAGE") # IMAGE, VIDEO
    caption = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    expires_at = Column(DateTime, nullable=False)

class CallLog(Base):
    __tablename__ = "call_logs"

    id = Column(Integer, primary_key=True, index=True)
    caller_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    receiver_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    call_type = Column(String, default="VIDEO") # VOICE, VIDEO
    duration_seconds = Column(Integer, default=0)
    status = Column(String, default="COMPLETED") # MISSED, COMPLETED, REJECTED
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class VipSubscription(Base):
    __tablename__ = "vip_subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    plan_type = Column(String, nullable=False) # SILVER, GOLD, DIAMOND, ELITE
    start_date = Column(DateTime, default=datetime.datetime.utcnow)
    end_date = Column(DateTime, nullable=False)
    is_active = Column(Boolean, default=True)

class ReferralRecord(Base):
    __tablename__ = "referral_records"

    id = Column(Integer, primary_key=True, index=True)
    referrer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    referred_user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    referral_code = Column(String, nullable=False)
    reward_stars = Column(BigInteger, default=500)
    status = Column(String, default="CLAIMED") # PENDING, CLAIMED
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

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
    booking_date = Column(String, nullable=False)
    time_slot = Column(String, nullable=False)
    status = Column(String, default="CONFIRMED")
    cost_stars = Column(BigInteger, default=500)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    amount_stars = Column(BigInteger, default=0)
    amount_usdt = Column(Float, default=0.0)
    tx_type = Column(String) # DEPOSIT_STARS, DEPOSIT_USDT, GIFT_SENT, VAULT_UNLOCK, CALL_BOOKING, WITHDRAWAL, VIP_PURCHASE
    payment_method = Column(String) # TELEGRAM_STARS, USDT_TRC20, TON, WALLET
    tx_hash = Column(String, nullable=True)
    status = Column(String, default="COMPLETED")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="transactions")

class Follow(Base):
    __tablename__ = "follows"

    id = Column(Integer, primary_key=True, index=True)
    follower_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    followed_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    notification_type = Column(String, default="SYSTEM") # SYSTEM, GIFT, LIVE_START, BOOKING, VIP
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    reporter_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    reported_user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    reason = Column(Text, nullable=False)
    status = Column(String, default="PENDING") # PENDING, INVESTIGATING, RESOLVED, DISMISSED
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class AdminActivityLog(Base):
    __tablename__ = "admin_activity_logs"

    id = Column(Integer, primary_key=True, index=True)
    admin_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    action = Column(String, nullable=False)
    details = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class UserDailyMission(Base):
    __tablename__ = "user_daily_missions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    mission_key = Column(String, nullable=False)
    title = Column(String, nullable=False)
    reward_xp = Column(Integer, default=100)
    reward_coins = Column(Integer, default=50)
    is_completed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    action_type = Column(String, nullable=False) # LOGIN, LOGOUT, WITHDRAW, PURCHASE, PROFILE_UPDATE
    ip_address = Column(String, nullable=True)
    details = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class UserSettings(Base):
    __tablename__ = "user_settings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    notifications_enabled = Column(Boolean, default=True)
    dark_mode = Column(Boolean, default=True)
    language = Column(String, default="fa")
    privacy_profile = Column(String, default="PUBLIC")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
