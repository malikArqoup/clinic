from sqlalchemy import Column, Integer, ForeignKey, Date, Time, String, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from ..core.database import Base

class Booking(Base):
    """
    SQLAlchemy model for patient bookings.
    Fields:
        id: Primary key
        user_id: Foreign key to users.id (patient)
        date: Date of the booking
        start_time: Start time of the slot
        end_time: End time of the slot
        status: Booking status (e.g., 'booked', 'cancelled')
        created_at: Timestamp
    """
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    date = Column(Date, nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    status = Column(String, default="booked")
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User") 