from pydantic import BaseModel

class ClinicInfoIn(BaseModel):
    name: str
    phone: str
    email: str
    address: str

class ClinicInfoOut(BaseModel):
    id: int
    name: str
    phone: str
    email: str
    address: str

    class Config:
        from_attributes = True 