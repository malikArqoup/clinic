from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List
from ..core.database import get_db
from ..models.user import User
from ..models.booking import Booking
from ..schemas.user import UserOut, UserUpdate
from ..schemas.booking import BookingOut, BookingCreate, BookingUpdate
from ..schemas.availability import BookingSettingsCreate, BookingSettings
from ..auth.dependencies import get_current_user
from ..crud.availability import save_booking_settings, get_booking_settings
from ..crud.booking import admin_delete_booking
from sqlalchemy import func
from ..models.slider_image import SliderImage
from ..schemas.slider_image import SliderImageCreate, SliderImageUpdate, SliderImageOut
import os, shutil
from app.cloudinary_utils import upload_image_to_cloudinary
from ..schemas.contact import ContactMessageIn, ContactMessageOut
from ..models.contact import ContactMessageModel
from ..crud.user import update_user as crud_update_user, delete_user as crud_delete_user

router = APIRouter(prefix="/admin", tags=["admin"])

def verify_admin(current_user: User = Depends(get_current_user)):
    if getattr(current_user, 'role', None) != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admins only")
    return current_user

@router.get("/dashboard/stats")
def get_dashboard_stats(db: Session = Depends(get_db), current_user: User = Depends(verify_admin)):
    total_appointments = db.query(Booking).count()
    from datetime import date
    today_appointments = db.query(Booking).filter(Booking.date == date.today()).count()
    new_patients = db.query(User).filter(User.role == "patient").count()
    revenue = total_appointments * 20  # مثال: كل حجز 20 دينار
    pending_appointments = db.query(Booking).filter(Booking.status == "pending").count()
    confirmed_appointments = db.query(Booking).filter(Booking.status == "confirmed").count()
    return {
        "totalAppointments": total_appointments,
        "todayAppointments": today_appointments,
        "newPatients": new_patients,
        "revenue": revenue,
        "pendingAppointments": pending_appointments,
        "confirmedAppointments": confirmed_appointments
    }

@router.get("/bookings", response_model=List[BookingOut])
def get_all_bookings(
    db: Session = Depends(get_db), 
    current_user: User = Depends(verify_admin),
    q: str | None = None
):
    query = db.query(Booking)
    
    # If search query is provided, filter by phone number or patient name
    if q:
        query = query.join(User).filter(
            (User.phone_number.ilike(f'%{q}%')) | 
            (User.name.ilike(f'%{q}%'))
        )
    
    bookings = query.all()
    result = []
    for b in bookings:
        result.append({
            "id": b.id,
            "user": UserOut.from_orm(b.user),
            "date": b.date,
            "start_time": b.start_time.strftime('%I:%M %p'),
            "end_time": b.end_time.strftime('%I:%M %p'),
            "status": b.status,
            "created_at": b.created_at
        })
    return result

@router.get("/bookings/search", response_model=List[BookingOut])
def search_bookings(
    q: str,
    db: Session = Depends(get_db), 
    current_user: User = Depends(verify_admin)
):
    """Search bookings by phone number or patient name"""
    query = db.query(Booking).join(User).filter(
        (User.phone_number.ilike(f'%{q}%')) | 
        (User.name.ilike(f'%{q}%'))
    )
    
    bookings = query.all()
    result = []
    for b in bookings:
        result.append({
            "id": b.id,
            "user": UserOut.from_orm(b.user),
            "date": b.date,
            "start_time": b.start_time.strftime('%I:%M %p'),
            "end_time": b.end_time.strftime('%I:%M %p'),
            "status": b.status,
            "created_at": b.created_at
        })
    return result

@router.get("/users", response_model=List[UserOut])
def get_all_users(db: Session = Depends(get_db), current_user: User = Depends(verify_admin)):
    users = db.query(User).all()
    return [UserOut.from_orm(u) for u in users]

@router.get("/users/search", response_model=List[UserOut])
def search_users(q: str, db: Session = Depends(get_db), current_user: User = Depends(verify_admin)):
    users = db.query(User).filter(
        (User.name.ilike(f"%{q}%")) | (User.email.ilike(f"%{q}%"))
    ).all()
    return [UserOut.from_orm(u) for u in users]

@router.post("/booking-settings", response_model=BookingSettings)
def save_booking_settings_endpoint(
    settings: BookingSettingsCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(verify_admin)
):
    return save_booking_settings(db, settings)

@router.get("/booking-settings", response_model=BookingSettings)
def get_booking_settings_endpoint(
    db: Session = Depends(get_db),
    current_user: User = Depends(verify_admin)
):
    settings = get_booking_settings(db)
    if not settings:
        raise HTTPException(status_code=404, detail="No booking settings found")
    return settings

