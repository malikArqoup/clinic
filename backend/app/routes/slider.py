from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from ..core.database import get_db
from ..schemas.slider_image import SliderImageOut
from ..crud.slider_image import get_slider_images

router = APIRouter(prefix="/slider", tags=["slider"])

@router.get("/images", response_model=List[SliderImageOut])
def get_slider_images_public(db: Session = Depends(get_db)):
    """
    Endpoint عام لجلب صور السلايدر (بدون تحقق أدمن)
    """
    return get_slider_images(db) 