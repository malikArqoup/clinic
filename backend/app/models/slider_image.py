from sqlalchemy import Column, Integer, String
from app.core.database import Base

class SliderImage(Base):
    __tablename__ = "slider_images"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    image_url = Column(String, nullable=False)
    order = Column(Integer, nullable=True, default=0) 