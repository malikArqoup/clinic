import os
import cloudinary
import cloudinary.uploader

# Configure Cloudinary with direct credentials
cloudinary.config(
    cloud_name="dbrut3x1b",
    api_key="324117751933592",
    api_secret="Kg3fbXTZV5ajQV2kwmBrFO3JXek",
    secure=True
)

def upload_image_to_cloudinary(file, upload_preset="ml_default"):
    """
    Upload image to Cloudinary with error handling
    """
    try:
        result = cloudinary.uploader.upload(
            file,
            upload_preset=upload_preset,
            resource_type="image"
        )
        return result["secure_url"]
    except Exception as e:
        print(f"Cloudinary upload error: {e}")
        return None 