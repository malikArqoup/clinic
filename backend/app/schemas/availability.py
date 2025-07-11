from pydantic import BaseModel, validator
from datetime import time, datetime
from typing import List, Optional, Dict
import re

class AvailabilityBase(BaseModel):
    weekday: str
    start_time: str
    end_time: str

class AvailabilityCreate(AvailabilityBase):
    """
    Schema for creating availability.
    Fields:
        weekday: Day of the week (e.g., 'Monday', case-insensitive)
        start_time: Start time (e.g., '09:30 AM')
        end_time: End time (e.g., '02:00 pm')
    """

    @staticmethod
    def parse_time_string(t: str) -> time:
        # Accepts 'HH:MM am/pm' or 'HH:MM AM/PM' (case-insensitive)
        t = t.strip().lower()
        match = re.match(r'^(1[0-2]|0?[1-9]):([0-5][0-9]) ?([ap]m)$', t)
        if not match:
            raise ValueError('Time must be in HH:MM am/pm format')
        hour, minute, ampm = int(match.group(1)), int(match.group(2)), match.group(3)
        if ampm == 'pm' and hour != 12:
            hour += 12
        if ampm == 'am' and hour == 12:
            hour = 0
        return time(hour, minute)

class Availability(AvailabilityBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class WorkingHours(BaseModel):
    enabled: bool
    start: str
    end: str

class BookingSettingsBase(BaseModel):
    slot_duration: int
    working_hours: Dict[str, WorkingHours]

class BookingSettingsCreate(BookingSettingsBase):
    pass

class BookingSettings(BookingSettingsBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class AvailabilityOut(BaseModel):
    """
    Schema for availability output.
    Fields:
        id: Availability ID
        weekday: Day of the week
        start_time: Start time
        end_time: End time
        is_active: Whether slot is available
        created_at: Timestamp
    """
    id: int
    weekday: str
    start_time: str
    end_time: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class AvailabilityList(BaseModel):
    """
    Schema for list of availability slots.
    """
    availabilities: List[AvailabilityOut] 