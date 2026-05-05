import logging

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from utils import hash_password, verify_password, generate_token
from models import Credentials, TokenResponse, MessageResponse

logger = logging.getLogger(__name__)

# ── In-memory stores ──────────────────────────────────────────────────────────
users: dict[str, bytes] = {}   # username → hashed password
tokens: dict[str, str] = {}    # token    → username

security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> str:
    username = tokens.get(credentials.credentials)
    if not username:
        logger.warning("Invalid token used")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )
    return username


def register_user(creds: Credentials) -> MessageResponse:
    if creds.username in users:
        logger.warning("Register attempt for existing user: %s", creds.username)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken",
        )
    users[creds.username] = hash_password(creds.password)
    logger.info("Registered user: %s", creds.username)
    return MessageResponse(message="User registered successfully")


def login_user(creds: Credentials) -> TokenResponse:
    hashed = users.get(creds.username)
    if not hashed or not verify_password(creds.password, hashed):
        logger.warning("Failed login for: %s", creds.username)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )
    token = generate_token()
    tokens[token] = creds.username
    logger.info("Login successful: %s", creds.username)
    return TokenResponse(token=token)
