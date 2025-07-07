from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .core.database import engine
from .models import user, availability, booking, slider_image
from .routes import auth, availability as availability_routes, booking as booking_routes
from .routes import admin as admin_routes
from .routes import slider as slider_routes, slider as slider_routes_noprefix
from sqlalchemy.orm import Session
from fastapi import Depends
from .core.database import get_db
from .crud.slider_image import get_slider_images
from .schemas.slider_image import SliderImageOut
from typing import List

# Create database tables
user.Base.metadata.create_all(bind=engine)
availability.Base.metadata.create_all(bind=engine)
booking.Base.metadata.create_all(bind=engine)
slider_image.Base.metadata.create_all(bind=engine)

# Create FastAPI app
app = FastAPI(
    title="Clinic Appointment Booking System",
    description="""
    **How to authenticate:**
    1. Use `/login` (for patients) or `/admin-login` (for admin) to get your access token.
    2. Click the green "Authorize" button and paste your token as `Bearer <token>`.
    3. You are now authenticated for all endpoints!
    """,
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200", "http://127.0.0.1:4200"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Mount static files for slider images
app.mount("/static", StaticFiles(directory="static"), name="static")

app.include_router(auth.router)
app.include_router(availability_routes.router)
app.include_router(booking_routes.router)
app.include_router(admin_routes.router)
app.include_router(slider_routes.router)
app.include_router(slider_routes.router, prefix="", tags=["slider_noprefix"])

@app.get("/")
async def root():
    """
    Root endpoint to verify the API is running.
    """
    return {"message": "Clinic Appointment Booking System API"}

@app.get("/health")
async def health_check():
    """
    Health check endpoint.
    """
    return {"status": "healthy"}

@app.get("/admin/slider-images", response_model=List[SliderImageOut])
def get_slider_images_admin(db: Session = Depends(get_db)):
    """
    Endpoint لإدارة السلايدر (admin) لجلب صور السلايدر
    """
    return get_slider_images(db)
