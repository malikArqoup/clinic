import os
import cloudinary
import cloudinary.uploader

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)

def upload_image_to_cloudinary(file, upload_preset="demo_upload"):
    result = cloudinary.uploader.upload(
        file,
        upload_preset=upload_preset,
        resource_type="image"
    )
    return result["secure_url"] 