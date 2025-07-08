from sqlalchemy import Column, Integer, String
from ..core.database import Base

ROLE_ADMIN = "admin"
ROLE_PATIENT = "patient"

class User(Base):
    """
    SQLAlchemy model for a user (doctor or patient).
    Fields:
        id: Primary key
        name: User's full name
        email: Unique email address
        phone_number: User's phone number
        age: User's age
        gender: User's gender
        hashed_password: Hashed password string
        role: User role (admin or patient)
        status: User status (active or inactive)
    """
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    phone_number = Column(String, nullable=False)
    age = Column(Integer, nullable=False)
    gender = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, nullable=False)
    # status = Column(String, nullable=False, default='active')  # تم إلغاء الحقل 