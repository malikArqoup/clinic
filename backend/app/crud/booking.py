from sqlalchemy.orm import Session
from datetime import date, time
from ..models.booking import Booking
from ..schemas.booking import BookingCreate


def create_booking(db: Session, user_id: int, booking: BookingCreate) -> Booking:
    """
    Create a new booking for a user.
    Args:
        db (Session): SQLAlchemy session
        user_id (int): ID of the patient
        booking (BookingCreate): Booking data
    Returns:
        Booking: The created booking object
    """
    # Parse time from 'HH:MM am/pm' string
    from ..schemas.availability import AvailabilityCreate
    start_time = AvailabilityCreate.parse_time_string(booking.start_time)
    end_time = AvailabilityCreate.parse_time_string(booking.end_time)
    db_booking = Booking(
        user_id=user_id,
        date=booking.date,
        start_time=start_time,
        end_time=end_time,
        status="booked"
    )
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking

def get_bookings_by_user(db: Session, user_id: int) -> list[Booking]:
    """
    Get all bookings for a user.
    """
    return db.query(Booking).filter(Booking.user_id == user_id).all()

def get_user_bookings(db: Session, user_id: int) -> list[Booking]:
    """
    Get all bookings for a user (alias for get_bookings_by_user).
    """
    return get_bookings_by_user(db, user_id)

def get_bookings_by_status(db: Session, status: str) -> list[Booking]:
    """
    Get all bookings by status.
    """
    return db.query(Booking).filter(Booking.status == status).all()

def get_bookings_by_date(db: Session, target_date: date) -> list[Booking]:
    """
    Get all bookings for a specific date.
    """
    return db.query(Booking).filter(Booking.date == target_date, Booking.status == "booked").all()

def delete_booking(db: Session, booking_id: int, user_id: int) -> bool:
    """
    Delete (cancel) a booking if it belongs to the user.
    """
    booking = db.query(Booking).filter(Booking.id == booking_id, Booking.user_id == user_id).first()
    if booking:
        booking.status = "cancelled"
        db.commit()
        return True
    return False

def admin_delete_booking(db: Session, booking_id: int) -> bool:
    """
    Admin function to completely delete a booking from the database.
    """
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if booking:
        db.delete(booking)
        db.commit()
        return True
    return False

def check_slot_booked(db: Session, target_date: date, start_time: time, end_time: time) -> bool:
    """
    Check if a slot is already booked for a given date and time range.
    """
    exists = db.query(Booking).filter(
        Booking.date == target_date,
        Booking.start_time == start_time,
        Booking.end_time == end_time,
        Booking.status == "booked"
    ).first()
    return exists is not None 