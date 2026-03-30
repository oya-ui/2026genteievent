#!/usr/bin/env python3
"""スプレッドシートCSVを取得し、PIIを含まない集計JSONを docs/data/summary.json に書き出す。"""

from __future__ import annotations

import csv
import io
import json
import os
import sys
import urllib.request
from collections import Counter
from datetime import datetime, timezone

SHEET_ID = os.environ.get(
    "SHEET_ID", "1_R6jiYu1qJSFLuo_Cmt4aKjbD2iu8AYX2JE_KAE_3z0"
)
GID = os.environ.get("SHEET_GID", "0")
OUT = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "docs",
    "data",
    "summary.json",
)


def fetch_csv() -> str:
    url = f"https://docs.google.com/spreadsheets/d/{SHEET_ID}/export?format=csv&gid={GID}"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (build-summary)"})
    with urllib.request.urlopen(req, timeout=60) as resp:
        return resp.read().decode("utf-8-sig")


def main() -> None:
    text = fetch_csv()
    f = io.StringIO(text)
    reader = csv.DictReader(f)
    rows = list(reader)

    def cnt(key: str, val: str) -> int:
        return sum(1 for r in rows if (r.get(key) or "").strip() == val)

    def nonempty(key: str) -> int:
        return sum(1 for r in rows if (r.get(key) or "").strip())

    reply_status = Counter(
        ((r.get("返信ステータス") or "未").strip() or "未") for r in rows
    )
    cv_status = Counter(
        ((r.get("CVステータス") or "未").strip() or "未") for r in rows
    )

    summary = {
        "generatedAt": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "sourceSheetId": SHEET_ID,
        "totalRows": len(rows),
        "lineConfirmed": {
            "済": cnt("LINE確認済", "済"),
            "未": cnt("LINE確認済", "未"),
        },
        "tagDone": {
            "済": cnt("タグ設定済", "済"),
            "未": cnt("タグ設定済", "未"),
        },
        "outreachDateFilled": nonempty("訴求送付日"),
        "replyStatus": dict(reply_status),
        "cvStatus": dict(cv_status),
    }

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as fp:
        json.dump(summary, fp, ensure_ascii=False, indent=2)
        fp.write("\n")
    print(f"Wrote {OUT} ({summary['totalRows']} rows)", file=sys.stderr)


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"ERROR: {e}", file=sys.stderr)
        sys.exit(1)
