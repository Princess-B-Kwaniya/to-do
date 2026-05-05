import logging

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

from models import Credentials, TokenResponse, MessageResponse
from auth import register_user, login_user, get_current_user

# ── Logging ───────────────────────────────────────────────────────────────────
logging.basicConfig(
    filename="app.log",
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)

# ── App ───────────────────────────────────────────────────────────────────────
app = FastAPI(title="Auth API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routes ────────────────────────────────────────────────────────────────────
@app.get("/")
def root() -> dict[str, str]:
    return {"status": "ok", "docs": "http://localhost:8000/docs"}


@app.post("/register", response_model=MessageResponse, status_code=201)
def register(creds: Credentials) -> MessageResponse:
    return register_user(creds)


@app.post("/login", response_model=TokenResponse)
def login(creds: Credentials) -> TokenResponse:
    return login_user(creds)


@app.get("/protected", response_model=MessageResponse)
def protected(username: str = Depends(get_current_user)) -> MessageResponse:
    return MessageResponse(message=f"Hello, {username}! You are authenticated.")
