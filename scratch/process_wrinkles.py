import os
from PIL import Image, ImageFilter
from collections import deque

src_path = r"C:\Users\girit\.gemini\antigravity-ide\brain\c1d1a16b-09cf-4187-9a1a-558236dcf27f\cloth_wrinkles_1780658627782.png"
dest_path = r"c:\Users\girit\OneDrive\Documents\aarwins\src\main\resources\static\images\cloth-wrinkles.png"

img = Image.open(src_path).convert("RGBA")
width, height = img.size

visited = set()
queue = deque()
bg_pixels = set()

# Seeds: outer boundaries (top, bottom, left, right)
seeds = []
# Corners
seeds.extend([(0, 0), (width - 1, 0), (0, height - 1), (width - 1, height - 1)])

# Add border pixels to seeds
for y in range(0, height, 10):
    seeds.append((0, y))
    seeds.append((width - 1, y))
for x in range(0, width, 10):
    # Only seed top edge near the corners, leave center-top (where the folds pinch) unseeded
    if x < width * 0.3 or x > width * 0.7:
        seeds.append((x, 0))
    seeds.append((x, height - 1))

# Initialize queue with valid seeds
for pt in seeds:
    p = img.getpixel(pt)
    diff = max(p[0], p[1], p[2]) - min(p[0], p[1], p[2])
    # Background criteria: light (>190) and highly desaturated (diff <= 12)
    if p[0] > 190 and p[1] > 190 and p[2] > 190 and diff <= 12:
        if pt not in visited:
            queue.append(pt)
            visited.add(pt)

# BFS directions
dx = [-1, 1, 0, 0]
dy = [0, 0, -1, 1]

print("Starting BFS background identification...")
while queue:
    curr = queue.popleft()
    bg_pixels.add(curr)
    
    cx, cy = curr
    for i in range(4):
        nx, ny = cx + dx[i], cy + dy[i]
        if 0 <= nx < width and 0 <= ny < height:
            if (nx, ny) not in visited:
                p = img.getpixel((nx, ny))
                diff = max(p[0], p[1], p[2]) - min(p[0], p[1], p[2])
                
                # Check if it looks like background
                if p[0] > 190 and p[1] > 190 and p[2] > 190 and diff <= 12:
                    visited.add((nx, ny))
                    queue.append((nx, ny))

print(f"Identified {len(bg_pixels)} background pixels out of {width * height}")

# Create transparency mask (alpha channel)
# 255 for fabric, 0 for background
alpha_mask = Image.new("L", (width, height), 255)
for x, y in bg_pixels:
    alpha_mask.putpixel((x, y), 0)

# Soften/feather the alpha mask to prevent sharp cut-off edges
print("Feathering edges...")
feathered_alpha = alpha_mask.filter(ImageFilter.GaussianBlur(radius=8))

# Assemble the final RGBA image
r, g, b, _ = img.split()
final_img = Image.merge("RGBA", (r, g, b, feathered_alpha))

# Save the final transparent asset
os.makedirs(os.path.dirname(dest_path), exist_ok=True)
final_img.save(dest_path, "PNG")
print(f"Successfully saved feathered cloth wrinkles image to {dest_path}")

# Also copy to target folder for hot-reload
target_dest = r"c:\Users\girit\OneDrive\Documents\aarwins\target\classes\static\images\cloth-wrinkles.png"
if os.path.exists(os.path.dirname(target_dest)):
    final_img.save(target_dest, "PNG")
    print(f"Successfully saved to target folder: {target_dest}")
