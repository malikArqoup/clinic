from sqlalchemy import Column, Integer, String, Boolean, DateTime
from datetime import datetime
from ..core.database import Base

class SliderImage(Base):
    __tablename__ = "slider_images"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    text = Column(String, nullable=True)
    image_url = Column(String, nullable=False)
    order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow) 