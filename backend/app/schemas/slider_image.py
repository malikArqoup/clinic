from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class SliderImageBase(BaseModel):
    title: str
    description: str
    image_url: str
    order: int = 0

class SliderImageCreate(SliderImageBase):
    pass

class SliderImageUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    order: Optional[int] = None

class SliderImageOut(BaseModel):
    id: int
    title: str
    description: str
    image_url: str
    order: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True 