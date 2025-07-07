"""
Availability routes for doctor to manage available time slots.
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta
from ..schemas.availability import AvailabilityCreate, AvailabilityOut
from ..crud.availability import create_availability, get_all_availability, get_availability_by_weekday, delete_availability
from ..core.database import get_db
from ..auth.dependencies import get_current_user
from ..models.user import User
from ..crud.booking import get_bookings_by_date

router = APIRouter(prefix="/availability", tags=["availability"])

def verify_admin_access(current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can manage availability"
        )
    return current_user

@router.post("/", response_model=AvailabilityOut, status_code=status.HTTP_201_CREATED)
def create_availability_slot(
    availability: AvailabilityCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(verify_admin_access)
):
    db_availability = create_availability(db, availability)
    return {
        "id": db_availability.id,
        "weekday": db_availability.weekday,
        "start_time": db_availability.start_time.strftime("%H:%M"),
        "end_time": db_availability.end_time.strftime("%H:%M"),
        "is_active": db_availability.is_active,
        "created_at": db_availability.created_at
    }

@router.get("/", response_model=List[AvailabilityOut])
def get_availability_slots(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
):
    availabilities = get_all_availability(db, skip=skip, limit=limit)
    return [
        {
            "id": availability.id,
            "weekday": availability.weekday,
            "start_time": availability.start_time.strftime("%H:%M"),
            "end_time": availability.end_time.strftime("%H:%M"),
            "is_active": availability.is_active,
            "created_at": availability.created_at
        }
        for availability in availabilities
    ]

@router.get("/by-weekday/{weekday}", response_model=List[AvailabilityOut])
def get_availability_by_weekday_route(
    weekday: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(verify_admin_access)
):
    availabilities = get_availability_by_weekday(db, weekday)
    return [
        {
            "id": availability.id,
            "weekday": availability.weekday,
            "start_time": availability.start_time.strftime("%H:%M"),
            "end_time": availability.end_time.strftime("%H:%M"),
            "is_active": availability.is_active,
            "created_at": availability.created_at
        }
        for availability in availabilities
    ]

@router.delete("/{slot_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_availability_slot(
    slot_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(verify_admin_access)
):
    success = delete_availability(db, slot_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Availability slot not found"
        ) 

@router.get("/available-slots", response_model=List[str], tags=["public"])
def get_available_slots(
    date: str = Query(..., description="Date in YYYY-MM-DD format"),
    db: Session = Depends(get_db)
):
    """
    Get available 30-min slots for a specific date (public/patient endpoint).
    - Converts date to weekday (title case)
    - Fetches all availability for that weekday
    - Dynamically splits into 30-min slots
    """
    try:
        target_date = datetime.strptime(date, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD.")
    weekday = target_date.strftime("%A")  # Always title case
    availabilities = get_availability_by_weekday(db, weekday)
    # Get all booked slots for this date
    booked = get_bookings_by_date(db, target_date)
    booked_slots = set((b.start_time, b.end_time) for b in booked)
    slots = []
    for availability in availabilities:
        start = datetime.combine(target_date, availability.start_time)
        end = datetime.combine(target_date, availability.end_time)
        while start + timedelta(minutes=30) <= end:
            slot_tuple = (start.time(), (start + timedelta(minutes=30)).time())
            if slot_tuple not in booked_slots:
                slot_str = f"{start.strftime('%I:%M %p')} - {(start + timedelta(minutes=30)).strftime('%I:%M %p')}"
                slots.append(slot_str)
            start += timedelta(minutes=30)
    return slots 