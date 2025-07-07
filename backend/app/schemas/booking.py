from pydantic import BaseModel, Field
from datetime import date, time, datetime
from typing import Optional
from .user import UserOut

class BookingCreate(BaseModel):
    """
    Schema for creating a booking.
    Fields:
        date: Date of the booking (YYYY-MM-DD)
        start_time: Start time (HH:MM am/pm)
        end_time: End time (HH:MM am/pm)
    """
    date: date
    start_time: str  # 'HH:MM am/pm'
    end_time: str    # 'HH:MM am/pm'

class BookingUpdate(BaseModel):
    """
    Schema for updating a booking.
    Fields:
        date: Date of the booking (YYYY-MM-DD)
        start_time: Start time (HH:MM am/pm)
        end_time: End time (HH:MM am/pm)
        status: Booking status
    """
    date: date
    start_time: str  # 'HH:MM am/pm'
    end_time: str    # 'HH:MM am/pm'
    status: str

class BookingOut(BaseModel):
    """
    Schema for booking output.
    """
    id: int
    user: UserOut
    date: date
    start_time: str
    end_time: str
    status: str
    created_at: datetime

    class Config:
        orm_mode = True 