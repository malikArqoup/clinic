from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..schemas.clinic_info import ClinicInfoOut, ClinicInfoIn
from ..crud.clinic_info import get_clinic_info, update_clinic_info

router = APIRouter(prefix="/settings/clinic-info", tags=["clinic-info"])

@router.get("/", response_model=ClinicInfoOut)
def read_clinic_info(db: Session = Depends(get_db)):
    info = get_clinic_info(db)
    if not info:
        raise HTTPException(status_code=404, detail="Clinic info not set")
    return info

@router.post("/", response_model=ClinicInfoOut)
def save_clinic_info(data: ClinicInfoIn, db: Session = Depends(get_db)):
    info = update_clinic_info(db, data)
    return info 