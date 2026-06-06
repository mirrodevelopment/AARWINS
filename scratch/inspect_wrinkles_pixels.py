from PIL import Image

img_path = r"C:\Users\girit\.gemini\antigravity-ide\brain\c1d1a16b-09cf-4187-9a1a-558236dcf27f\cloth_wrinkles_1780658627782.png"
img = Image.open(img_path).convert("RGBA")
width, height = img.size
print(f"Dimensions: {width}x{height}")

# Print colors of a few pixels from the corners and center
points = [
    (0, 0), (width - 1, 0), (0, height - 1), (width - 1, height - 1),
    (10, 10), (width - 11, 10), (width // 2, height // 2), (width // 2, height // 4)
]

for x, y in points:
    print(f"Pixel ({x}, {y}): {img.getpixel((x, y))}")
