from pydantic import BaseModel
from datetime import datetime

class SliderImageBase(BaseModel):
    title: str
    text: str | None = None
    order: int = 0
    is_active: bool = True

class SliderImageCreate(SliderImageBase):
    pass

class SliderImageUpdate(SliderImageBase):
    pass

class SliderImageOut(SliderImageBase):
    id: int
    image_url: str
    created_at: datetime

    class Config:
        orm_mode = True 