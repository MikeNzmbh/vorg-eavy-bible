from __future__ import annotations

import argparse
import json
from pathlib import Path
import re
import urllib.parse
import urllib.request


def walk(value):
    if isinstance(value, dict):
        if "videoRenderer" in value:
            yield value["videoRenderer"]
        for child in value.values():
            yield from walk(child)
    elif isinstance(value, list):
        for child in value:
            yield from walk(child)


def text(runs) -> str:
    return "".join(item.get("text", "") for item in (runs or []))


def search(query: str, limit: int = 10) -> list[dict[str, str]]:
    url = "https://www.youtube.com/results?" + urllib.parse.urlencode({"search_query": query})
    request = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(request, timeout=30) as response:
        html = response.read().decode("utf-8", errors="replace")
    match = re.search(r"var ytInitialData = (\{.*?\});</script>", html)
    if not match:
        raise RuntimeError(f"Could not locate YouTube search data for: {query}")
    data = json.loads(match.group(1))
    results = []
    seen = set()
    for item in walk(data):
        video_id = item.get("videoId")
        if not video_id or video_id in seen:
            continue
        seen.add(video_id)
        results.append(
            {
                "query": query,
                "video_id": video_id,
                "title": text(item.get("title", {}).get("runs")),
                "channel": text(item.get("ownerText", {}).get("runs")),
                "published": item.get("publishedTimeText", {}).get("simpleText", ""),
                "duration": item.get("lengthText", {}).get("simpleText", ""),
                "url": f"https://www.youtube.com/watch?v={video_id}",
            }
        )
        if len(results) >= limit:
            break
    return results


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("query", nargs="+")
    parser.add_argument("--limit", type=int, default=10)
    parser.add_argument("--out")
    args = parser.parse_args()
    payload = json.dumps(search(" ".join(args.query), args.limit), indent=2)
    if args.out:
        Path(args.out).write_text(payload, encoding="utf-8")
    else:
        print(payload)


if __name__ == "__main__":
    main()
