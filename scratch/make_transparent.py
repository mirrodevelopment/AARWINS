import os
from PIL import Image

image_path = r"c:\Users\girit\OneDrive\Documents\aarwins\src\main\resources\static\images\pulling-hand.png"

if os.path.exists(image_path):
    print("Opening image to key out background...")
    img = Image.open(image_path).convert("RGBA")
    datas = img.getdata()
    
    newData = []
    for item in datas:
        # If the pixel is close to white (RGB values all greater than 240), make it transparent
        if item[0] > 240 and item[1] > 240 and item[2] > 240:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)
            
    img.putdata(newData)
    img.save(image_path, "PNG")
    print("Background keyed out and transparent PNG saved successfully.")
else:
    print("Error: Image not found.")
