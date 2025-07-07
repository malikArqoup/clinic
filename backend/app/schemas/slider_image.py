from pydantic import BaseModel
from datetime import datetime

class SliderImageBase(BaseModel):
    title: str
    description: str

class SliderImageCreate(SliderImageBase):
    pass

class SliderImageUpdate(SliderImageBase):
    pass

class SliderImageOut(SliderImageBase):
    id: int
    image_url: str

    class Config:
        orm_mode = True 