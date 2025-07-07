from sqlalchemy.orm import Session
from ..models.clinic_info import ClinicInfo
from ..schemas.clinic_info import ClinicInfoIn

def get_clinic_info(db: Session):
    return db.query(ClinicInfo).first()

def update_clinic_info(db: Session, info: ClinicInfoIn):
    clinic_info = db.query(ClinicInfo).first()
    if not clinic_info:
        clinic_info = ClinicInfo(**info.dict())
        db.add(clinic_info)
    else:
        clinic_info.name = info.name
        clinic_info.phone = info.phone
        clinic_info.email = info.email
        clinic_info.address = info.address
    db.commit()
    db.refresh(clinic_info)
    return clinic_info 