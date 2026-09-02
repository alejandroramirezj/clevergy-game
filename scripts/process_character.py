#!/usr/bin/env python3
"""
scripts/process_character.py
Automated character sprite extraction and registration tool for Clevergy Game.
Handles transparent PNGs, baked checkerboard backgrounds, and solid backgrounds.
Extracts: idle, walk, run, jump, attack, death, avatar.png
"""

import sys
import os
import re
from PIL import Image
from collections import deque

def remove_checkerboard_bg(src_im):
    im = src_im.convert("RGBA")
    w, h = im.size
    pix = im.load()

    # Checkerboard test: bright and near-greyscale
    def is_bg(r, g, b):
        return min(r, g, b) >= 210 and (max(r, g, b) - min(r, g, b)) <= 12

    visited = bytearray(w * h)
    queue = deque()

    for x in range(w):
        queue.append((x, 0))
        queue.append((x, h - 1))
    for y in range(h):
        queue.append((0, y))
        queue.append((w - 1, y))

    cleared = 0
    while queue:
        x, y = queue.popleft()
        idx = y * w + x
        if visited[idx]:
            continue
        visited[idx] = 1

        r, g, b, a = pix[x, y]
        if is_bg(r, g, b):
            pix[x, y] = (0, 0, 0, 0)
            cleared += 1
            for nx, ny in ((x+1, y), (x-1, y), (x, y+1), (x, y-1)):
                if 0 <= nx < w and 0 <= ny < h and not visited[ny * w + nx]:
                    queue.append((nx, ny))

    print(f"Background removal: cleared {cleared} pixels ({(cleared/(w*h))*100:.1f}%)")
    return im

def process_character(image_path, char_id, grid_type="auto"):
    print(f"=== Processing Character: {char_id} from {image_path} ===")
    src = Image.open(image_path)
    
    # If not already transparent, clean background
    if src.mode != "RGBA" or src.getextrema()[-1][0] == 255:
        src = remove_checkerboard_bg(src)

    w, h = src.size
    out_dir = f"public/sprites/{char_id}"
    os.makedirs(out_dir, exist_ok=True)

    # Determine layout
    # If h/w ratio is around 768/1024 = 0.75 -> 2x2 grid
    # If h/w ratio is around 682/1024 = 0.66 -> 3x2 grid
    if grid_type == "auto":
        ratio = h / w
        grid_type = "2x2" if ratio > 0.70 else "3x2"

    print(f"Detected grid layout: {grid_type} ({w}x{h})")

    trimmed_poses = {}

    if grid_type == "2x2":
        hw = w // 2
        hh = h // 2
        regions = {
            "idle": (0, 0, hw, hh),
            "jump": (hw, 0, w, hh),
            "attack": (0, hh, hw, h),
            "death": (hw, hh, w, h)
        }
        for name, box in regions.items():
            crop = src.crop(box)
            bbox = crop.getbbox()
            if bbox:
                trimmed_poses[name] = crop.crop(bbox)
        
        # In 2x2, walk and run reuse jump and idle
        trimmed_poses["run"] = trimmed_poses.get("jump")
        trimmed_poses["walk"] = trimmed_poses.get("jump")

    elif grid_type == "3x2":
        hw = w // 3
        hh = h // 2
        regions = {
            "idle": (0, 0, hw, hh),
            "walk": (hw, 0, hw * 2, hh),
            "run": (hw * 2, 0, w, hh),
            "jump": (0, hh, hw, h),
            "attack": (hw, hh, hw * 2, h),
            "death": (hw * 2, hh, w, h)
        }
        for name, box in regions.items():
            crop = src.crop(box)
            bbox = crop.getbbox()
            if bbox:
                trimmed_poses[name] = crop.crop(bbox)

    CANV_W = 560
    CANV_H = 360
    ANCHOR_X = 220

    # Save standardized canvas poses
    for name in ["idle", "walk", "run", "jump", "attack", "death"]:
        t = trimmed_poses.get(name) or trimmed_poses.get("idle")
        tw, th = t.size
        canv = Image.new("RGBA", (CANV_W, CANV_H), (0, 0, 0, 0))
        paste_y = CANV_H - th
        
        # Center estimation:
        if name == "attack":
            # For attack, place body on left of roar/wave
            paste_x = max(0, min(CANV_W - tw, ANCHOR_X - 120))
        elif name == "death":
            paste_x = (CANV_W - tw) // 2
        elif name in ("jump", "run"):
            paste_x = max(0, min(CANV_W - tw, ANCHOR_X - 160))
        else:
            paste_x = max(0, min(CANV_W - tw, ANCHOR_X - (tw // 2)))

        canv.paste(t, (paste_x, paste_y), t)
        canv.save(f"{out_dir}/{name}.png")
        print(f"Saved {out_dir}/{name}.png (size {canv.size})")

    # Generate 80x80 full-body avatar
    idle_t = trimmed_poses["idle"]
    iw, ih = idle_t.size
    scale = 80.0 / max(iw, ih)
    nw, nh = int(round(iw * scale)), int(round(ih * scale))
    idle_scaled = idle_t.resize((nw, nh), Image.Resampling.LANCZOS)
    
    avatar = Image.new("RGBA", (80, 80), (0, 0, 0, 0))
    avatar.paste(idle_scaled, ((80 - nw) // 2, (80 - nh) // 2), idle_scaled)
    avatar.save(f"{out_dir}/avatar.png")
    print(f"Saved {out_dir}/avatar.png (80x80 full body)")

    print(f"=== Character {char_id} extracted successfully! ===")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python3 scripts/process_character.py <image_path> <char_id> [2x2|3x2]")
        sys.exit(1)
    img_path = sys.argv[1]
    char_id = sys.argv[2]
    grid = sys.argv[3] if len(sys.argv) > 3 else "auto"
    process_character(img_path, char_id, grid)
