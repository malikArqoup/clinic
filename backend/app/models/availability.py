from sqlalchemy import Column, Integer, String, Time, Boolean, DateTime, JSON
from datetime import datetime
from ..core.database import Base

class Availability(Base):
    """
    SQLAlchemy model for doctor's weekly availability slots (single admin).
    Fields:
        id: Primary key
        weekday: Day of the week (e.g., 'Monday')
        start_time: Start of availability range
        end_time: End of availability range
        is_active: Whether this range is active
        created_at: Timestamp
    """
    __tablename__ = "availability"

    id = Column(Integer, primary_key=True, index=True)
    weekday = Column(String, nullable=False, index=True)  # e.g., 'Monday'
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class BookingSettings(Base):
    """
    SQLAlchemy model for booking settings (slot duration and working hours per day).
    Fields:
        id: Primary key
        slot_duration: Duration of each booking slot in minutes
        working_hours: JSON object with working hours for each day
        created_at: Timestamp
        updated_at: Last update timestamp
    """
    __tablename__ = "booking_settings"

    id = Column(Integer, primary_key=True, index=True)
    slot_duration = Column(Integer, nullable=False, default=30)  # minutes
    working_hours = Column(JSON, nullable=False)  # {"Monday": {"enabled": true, "start": "09:00", "end": "17:00"}, ...}
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow) 