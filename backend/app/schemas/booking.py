from pydantic import BaseModel
from datetime import date, time, datetime
from typing import Optional
from .user import UserOut

class BookingBase(BaseModel):
    date: date
    start_time: str  # Format: "HH:MM AM/PM"
    end_time: str    # Format: "HH:MM AM/PM"
    status: str = "pending"

class BookingCreate(BookingBase):
    pass

class BookingUpdate(BaseModel):
    date: Optional[date] = None
    start_time: Optional[str] = None  # Format: "HH:MM AM/PM"
    end_time: Optional[str] = None    # Format: "HH:MM AM/PM"
    status: Optional[str] = None

class BookingOut(BaseModel):
    id: int
    user: UserOut
    date: date
    start_time: str  # Format: "HH:MM AM/PM"
    end_time: str    # Format: "HH:MM AM/PM"
    status: str
    created_at: datetime

    class Config:
        from_attributes = True 