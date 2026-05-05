import secrets
import bcrypt


def hash_password(plain: str) -> bytes:
    return bcrypt.hashpw(plain.encode(), bcrypt.gensalt())


def verify_password(plain: str, hashed: bytes) -> bool:
    return bcrypt.checkpw(plain.encode(), hashed)


def generate_token() -> str:
    return secrets.token_urlsafe(32)
