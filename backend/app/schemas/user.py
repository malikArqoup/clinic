from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class UserRegister(BaseModel):
    """
    Schema for user registration input.
    Fields:
        name: User's full name
        email: User's email address
        phone_number: User's phone number
        age: User's age (must be positive)
        gender: User's gender
        password: User's password (min 6 chars)
    """
    name: str
    email: EmailStr
    phone_number: str
    age: int = Field(gt=0, le=120)
    gender: str
    password: str = Field(min_length=6)

class UserLogin(BaseModel):
    """
    Schema for user login input.
    Fields:
        email: User's email address
        password: User's password
    """
    email: EmailStr
    password: str

class AdminLogin(BaseModel):
    """
    Schema for admin login input.
    Fields:
        email: Admin's email address
        password: Admin's password
    """
    email: EmailStr
    password: str

class UserOut(BaseModel):
    """
    Schema for user output (response).
    Fields:
        id: User ID
        name: User's full name
        email: User's email address
        phone_number: User's phone number
        age: User's age
        gender: User's gender
        role: User's role
        access_token: JWT token (optional)
    """
    id: int
    name: str
    email: EmailStr
    phone_number: str
    age: int
    gender: str
    role: str
    access_token: Optional[str] = None

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone_number: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    role: Optional[str] = None
    status: Optional[str] = None 