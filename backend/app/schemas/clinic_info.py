from pydantic import BaseModel

class ClinicInfoBase(BaseModel):
    name: str
    phone: str
    email: str
    address: str

class ClinicInfoIn(ClinicInfoBase):
    pass

class ClinicInfoOut(ClinicInfoBase):
    id: int
    class Config:
        orm_mode = True 