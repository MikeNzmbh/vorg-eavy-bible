from __future__ import annotations

import csv
import html
import json
import re
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]

LESSONS = [
    {
        "id": "RDbrOpnIY7Q",
        "difficulty": "Beginner",
        "timestamps": "0:00-6:43",
        "learn": "Read key, fill, and rim as separate jobs; observe shadow direction.",
        "skip": "Nothing; the lesson is concise.",
        "exercise": "Rebuild the setup with one neutral object and label each light's job.",
        "week": "03",
    },
    {
        "id": "ENnEYoUpFfU",
        "difficulty": "Beginner/Intermediate",
        "timestamps": "0:00-12:00; 20:00-36:00",
        "learn": "Shape light deliberately; control contrast, size, distance, and reflections.",
        "skip": "Skip workflow digressions not tied to the Week 3 object.",
        "exercise": "Make hard-sun, broad-soft, and narrow-strip versions of one object.",
        "week": "03",
    },
    {
        "id": "yPekIQMoKYM",
        "difficulty": "Intermediate",
        "timestamps": "0:00-16:41",
        "learn": "Treat product lighting as reflection design, not exposure correction.",
        "skip": "Do not copy settings; copy the decision sequence.",
        "exercise": "Photograph or render one glossy object with two white cards and one black card.",
        "week": "03",
    },
    {
        "id": "iIgHZm2-eh4",
        "difficulty": "Beginner",
        "timestamps": "0:00-13:17",
        "learn": "Connect Principled material controls to what the light reveals.",
        "skip": "Skip unrelated interface shortcuts after the material is working.",
        "exercise": "Build matte plaster, lacquer, chrome, and glass spheres at real scale.",
        "week": "04",
    },
    {
        "id": "XZcp9L73rZo",
        "difficulty": "Beginner/Intermediate",
        "timestamps": "0:00-12:00; 18:00-29:41",
        "learn": "Use Camera Raw masks for local tonal control without flattening the source.",
        "skip": "Skip examples that do not affect product, skin, or background separation.",
        "exercise": "Create separate subject, garment, background, and highlight masks on one RAW file.",
        "week": "02",
    },
    {
        "id": "SoWefQNcIyY",
        "difficulty": "Intermediate",
        "timestamps": "0:00-11:57",
        "learn": "Match color relationships with measurable corrections instead of visual guessing.",
        "skip": "Do not treat a one-click result as final; inspect skin and neutrals.",
        "exercise": "Match a neutral product plate to a chosen master-study background.",
        "week": "05",
    },
    {
        "id": "Da4axkDKzxQ",
        "difficulty": "Intermediate",
        "timestamps": "0:00-14:00; 20:00-34:00",
        "learn": "Build contact, cast, and ambient shadows as distinct layers.",
        "skip": "Skip theatrical effects that do not improve physical integration.",
        "exercise": "Composite one simple CGI object and build three shadow layers from scratch.",
        "week": "05",
    },
    {
        "id": "CTAzjAReZvs",
        "difficulty": "Intermediate",
        "timestamps": "0:00-12:00; 18:00-31:30",
        "learn": "Understand project color management and why input/output transforms matter.",
        "skip": "Skip camera formats you do not use; retain the transform logic.",
        "exercise": "Document the input, timeline, and output color spaces for one campaign test.",
        "week": "06",
    },
    {
        "id": "OrEcXbET1Y4",
        "difficulty": "Beginner/Intermediate",
        "timestamps": "0:00-25:00; 52:00-1:18:00",
        "learn": "Read scopes, set neutral balance, and build a disciplined node order.",
        "skip": "Skip panel-hardware sections if working with mouse and keyboard.",
        "exercise": "Balance three stills or clips before adding any creative look.",
        "week": "06",
    },
    {
        "id": "8kJwFcsa6k4",
        "difficulty": "Beginner",
        "timestamps": "0:00-14:22",
        "learn": "Use serial and parallel nodes as explicit decisions, not decoration.",
        "skip": "Nothing; the lesson is directly relevant.",
        "exercise": "Build a six-node VORG still grade and label the job of each node.",
        "week": "06",
    },
    {
        "id": "IwqucXqb2zY",
        "difficulty": "Intermediate",
        "timestamps": "0:00-11:44",
        "learn": "Use waveform, parade, vectorscope, and histogram to confirm visual judgments.",
        "skip": "Do not chase legal broadcast levels for a web-only exercise; learn the readings.",
        "exercise": "Save scope screenshots before and after balancing a skin/product frame.",
        "week": "06",
    },
    {
        "id": "mJf1-Ilgis8",
        "difficulty": "Beginner",
        "timestamps": "0:00-18:00; 30:00-48:00",
        "learn": "Understand when Fusion's node compositor is useful for motion assets.",
        "skip": "Skip motion-graphics branches not needed for the capstone teaser.",
        "exercise": "Build a simple tracked mask and one restrained motion composite.",
        "week": "07",
    },
    {
        "id": "uhPnAdZNkIA",
        "difficulty": "Intermediate",
        "timestamps": "0:00-22:00; 38:00-55:00",
        "learn": "Apply masks, transforms, merge order, and edge integration in Fusion.",
        "skip": "Skip techniques already completed more efficiently in the still Photoshop exercise.",
        "exercise": "Recreate one still composite as a 6-second moving shot only if motion adds value.",
        "week": "07",
    },
]


def fetch(lesson: dict[str, str]) -> dict[str, str]:
    video_id = lesson["id"]
    url = f"https://www.youtube.com/watch?v={video_id}"
    request = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            page = response.read().decode("utf-8", errors="replace")
            status = str(response.status)
    except Exception as exc:  # verification result must remain explicit
        return {**lesson, "url": url, "status": f"ERROR: {exc}"}

    def match(pattern: str) -> str:
        result = re.search(pattern, page)
        return html.unescape(result.group(1)) if result else ""

    seconds = int(match(r'"lengthSeconds":"(\d+)"') or 0)
    duration = f"{seconds // 3600}:{(seconds % 3600) // 60:02d}:{seconds % 60:02d}" if seconds >= 3600 else f"{seconds // 60}:{seconds % 60:02d}"
    title = match(r'<meta name="title" content="([^"]+)"') or match(r'"title":"([^"]+)"')
    channel = match(r'<link itemprop="name" content="([^"]+)"') or match(r'"ownerChannelName":"([^"]+)"')
    published = match(r'"publishDate":"(\d{4}-\d{2}-\d{2})') or match(r'"uploadDate":"(\d{4}-\d{2}-\d{2})')
    return {
        **lesson,
        "title": title,
        "channel": channel,
        "url": url,
        "publication_date": published,
        "duration": duration,
        "status": status,
        "checked_date": "2026-07-10",
    }


def main() -> None:
    with ThreadPoolExecutor(max_workers=6) as pool:
        rows = list(pool.map(fetch, LESSONS))
    output = ROOT / "youtube_curriculum/verified_youtube_lessons.csv"
    fields = [
        "week",
        "title",
        "channel",
        "url",
        "publication_date",
        "duration",
        "difficulty",
        "timestamps",
        "learn",
        "skip",
        "exercise",
        "status",
        "checked_date",
    ]
    with output.open("w", newline="", encoding="utf-8-sig") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields)
        writer.writeheader()
        writer.writerows({key: row.get(key, "") for key in fields} for row in rows)
    errors = [row for row in rows if row.get("status") != "200"]
    print(f"Verified {len(rows) - len(errors)}/{len(rows)} YouTube lessons")
    if errors:
        print(json.dumps(errors, indent=2))


if __name__ == "__main__":
    main()
