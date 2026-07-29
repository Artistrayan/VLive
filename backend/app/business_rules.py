"""
V.Live+ Business & Platform Rules Engine (20 Centralized Rules)
All rules, limits, commissions, and exemptions are configured here.
"""

from datetime import datetime, date
from typing import Dict, Any, Optional

class BusinessRules:
    # 1. AGE RULE
    MIN_REQUIRED_AGE: int = 18
    AGE_ERROR_MESSAGE: str = "V.Live is available only for users aged 18 and older."

    # 3. MATCHING RULES
    DAILY_FREE_MATCHES: int = 3
    PAID_MATCH_COST_PER_MIN: int = 20  # Coins
    INITIAL_FREE_MATCH_SECONDS: int = 30

    # 4 & 5. CALL & WALLET RULES
    STREAMER_CALL_FREE_SECONDS: int = 20
    MIN_CALL_WALLET_BALANCE: int = 20  # Minimum coins to initiate call
    INSUFFICIENT_BALANCE_MSG: str = "Call Ended - Insufficient Balance"

    # 14. WITHDRAWAL RULE
    MIN_WITHDRAWAL_USDT: float = 20.0

    # 15. GIFT COMMISSION RULE
    GIFT_STREAMER_DIAMOND_PERCENT: float = 80.0  # 80% converted to diamonds for streamer

    # 16 & 17. TIMEOUT RULES
    CALL_RECONNECT_GRACE_SECONDS: int = 30
    LIVE_INACTIVITY_TIMEOUT_MINUTES: int = 5

    # 18. SUPER ADMIN ID
    SUPER_ADMIN_TELEGRAM_ID: int = 8973478139

    @classmethod
    def calculate_age(cls, birth_date: date) -> int:
        today = date.today()
        return today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))

    @classmethod
    def is_admin_exempt(cls, role: Optional[str], telegram_id: Optional[int]) -> bool:
        """Check if user is admin/super_admin or Rayan (Telegram ID 8973478139) to bypass all rules."""
        if role in ["super_admin", "admin"]:
            return True
        if telegram_id and telegram_id == cls.SUPER_ADMIN_TELEGRAM_ID:
            return True
        return False

    @classmethod
    def validate_user_age(cls, birth_date: date, role: Optional[str] = None, telegram_id: Optional[int] = None) -> bool:
        if cls.is_admin_exempt(role, telegram_id):
            return True
        age = cls.calculate_age(birth_date)
        return age >= cls.MIN_REQUIRED_AGE

    @classmethod
    def can_start_free_match(cls, today_match_count: int, is_vip: bool = False, role: Optional[str] = None, telegram_id: Optional[int] = None) -> bool:
        if cls.is_admin_exempt(role, telegram_id) or is_vip:
            return True
        return today_match_count < cls.DAILY_FREE_MATCHES

    @classmethod
    def can_start_call(cls, wallet_coins: int, call_price_per_min: int, role: Optional[str] = None, telegram_id: Optional[int] = None) -> bool:
        if cls.is_admin_exempt(role, telegram_id):
            return True
        return wallet_coins >= max(cls.MIN_CALL_WALLET_BALANCE, call_price_per_min)

    @classmethod
    def can_go_live(cls, role: Optional[str], streamer_status: Optional[str], telegram_id: Optional[int] = None) -> bool:
        if cls.is_admin_exempt(role, telegram_id):
            return True
        return role == "streamer" or streamer_status == "APPROVED"

    @classmethod
    def validate_withdrawal(cls, amount_usdt: float, role: Optional[str] = None, telegram_id: Optional[int] = None) -> bool:
        if cls.is_admin_exempt(role, telegram_id):
            return True
        return amount_usdt >= cls.MIN_WITHDRAWAL_USDT

    @classmethod
    def get_platform_rules_summary(cls) -> Dict[str, Any]:
        return {
            "min_age": cls.MIN_REQUIRED_AGE,
            "daily_free_matches": cls.DAILY_FREE_MATCHES,
            "paid_match_cost_per_min": cls.PAID_MATCH_COST_PER_MIN,
            "min_withdrawal_usdt": cls.MIN_WITHDRAWAL_USDT,
            "call_reconnect_grace_seconds": cls.CALL_RECONNECT_GRACE_SECONDS,
            "live_timeout_minutes": cls.LIVE_INACTIVITY_TIMEOUT_MINUTES,
            "admin_exemptions": True,
            "version": "1.0 Enterprise Production Ready"
        }
