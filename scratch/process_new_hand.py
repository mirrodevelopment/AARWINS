import os
from PIL import Image

src_path = r"C:\Users\girit\.gemini\antigravity-ide\brain\c1d1a16b-09cf-4187-9a1a-558236dcf27f\pulling_hand_backside_1780648180391.png"
dest_path = r"c:\Users\girit\OneDrive\Documents\aarwins\src\main\resources\static\images\pulling-hand.png"

if os.path.exists(src_path):
    print(f"Opening source image: {src_path}")
    img = Image.open(src_path).convert("RGBA")
    width, height = img.size
    print(f"Original dimensions: {width}x{height}")
    
    # If the image is landscape, rotate it to be vertical
    if width > height:
        print("Image is landscape, rotating 90 degrees clockwise (-90 in Pillow)...")
        img = img.rotate(-90, expand=True)
        width, height = img.size
        print(f"New dimensions after rotation: {width}x{height}")
        
    # Key out white/off-white background
    print("Processing pixels for transparency...")
    datas = img.getdata()
    newData = []
    for item in datas:
        # If pixels are white or very light (R, G, B > 235), make them fully transparent
        if item[0] > 235 and item[1] > 235 and item[2] > 235:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)
            
    img.putdata(newData)
    
    # Make sure output directory exists
    os.makedirs(os.path.dirname(dest_path), exist_ok=True)
    img.save(dest_path, "PNG")
    print(f"Successfully saved transparent, vertical PNG to {dest_path}")
else:
    print(f"Error: Source image not found at {src_path}")
