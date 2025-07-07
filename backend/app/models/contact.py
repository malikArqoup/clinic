from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime
from ..core.database import Base

class ContactMessageModel(Base):
    __tablename__ = 'contact_messages'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False)
    phone = Column(String(30))
    subject = Column(String(200))
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow) 