from sqlalchemy import Column, Integer, String
from ..core.database import Base

class ClinicInfo(Base):
    __tablename__ = "clinic_info"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=False)
    email = Column(String(255), nullable=False)
    address = Column(String(255), nullable=False) 