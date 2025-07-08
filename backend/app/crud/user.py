from sqlalchemy.orm import Session
from ..models.user import User, ROLE_PATIENT, ROLE_ADMIN
from ..auth.security import hash_password, verify_password
from sqlalchemy.exc import IntegrityError

def create_patient_user(db: Session, name: str, email: str, phone_number: str, age: int, gender: str, password: str) -> User:
    """
    Create a new patient user with hashed password.
    Args:
        db (Session): SQLAlchemy session
        name (str): User's full name
        email (str): User's email
        phone_number (str): User's phone number
        age (int): User's age
        gender (str): User's gender
        password (str): Plain password
    Returns:
        User: The created user object
    Raises:
        ValueError: If email already exists
    """
    hashed_pw = hash_password(password)
    user = User(name=name, email=email, phone_number=phone_number, age=age, gender=gender, hashed_password=hashed_pw, role=ROLE_PATIENT)
    db.add(user)
    try:
        db.commit()
        db.refresh(user)
        return user
    except IntegrityError:
        db.rollback()
        raise ValueError("Email already registered")

def create_default_admin(db: Session) -> User:
    """
    Create the default admin user if it doesn't exist.
    Args:
        db (Session): SQLAlchemy session
    Returns:
        User: The admin user object
    """
    admin_email = "admin@clinic.com"
    admin = db.query(User).filter(User.email == admin_email).first()
    
    if not admin:
        hashed_pw = hash_password("admin123")
        admin = User(
            name="admin",
            email=admin_email,
            phone_number="0000000000",
            age=30,
            gender="Not specified",
            hashed_password=hashed_pw,
            role=ROLE_ADMIN
        )
        db.add(admin)
        db.commit()
        db.refresh(admin)
    
    return admin

def get_user_by_email(db: Session, email: str) -> User:
    """
    Get a user by email address.
    Args:
        db (Session): SQLAlchemy session
        email (str): User's email
    Returns:
        User: The user object if found, None otherwise
    """
    return db.query(User).filter(User.email == email).first()

def get_user_by_id(db: Session, user_id: int) -> User:
    """
    Get a user by ID.
    Args:
        db (Session): SQLAlchemy session
        user_id (int): User's ID
    Returns:
        User: The user object if found, None otherwise
    """
    return db.query(User).filter(User.id == user_id).first()

def authenticate_user(db: Session, email: str, password: str) -> User:
    """
    Authenticate a user by email and password.
    Args:
        db (Session): SQLAlchemy session
        email (str): User's email
        password (str): Plain password
    Returns:
        User: The authenticated user object if credentials are valid
        None: If credentials are invalid
    """
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user

def update_user(db: Session, user_id: int, user_update: dict) -> User:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return None
    for field, value in user_update.items():
        if value is not None and hasattr(user, field):
            setattr(user, field, value)
    db.commit()
    db.refresh(user)
    return user

def delete_user(db: Session, user_id: int) -> bool:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return False
    db.delete(user)
    db.commit()
    return True 