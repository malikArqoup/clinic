from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .core.database import engine, Base
from .models import user, availability, booking, slider_image, clinic_info
from .routes import auth, availability as availability_routes, booking as booking_routes
from .routes import admin as admin_routes
from .routes import slider as slider_routes
from .routes import clinic_info as clinic_info_routes

# Create database tables
Base.metadata.create_all(bind=engine)

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


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for slider images
app.mount("/static", StaticFiles(directory="static"), name="static")

app.include_router(auth.router)
app.include_router(availability_routes.router)
app.include_router(booking_routes.router)
app.include_router(admin_routes.router)
app.include_router(slider_routes.router)
app.include_router(clinic_info_routes.router)

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
