"""
Authentication routes for registration and login.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..schemas.user import UserRegister, UserLogin, AdminLogin, UserOut
from ..crud.user import create_patient_user, authenticate_user, create_default_admin, get_user_by_email
from ..core.database import get_db
from ..auth.jwt import create_access_token
from ..auth.security import verify_password
from ..auth.dependencies import get_current_user
from ..models.user import User

router = APIRouter(prefix="", tags=["auth"])

@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register_patient(user_in: UserRegister, db: Session = Depends(get_db)):
    """
    Register a new patient user. Returns user info and JWT token.
    """
    try:
        user = create_patient_user(db, user_in.name, user_in.email, user_in.phone_number, user_in.age, user_in.gender, user_in.password)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    # Create JWT token
    access_token = create_access_token({"sub": str(user.id), "role": user.role})
    return {
        "id": user.id, 
        "name": user.name, 
        "email": user.email, 
        "phone_number": user.phone_number,
        "age": user.age,
        "gender": user.gender,
        "role": user.role, 
        "access_token": access_token
    }

@router.post("/login", response_model=UserOut)
def login_user(user_in: UserLogin, db: Session = Depends(get_db)):
    """
    Login a user with email and password. Returns user info and JWT token.
    """
    user = authenticate_user(db, user_in.email, user_in.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    # Create JWT token
    access_token = create_access_token({"sub": str(user.id), "role": user.role})
    return {
        "id": user.id, 
        "name": user.name, 
        "email": user.email, 
        "phone_number": user.phone_number,
        "age": user.age,
        "gender": user.gender,
        "role": user.role, 
        "access_token": access_token
    }

@router.post("/admin-login", response_model=UserOut)
def login_admin(admin_in: AdminLogin, db: Session = Depends(get_db)):
    """
    Login an admin with email and password. Returns admin info and JWT token.
    """
    # Ensure default admin exists
    create_default_admin(db)
    
    # Find admin by email
    admin = db.query(User).filter(User.email == admin_in.email, User.role == "admin").first()
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Verify password
    if not verify_password(admin_in.password, admin.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create JWT token
    access_token = create_access_token({"sub": str(admin.id), "role": admin.role})
    return {
        "id": admin.id, 
        "name": admin.name, 
        "email": admin.email, 
        "phone_number": admin.phone_number,
        "age": admin.age,
        "gender": admin.gender,
        "role": admin.role, 
        "access_token": access_token
    }

@router.get("/me", response_model=UserOut)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    """
    Get current user information using JWT token.
    """
    return {
        "id": current_user.id, 
        "name": current_user.name, 
        "email": current_user.email, 
        "phone_number": current_user.phone_number,
        "age": current_user.age,
        "gender": current_user.gender,
        "role": current_user.role, 
        "access_token": None  # Don't return token in /me endpoint
    } 