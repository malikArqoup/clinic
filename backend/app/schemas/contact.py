from pydantic import BaseModel
from datetime import datetime

class ContactMessageIn(BaseModel):
    name: str
    email: str
    phone: str
    subject: str
    message: str

class ContactMessageOut(BaseModel):
    id: int
    name: str
    email: str
    phone: str
    subject: str
    message: str
    created_at: datetime

    class Config:
        from_attributes = True 