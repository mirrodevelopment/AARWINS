import os
from PIL import Image

image_path = r"c:\Users\girit\OneDrive\Documents\aarwins\src\main\resources\static\images\pulling-hand.png"

if os.path.exists(image_path):
    print("Image found. Opening...")
    img = Image.open(image_path)
    width, height = img.size
    print(f"Dimensions: {width}x{height}")
    
    # If it's wider than it is tall, it's horizontal, so rotate 90 degrees clockwise
    if width > height:
        print("Rotating image 90 degrees clockwise...")
        rotated_img = img.rotate(-90, expand=True) # -90 is clockwise in Pillow
        rotated_img.save(image_path)
        print("Image rotated and saved successfully.")
    else:
        print("Image is already vertical or square. No rotation needed.")
else:
    print("Error: Image not found.")
