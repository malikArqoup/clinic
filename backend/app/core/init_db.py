from sqlalchemy import text
from .database import engine, Base
from ..models.user import User

def init_db():
    """
    Initialize the database by dropping existing tables and creating fresh ones.
    """
    # Drop all existing tables
    with engine.connect() as connection:
        connection.execute(text("DROP SCHEMA public CASCADE"))
        connection.execute(text("CREATE SCHEMA public"))
        connection.commit()
    
    # Create all tables
    Base.metadata.create_all(bind=engine)
    print("Database initialized successfully!")

if __name__ == "__main__":
    init_db() 