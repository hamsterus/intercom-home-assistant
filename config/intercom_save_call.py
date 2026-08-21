#!/usr/bin/env python3
import json
import os
import sys

FILE = "/config/www/intercom/call_history.json"

def main():
    if len(sys.argv) < 8:
        print("Not enough arguments")
        return
    call = {
        "id": sys.argv[1],
        "time": sys.argv[2],
        "timestamp": sys.argv[3],
        "device": sys.argv[4],
        "name": sys.argv[5],
        "status": sys.argv[6],
        "photo": sys.argv[7],
    }
    history = []
    if os.path.exists(FILE):
        try:
            with open(FILE, "r", encoding="utf-8") as f:
                history = json.load(f)
        except Exception:
            history = []
    history.insert(0, call)
    history = history[:100]
    os.makedirs(os.path.dirname(FILE), exist_ok=True)
    with open(FILE, "w", encoding="utf-8") as f:
        json.dump(history, f, ensure_ascii=False, indent=2)
    print("Saved intercom call:", call["id"])

if __name__ == "__main__":
    main()
