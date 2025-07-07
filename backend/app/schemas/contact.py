from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class ContactMessageIn(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    subject: Optional[str] = None
    message: str

class ContactMessageOut(ContactMessageIn):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True 