import os
from PIL import Image
from collections import deque

src_path = r"C:\Users\girit\.gemini\antigravity-ide\brain\c1d1a16b-09cf-4187-9a1a-558236dcf27f\pulling_hand_backside_1780648180391.png"
dest_path = r"c:\Users\girit\OneDrive\Documents\aarwins\src\main\resources\static\images\pulling-hand.png"

img = Image.open(src_path).convert("RGBA")
width, height = img.size

# We want to identify background pixels using BFS starting from the corners/edges
visited = set()
queue = deque()

# Seeds: corners and along the edges
seeds = []
# Corners
seeds.extend([(0, 0), (width - 1, 0), (0, height - 1), (width - 1, height - 1)])

# Add points along the left, right, and bottom edges
for y in range(0, height, 10):
    seeds.append((0, y))
    seeds.append((width - 1, y))
for x in range(0, width, 10):
    seeds.append((x, height - 1))
    # Seed top edge near corners, avoiding the arm in the middle (approx 35% to 65% width)
    if x < width * 0.35 or x > width * 0.65:
        seeds.append((x, 0))

# Initialize queue with valid seeds
for pt in seeds:
    p = img.getpixel(pt)
    diff = max(p[0], p[1], p[2]) - min(p[0], p[1], p[2])
    # Check if seed color looks like background: R,G,B > 200 and diff <= 25
    if p[0] > 200 and p[1] > 200 and p[2] > 200 and diff <= 25:
        if pt not in visited:
            queue.append(pt)
            visited.add(pt)

# BFS to find all background pixels
dx = [-1, 1, 0, 0]
dy = [0, 0, -1, 1]

print(f"Starting BFS from {len(queue)} seeds...")
bg_pixels = set()

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
                
                # Background criteria:
                # - Light (all channels > 200)
                # - Desaturated (diff <= 25)
                # - Or if it is extremely light (all > 235), allow slightly more diff
                is_bg = False
                if p[0] > 200 and p[1] > 200 and p[2] > 200 and diff <= 25:
                    is_bg = True
                elif p[0] > 235 and p[1] > 235 and p[2] > 235 and diff <= 30:
                    is_bg = True
                
                if is_bg:
                    visited.add((nx, ny))
                    queue.append((nx, ny))

print(f"Found {len(bg_pixels)} background pixels out of {width * height}")

# Create new image data
data = list(img.getdata())
new_data = []
for idx in range(width * height):
    y = idx // width
    x = idx % width
    if (x, y) in bg_pixels:
        new_data.append((255, 255, 255, 0))
    else:
        new_data.append(data[idx])

img.putdata(new_data)

# Save the processed image to src resources
os.makedirs(os.path.dirname(dest_path), exist_ok=True)
img.save(dest_path, "PNG")
print(f"Successfully saved transparent image to: {dest_path}")

# Save the processed image to target folder for hot-reload
target_dest = r"c:\Users\girit\OneDrive\Documents\aarwins\target\classes\static\images\pulling-hand.png"
if os.path.exists(os.path.dirname(target_dest)):
    img.save(target_dest, "PNG")
    print(f"Successfully saved transparent image to target folder: {target_dest}")
