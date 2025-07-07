from sqlalchemy.orm import Session
from ..models.slider_image import SliderImage
from ..schemas.slider_image import SliderImageCreate, SliderImageUpdate

def get_slider_images(db: Session):
    return db.query(SliderImage).order_by(SliderImage.order).all()

def create_slider_image(db: Session, image_url: str, slider_data: SliderImageCreate):
    db_image = SliderImage(
        title=slider_data.title,
        text=slider_data.text,
        image_url=image_url,
        order=slider_data.order,
        is_active=slider_data.is_active
    )
    db.add(db_image)
    db.commit()
    db.refresh(db_image)
    return db_image

def update_slider_image(db: Session, image_id: int, slider_data: SliderImageUpdate):
    db_image = db.query(SliderImage).filter(SliderImage.id == image_id).first()
    if not db_image:
        return None
    for field, value in slider_data.dict(exclude_unset=True).items():
        setattr(db_image, field, value)
    db.commit()
    db.refresh(db_image)
    return db_image

def delete_slider_image(db: Session, image_id: int):
    db_image = db.query(SliderImage).filter(SliderImage.id == image_id).first()
    if not db_image:
        return False
    db.delete(db_image)
    db.commit()
    return True 