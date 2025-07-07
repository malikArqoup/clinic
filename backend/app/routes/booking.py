from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..schemas.booking import BookingCreate, BookingOut
from ..crud.booking import create_booking, get_bookings_by_user, delete_booking, check_slot_booked, get_bookings_by_status
from ..crud.availability import get_availability_by_weekday, generate_booking_slots
from ..core.database import get_db
from ..auth.dependencies import get_current_user
from ..models.user import User
from ..models.booking import Booking
from ..schemas.availability import AvailabilityCreate
from ..schemas.user import UserOut
from datetime import date, datetime, timedelta

router = APIRouter(prefix="/bookings", tags=["bookings"])

def verify_patient_access(current_user: User = Depends(get_current_user)):
    if current_user.role != "patient":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only patients can book or manage bookings"
        )
    return current_user

@router.post("/", response_model=BookingOut, status_code=status.HTTP_201_CREATED)
def book_slot(
    booking: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(verify_patient_access)
):
    # Parse and normalize times
    start_time = AvailabilityCreate.parse_time_string(booking.start_time)
    end_time = AvailabilityCreate.parse_time_string(booking.end_time)
    # Enforce 30-minute slot duration
    slot_duration = (
        datetime.combine(booking.date, end_time) - datetime.combine(booking.date, start_time)
    )
    if slot_duration != timedelta(minutes=30):
        raise HTTPException(status_code=400, detail="You can only book 30-minute slots.")
    # Check if slot is already booked
    if check_slot_booked(db, booking.date, start_time, end_time):
        raise HTTPException(status_code=409, detail="Slot already booked")
    # Check if slot is within any defined availability for that weekday (robust logic)
    weekday = booking.date.strftime("%A")
    availabilities = get_availability_by_weekday(db, weekday)
    slot_is_valid = any(
        avail.start_time <= start_time and avail.end_time >= end_time
        for avail in availabilities
    )
    if not slot_is_valid:
        raise HTTPException(status_code=400, detail="This slot is not available for booking.")
    db_booking = create_booking(db, int(current_user.id), booking)
    return BookingOut(
        id=db_booking.id,
        user=UserOut.from_orm(db_booking.user),
        date=db_booking.date,
        start_time=db_booking.start_time.strftime('%I:%M %p'),
        end_time=db_booking.end_time.strftime('%I:%M %p'),
        status=db_booking.status,
        created_at=db_booking.created_at
    )

@router.get("/my-bookings", response_model=List[BookingOut])
def get_my_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(verify_patient_access)
):
    bookings = get_bookings_by_user(db, int(current_user.id))
    return [
        BookingOut(
            id=b.id,
            user=UserOut.from_orm(b.user),
            date=b.date,
            start_time=b.start_time.strftime('%I:%M %p'),
            end_time=b.end_time.strftime('%I:%M %p'),
            status=b.status,
            created_at=b.created_at
        ) for b in bookings
    ]

@router.delete("/{booking_id}", status_code=status.HTTP_204_NO_CONTENT)
def cancel_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(verify_patient_access)
):
    success = delete_booking(db, booking_id, int(current_user.id))
    if not success:
        raise HTTPException(status_code=404, detail="Booking not found or not yours")

@router.get("/by-status/{status}", response_model=List[BookingOut])
def get_bookings_by_status_endpoint(
    status: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(verify_patient_access)
):
    bookings = get_bookings_by_status(db, status)
    return [
        BookingOut(
            id=b.id,
            user=UserOut.from_orm(b.user),
            date=b.date,
            start_time=b.start_time.strftime('%I:%M %p'),
            end_time=b.end_time.strftime('%I:%M %p'),
            status=b.status,
            created_at=b.created_at
        ) for b in bookings
    ]

@router.get("/available-slots/{date}")
def get_available_slots(
    date: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(verify_patient_access)
):
    """
    Get available booking slots for a specific date.
    """
    try:
        # Validate date format
        datetime.strptime(date, '%Y-%m-%d')
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
    
    # Generate slots based on booking settings
    slots = generate_booking_slots(db, date)
    
    # Filter out already booked slots
    booked_slots = db.query(Booking).filter(
        Booking.date == date,
        Booking.status.in_(["confirmed", "pending"])
    ).all()
    
    # Create a set of booked time ranges for quick lookup
    booked_times = set()
    for booking in booked_slots:
        start_str = booking.start_time.strftime('%H:%M')
        end_str = booking.end_time.strftime('%H:%M')
        booked_times.add(f"{start_str}-{end_str}")
    
    # Mark slots as unavailable if they overlap with booked times
    available_slots = []
    for slot in slots:
        slot_key = f"{slot['start_time']}-{slot['end_time']}"
        if slot_key not in booked_times:
            available_slots.append(slot)
    
    return {
        "date": date,
        "slots": available_slots
    }

@router.get("/available-slots-public/{date}")
def get_available_slots_public(
    date: str,
    db: Session = Depends(get_db)
):
    """
    Get available booking slots for a specific date (public endpoint, no auth required).
    """
    try:
        # Validate date format
        datetime.strptime(date, '%Y-%m-%d')
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
    
    # Get day name from date
    date_obj = datetime.strptime(date, '%Y-%m-%d')
    weekday = date_obj.strftime('%A')
    
    # Get availability for this weekday
    availabilities = get_availability_by_weekday(db, weekday)
    if not availabilities:
        return {
            "date": date,
            "slots": [],
            "message": "No availability for this day"
        }
    
    # Generate 30-minute slots for each availability range
    all_slots = []
    for avail in availabilities:
        start_time = avail.start_time
        end_time = avail.end_time
        
        # Generate slots every 30 minutes
        current_time = datetime.combine(date_obj, start_time)
        end_datetime = datetime.combine(date_obj, end_time)
        
        while current_time + timedelta(minutes=30) <= end_datetime:
            slot_start = current_time.time()
            slot_end = (current_time + timedelta(minutes=30)).time()
            
            all_slots.append({
                'start_time': slot_start.strftime('%I:%M %p'),
                'end_time': slot_end.strftime('%I:%M %p'),
                'start_time_24h': slot_start.strftime('%H:%M'),
                'end_time_24h': slot_end.strftime('%H:%M')
            })
            
            current_time += timedelta(minutes=30)
    
    # Filter out already booked slots
    booked_slots = db.query(Booking).filter(
        Booking.date == date,
        Booking.status.in_(["booked", "confirmed", "pending"])
    ).all()
    
    # Create a set of booked time ranges for quick lookup
    booked_times = set()
    for booking in booked_slots:
        start_str = booking.start_time.strftime('%H:%M')
        end_str = booking.end_time.strftime('%H:%M')
        booked_times.add(f"{start_str}-{end_str}")
    
    # Filter out booked slots
    available_slots = []
    for slot in all_slots:
        slot_key = f"{slot['start_time_24h']}-{slot['end_time_24h']}"
        if slot_key not in booked_times:
            available_slots.append({
                'start_time': slot['start_time'],
                'end_time': slot['end_time']
            })
    
    return {
        "date": date,
        "slots": available_slots
    } 