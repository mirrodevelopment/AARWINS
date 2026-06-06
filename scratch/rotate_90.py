import os
from PIL import Image

image_path = r"c:\Users\girit\OneDrive\Documents\aarwins\src\main\resources\static\images\pulling-hand.png"

if os.path.exists(image_path):
    img = Image.open(image_path)
    # Rotate 90 degrees clockwise (using ROTATE_270 in PIL terms, which rotates 270 counterclockwise = 90 clockwise)
    rotated_img = img.transpose(Image.ROTATE_270)
    rotated_img.save(image_path)
    print("Image rotated 90 degrees clockwise and saved successfully.")
else:
    print("Error: Image not found.")
