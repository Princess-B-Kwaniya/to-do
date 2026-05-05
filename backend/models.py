from pydantic import BaseModel


class Credentials(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    token: str


class MessageResponse(BaseModel):
    message: str
