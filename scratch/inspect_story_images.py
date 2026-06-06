import os
from PIL import Image

image_dir = r"c:\Users\girit\OneDrive\Documents\aarwins\src\main\resources\static\images"
images_to_check = [
    "Story  1.png",
    "Story 2.png",
    "Story Card 1 .png"
]

for filename in images_to_check:
    filepath = os.path.join(image_dir, filename)
    if os.path.exists(filepath):
        img = Image.open(filepath)
        print(f"{filename}: {img.width}x{img.height} pixels (ratio {img.width/img.height:.4f})")
    else:
        print(f"{filename}: Not found at {filepath}")
