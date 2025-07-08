from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from ..core.database import Base

class SliderImage(Base):
    __tablename__ = "slider_images"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    image_url = Column(String, nullable=False)
    order = Column(Integer, nullable=True, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow) 