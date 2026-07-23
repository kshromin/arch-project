#!/usr/bin/env python3
"""Download images from Unsplash via available proxy URLs using urllib."""

import os
import urllib.request
import json
import sys

BASE_DIR = r"C:\Users\user\YandexDisk\САЙТ\site\img"

IMAGES = [
    (
        "https://kimi-web-img.moonshot.cn/img/images.unsplash.com/5bc125e8a13fb7c33e65f9c669785f76161320a2",
        os.path.join("it_new", "hero1.jpg"),
    ),
    (
        "https://kimi-web-img.moonshot.cn/img/images.unsplash.com/03eb1fc85b6ae9fc654ae2adf522852c06065c4c",
        os.path.join("konstr_new", "hero1.jpg"),
    ),
    (
        "https://kimi-web-img.moonshot.cn/img/images.unsplash.com/9936964f87e8bc31696f163038d85bd7a8d4849b",
        os.path.join("konstr_new", "hero2.jpg"),
    ),
]

results = []
errors = []

for url, rel_path in IMAGES:
    out_path = os.path.join(BASE_DIR, rel_path)
    print(f"Downloading: {url}")
    print(f"  -> {out_path}")
    try:
        req = urllib.request.Request(url, headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        })
        with urllib.request.urlopen(req, timeout=60) as response:
            data = response.read()
            with open(out_path, "wb") as f:
                f.write(data)
        size = os.path.getsize(out_path)
        print(f"  OK, size={size} bytes")
        results.append({"url": url, "path": out_path, "size": size, "status": "ok"})
    except Exception as e:
        print(f"  ERROR: {e}")
        errors.append({"url": url, "path": out_path, "error": str(e)})
        results.append({"url": url, "path": out_path, "size": 0, "status": "error", "error": str(e)})

print("\n--- Verification ---")
all_ok = True
for url, rel_path in IMAGES:
    out_path = os.path.join(BASE_DIR, rel_path)
    exists = os.path.exists(out_path)
    size = os.path.getsize(out_path) if exists else 0
    ok = exists and size > 0
    status = "OK" if ok else "FAIL"
    print(f"{status}: {out_path} (exists={exists}, size={size})")
    if not ok:
        all_ok = False

report_path = os.path.join(BASE_DIR, "download_report.json")
with open(report_path, "w", encoding="utf-8") as f:
    json.dump({"success": all_ok, "results": results, "errors": errors}, f, ensure_ascii=False, indent=2)

print(f"\nReport: {report_path}")

if not all_ok:
    sys.exit(1)
