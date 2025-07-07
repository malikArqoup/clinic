from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import time, datetime, timedelta
from ..models.availability import Availability, BookingSettings
from ..schemas.availability import AvailabilityCreate, BookingSettingsCreate
import re


def create_availability(db: Session, availability: AvailabilityCreate) -> Availability:
    """
    Create a new availability slot.
    Args:
        db (Session): SQLAlchemy session
        availability (AvailabilityCreate): Availability data
    Returns:
        Availability: The created availability object
    """
    # Convert time strings to time objects
    start_time = convert_time_string_to_time(availability.start_time)
    end_time = convert_time_string_to_time(availability.end_time)
    
    db_availability = Availability(
        weekday=availability.weekday,
        start_time=start_time,
        end_time=end_time,
        is_active=True
    )
    db.add(db_availability)
    db.commit()
    db.refresh(db_availability)
    return db_availability

def get_all_availability(db: Session, skip: int = 0, limit: int = 100) -> list[Availability]:
    """
    Get all availability slots.
    Args:
        db (Session): SQLAlchemy session
        skip (int): Number of records to skip
        limit (int): Maximum number of records to return
    Returns:
        list[Availability]: List of availability objects
    """
    return db.query(Availability).offset(skip).limit(limit).all()

def get_availability_by_weekday(db: Session, weekday: str) -> list[Availability]:
    """
    Get availability slots for a specific weekday (case-insensitive).
    Args:
        db (Session): SQLAlchemy session
        weekday (str): Weekday name (e.g., 'Monday', any case)
    Returns:
        list[Availability]: List of availability objects for the weekday
    """
    # Use case-insensitive search
    return db.query(Availability).filter(
        func.lower(Availability.weekday) == func.lower(weekday), 
        Availability.is_active == True
    ).all()

def get_availability_by_id(db: Session, availability_id: int) -> Availability:
    """
    Get availability slot by ID.
    Args:
        db (Session): SQLAlchemy session
        availability_id (int): Availability ID
    Returns:
        Availability: The availability object if found, None otherwise
    """
    return db.query(Availability).filter(Availability.id == availability_id).first()

def delete_availability(db: Session, availability_id: int) -> bool:
    """
    Delete an availability slot.
    Args:
        db (Session): SQLAlchemy session
        availability_id (int): Availability ID to delete
    Returns:
        bool: True if deleted, False if not found
    """
    availability = db.query(Availability).filter(Availability.id == availability_id).first()
    if availability:
        db.delete(availability)
        db.commit()
        return True
    return False

def get_availability(db: Session):
    return db.query(Availability).filter(Availability.is_active == True).all()

def convert_time_string_to_time(time_str: str) -> time:
    """
    Convert time string from 'HH:MM am/pm' format to time object.
    """
    # Remove extra spaces and convert to lowercase
    time_str = time_str.strip().lower()
    
    # Match pattern like "09:00 am" or "2:30 pm"
    pattern = r'(\d{1,2}):(\d{2})\s*(am|pm)'
    match = re.match(pattern, time_str)
    
    if not match:
        raise ValueError(f"Invalid time format: {time_str}. Expected format: 'HH:MM am/pm'")
    
    hour = int(match.group(1))
    minute = int(match.group(2))
    period = match.group(3)
    
    # Convert to 24-hour format
    if period == 'pm' and hour != 12:
        hour += 12
    elif period == 'am' and hour == 12:
        hour = 0
    
    return time(hour, minute)

# BookingSettings CRUD functions
def save_booking_settings(db: Session, settings: BookingSettingsCreate):
    # Delete existing settings (we only keep one record)
    db.query(BookingSettings).delete()
    
    # Create new settings
    db_settings = BookingSettings(
        slot_duration=settings.slot_duration,
        working_hours=settings.working_hours
    )
    db.add(db_settings)
    db.commit()
    db.refresh(db_settings)
    return db_settings

def get_booking_settings(db: Session):
    return db.query(BookingSettings).first()

def generate_booking_slots(db: Session, date: str):
    """
    Generate available booking slots for a specific date based on booking settings.
    """
    settings = get_booking_settings(db)
    if not settings:
        return []
    
    # Get day name from date
    date_obj = datetime.strptime(date, '%Y-%m-%d')
    day_name = date_obj.strftime('%A')
    
    # Get working hours for this day
    working_hours = settings.working_hours.get(day_name, {})
    if not working_hours.get('enabled', False):
        return []
    
    start_time = working_hours['start']  # "09:00"
    end_time = working_hours['end']      # "17:00"
    slot_duration = int(settings.slot_duration)  # 30 minutes
    
    slots = []
    current_time = datetime.strptime(start_time, '%H:%M')
    end_time_obj = datetime.strptime(end_time, '%H:%M')
    
    while current_time + timedelta(minutes=slot_duration) <= end_time_obj:
        slot_start = current_time.strftime('%H:%M')
        slot_end_dt = current_time + timedelta(minutes=slot_duration)
        slot_end = slot_end_dt.strftime('%H:%M')
        slots.append({
            'start_time': slot_start,
            'end_time': slot_end,
            'available': True
        })
        current_time = slot_end_dt
    
    return slots 