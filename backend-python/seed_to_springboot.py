#!/usr/bin/env python3
"""
Seed script: Reads output.jsonl and POSTs each place to Spring Boot at localhost:8082/place.
Maps JSONL fields to Spring Boot expected format and provides sensible defaults for nulls.
Run with: python seed_to_springboot.py
"""

import json
import requests
import sys
import io
from pathlib import Path

# Fix Windows console encoding for Arabic / special characters
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

JSONL_PATH = Path(__file__).parent / "app" / "dataset_filtering" / "output.jsonl"
SPRING_BOOT_URL = "http://localhost:8082/place"


def map_record(raw: dict) -> dict:
    """Map a raw JSONL record to the shape Spring Boot POST /place expects."""
    loc = raw.get("location") or {}
    sched = raw.get("schedule")

    return {
        "name": raw.get("name") or "Unnamed Place",
        "description": raw.get("description") or "No description available.",
        "category": raw.get("category") or "other",
        "city": raw.get("city") or "Unknown",
        "imageURL": raw.get("image") or "https://placehold.co/400x300?text=No+Image",
        "location": {
            "latitude": loc.get("latitude") if loc.get("latitude") is not None else 0.0,
            "longitude": loc.get("longitude") if loc.get("longitude") is not None else 0.0,
            "addressDetails": loc.get("addressDetails") or None,
        },
        "rate": raw.get("rate") if raw.get("rate") is not None else 0.0,
        "schedule": {
            "date": sched.get("date") if sched and sched.get("date") else None,
            "startAt": sched.get("startAt") if sched and sched.get("startAt") else None,
            "endAt": sched.get("endAt") if sched and sched.get("endAt") else None,
        } if sched else None,
    }


def seed():
    if not JSONL_PATH.exists():
        print(f"[ERROR] File not found: {JSONL_PATH}")
        sys.exit(1)

    total = 0
    success = 0
    failed = 0

    with open(JSONL_PATH, "r", encoding="utf-8") as f:
        for line_num, line in enumerate(f, start=1):
            line = line.strip()
            if not line:
                continue

            total += 1
            try:
                raw = json.loads(line)
            except json.JSONDecodeError as e:
                print(f"[LINE {line_num}] SKIP — invalid JSON: {e}")
                failed += 1
                continue

            payload = map_record(raw)

            try:
                resp = requests.post(
                    SPRING_BOOT_URL,
                    json=payload,
                    headers={"Content-Type": "application/json"},
                    timeout=10,
                )
            except requests.exceptions.ConnectionError:
                print(f"[LINE {line_num}] FAILED — cannot connect to {SPRING_BOOT_URL}. Is Spring Boot running?")
                failed += 1
                continue
            except requests.exceptions.Timeout:
                print(f"[LINE {line_num}] FAILED — request timed out")
                failed += 1
                continue

            if resp.status_code in (200, 201):
                print(f"[LINE {line_num}] OK — place '{payload['name']}' created (id={resp.json().get('id', 'N/A')})")
                success += 1
            else:
                print(f"[LINE {line_num}] FAILED — HTTP {resp.status_code} for '{payload['name']}'")
                try:
                    print(f"           Response: {resp.json()}")
                except Exception:
                    print(f"           Response: {resp.text[:200]}")
                failed += 1

    print("\n" + "=" * 50)
    print(f"Total records processed: {total}")
    print(f"Successfully created:   {success}")
    print(f"Failed:                 {failed}")
    print("=" * 50)


if __name__ == "__main__":
    seed()
