from PIL import Image

img_path = r"C:\Users\girit\.gemini\antigravity-ide\brain\c1d1a16b-09cf-4187-9a1a-558236dcf27f\pulling_hand_backside_1780648180391.png"
img = Image.open(img_path).convert("RGBA")
width, height = img.size

# Let's sample a grid in the center
for y in range(int(height * 0.3), int(height * 0.7), int(height * 0.1)):
    for x in range(int(width * 0.4), int(width * 0.6), int(width * 0.05)):
        p = img.getpixel((x, y))
        # Print if it's not close to gray
        diff = max(p[0], p[1], p[2]) - min(p[0], p[1], p[2])
        print(f"Center pixel ({x}, {y}): {p} | Diff: {diff}")