@router.put("/bookings/{booking_id}", response_model=BookingOut)
def update_booking_endpoint(
    booking_id: int,
    booking_update: BookingUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(verify_admin)
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    # Convert string times to time objects
    from datetime import datetime
    if booking_update.start_time:
        start_time_obj = datetime.strptime(booking_update.start_time, '%I:%M %p').time()
        setattr(booking, 'start_time', start_time_obj)
    if booking_update.end_time:
        end_time_obj = datetime.strptime(booking_update.end_time, '%I:%M %p').time()
        setattr(booking, 'end_time', end_time_obj)
    
    # Update booking fields using setattr to avoid SQLAlchemy issues
    if booking_update.date:
        setattr(booking, 'date', booking_update.date)
    if booking_update.status:
        setattr(booking, 'status', booking_update.status)
    
    db.commit()
    db.refresh(booking)
    
    return {
        "id": booking.id,
        "user": UserOut.from_orm(booking.user),
        "date": booking.date,
        "start_time": booking.start_time.strftime('%I:%M %p'),
        "end_time": booking.end_time.strftime('%I:%M %p'),
        "status": booking.status,
        "created_at": booking.created_at
    }

@router.delete("/bookings/{booking_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_booking_endpoint(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(verify_admin)
):
    success = admin_delete_booking(db, booking_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )

@router.get("/slider", response_model=list[SliderImageOut])
def get_slider_images(db: Session = Depends(get_db)):
    return db.query(SliderImage).all()

@router.get("/slider-images", response_model=list[SliderImageOut])
def get_slider_images_alt(db: Session = Depends(get_db)):
    return db.query(SliderImage).all()

@router.post("/admin/slider", response_model=SliderImageOut)
async def create_slider_image(
    title: str = Form(...),
    description: str = Form(...),
    image: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # Validate file type and size
    if image.content_type not in ["image/jpeg", "image/png"]:
        raise HTTPException(status_code=400, detail="Only JPG and PNG images are allowed.")
    contents = await image.read()
    if len(contents) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Image size must be less than 5MB.")

    # Upload to Cloudinary
    image_url = upload_image_to_cloudinary(contents)
    
    # Check if upload was successful
    if not image_url:
        raise HTTPException(
            status_code=500, 
            detail="Failed to upload image. Please check your Cloudinary configuration."
        )

    # Store in DB
    slider = SliderImage(title=title, description=description, image_url=image_url)
    db.add(slider)
    db.commit()
    db.refresh(slider)
    return slider

@router.post("/slider-images", response_model=SliderImageOut)
async def create_slider_image_alt(
    title: str = Form(...),
    description: str = Form(...),
    image: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # Validate file type and size
    if image.content_type not in ["image/jpeg", "image/png"]:
        raise HTTPException(status_code=400, detail="Only JPG and PNG images are allowed.")
    contents = await image.read()
    if len(contents) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Image size must be less than 5MB.")

    # Upload to Cloudinary
    image_url = upload_image_to_cloudinary(contents)
    
    # Check if upload was successful
    if not image_url:
        raise HTTPException(
            status_code=500, 
            detail="Failed to upload image. Please check your Cloudinary configuration."
        )

    # Store in DB
    slider = SliderImage(title=title, description=description, image_url=image_url)
    db.add(slider)
    db.commit()
    db.refresh(slider)
    return slider

@router.put("/slider-images/{image_id}", response_model=SliderImageOut)
def update_slider_image_route(
    image_id: int,
    slider_data: SliderImageUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(verify_admin)
):
    slider = db.query(SliderImage).filter(SliderImage.id == image_id).first()
    if not slider:
        raise HTTPException(status_code=404, detail="Slider image not found")
    
    # Update fields if provided
    if slider_data.title is not None:
        setattr(slider, 'title', slider_data.title)
    if slider_data.description is not None:
        setattr(slider, 'description', slider_data.description)
    if slider_data.image_url is not None:
        setattr(slider, 'image_url', slider_data.image_url)
    if slider_data.order is not None:
        setattr(slider, 'order', slider_data.order)
    
    db.commit()
    db.refresh(slider)
    return slider

@router.delete("/slider-images/{image_id}")
def delete_slider_image_route(
    image_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(verify_admin)
):
    slider = db.query(SliderImage).filter(SliderImage.id == image_id).first()
    if not slider:
        raise HTTPException(status_code=404, detail="Slider image not found")
    
    db.delete(slider)
    db.commit()
    return {"detail": "Slider image deleted successfully"}

@router.post("/contact-us")
def contact_us(message: ContactMessageIn, db: Session = Depends(get_db)):
    db_message = ContactMessageModel(
        name=message.name,
        email=message.email,
        phone=message.phone,
        subject=message.subject,
        message=message.message
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return {"detail": "تم استلام رسالتك بنجاح!"}

@router.get("/contact-messages", response_model=list[ContactMessageOut])
def get_contact_messages(db: Session = Depends(get_db), current_user: User = Depends(verify_admin)):
    messages = db.query(ContactMessageModel).order_by(ContactMessageModel.created_at.desc()).all()
    return messages

@router.put("/users/{user_id}", response_model=UserOut)
def update_user_endpoint(user_id: int, user_update: UserUpdate, db: Session = Depends(get_db), current_user: User = Depends(verify_admin)):
    user = crud_update_user(db, user_id, user_update.dict(exclude_unset=True))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserOut.from_orm(user)

@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user_endpoint(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(verify_admin)):
    success = crud_delete_user(db, user_id)
    if not success:
        raise HTTPException(status_code=404, detail="User not found") 