from __future__ import annotations

import json
from pathlib import Path

from PIL import Image, ImageFilter, ImageOps


ROOT = Path(__file__).resolve().parents[1]

STUDIES = [
    {
        "id": "J01",
        "brand": "Jacquemus",
        "title": "Le Bonheur - white/red look",
        "source": ROOT
        / "references/jacquemus/official/0-JACQUEMUS-LEBONHEUR-COVER-WOMEN-WHITEREDLOOK.avif",
        "page_url": "https://www.jacquemus.com/en_us/%22le-bonheur%22/lebonheur.html",
    },
    {
        "id": "J02",
        "brand": "Jacquemus",
        "title": "La Croisiere - architectural set",
        "source": ROOT
        / "references/jacquemus/official/0-JACQUEMUS_LACROISIERE_SET_3.webp",
        "page_url": "https://www.jacquemus.com/en_us/collections/collections-jacquemus-page.html",
    },
    {
        "id": "J03",
        "brand": "Jacquemus",
        "title": "La Casa - model and architecture",
        "source": ROOT
        / "references/jacquemus/official/Jacquemus-La-Casa-Look-4x5-05-NO-LOGO.avif",
        "page_url": "https://www.jacquemus.com/en_us/collections/collections-jacquemus-page.html",
    },
    {
        "id": "R01",
        "brand": "Rhode",
        "title": "Glazing Milk - hero study",
        "source": ROOT
        / "references/rhode/official/milk-Hero-1_Desktop_2000x.webp",
        "page_url": "https://www.rhodeskin.com/products/glazing-milk",
    },
    {
        "id": "R02",
        "brand": "Rhode",
        "title": "Glazing Milk - clean still life",
        "source": ROOT
        / "references/rhode/official/glazing-milk-hero-desktop-final_1_2000x.webp",
        "page_url": "https://www.rhodeskin.com/products/glazing-milk",
    },
    {
        "id": "R03",
        "brand": "Rhode",
        "title": "Highlight Milk - skin/product crop",
        "source": ROOT
        / "references/rhode/official/highlight-milk-1-hover_2000x.webp",
        "page_url": "https://www.rhodeskin.com/products/highlight-milk-02",
    },
]


def fit_rgb(path: Path, max_edge: int = 1600) -> Image.Image:
    image = Image.open(path)
    image = ImageOps.exif_transpose(image).convert("RGB")
    image.thumbnail((max_edge, max_edge), Image.Resampling.LANCZOS)
    return image


def palette(image: Image.Image, count: int = 5) -> list[str]:
    sample = image.copy()
    sample.thumbnail((240, 240), Image.Resampling.LANCZOS)
    quantized = sample.quantize(colors=count, method=Image.Quantize.MEDIANCUT)
    colors = quantized.getpalette()[: count * 3]
    counts = sorted(quantized.getcolors() or [], reverse=True)
    result: list[str] = []
    for _, index in counts[:count]:
        r, g, b = colors[index * 3 : index * 3 + 3]
        result.append(f"#{r:02X}{g:02X}{b:02X}")
    return result


def prepare(study: dict[str, object]) -> dict[str, object]:
    study_id = str(study["id"])
    out = ROOT / "references" / ("jacquemus" if study_id.startswith("J") else "rhode") / "studies" / study_id
    out.mkdir(parents=True, exist_ok=True)
    image = fit_rgb(Path(study["source"]))

    image.save(out / "original.jpg", quality=90, optimize=True, progressive=True)
    grayscale = ImageOps.grayscale(image)
    grayscale.save(out / "grayscale.jpg", quality=88, optimize=True, progressive=True)
    grayscale.filter(ImageFilter.GaussianBlur(radius=max(8, min(image.size) // 45))).save(
        out / "blurred.jpg", quality=86, optimize=True, progressive=True
    )
    ImageOps.posterize(grayscale.convert("RGB"), bits=2).save(
        out / "value-groups.jpg", quality=88, optimize=True, progressive=True
    )
    threshold = grayscale.point(lambda value: 255 if value >= 128 else 0)
    threshold.save(out / "silhouette.jpg", quality=90, optimize=True, progressive=True)

    metadata = {
        "id": study_id,
        "brand": study["brand"],
        "title": study["title"],
        "source_file": str(Path(study["source"]).relative_to(ROOT)).replace("\\", "/"),
        "page_url": study["page_url"],
        "access_date": "2026-07-10",
        "palette": palette(image),
        "dimensions": {"width": image.width, "height": image.height},
        "notice": "Private educational master study. Source image belongs to the named brand/source.",
    }
    (out / "study.json").write_text(json.dumps(metadata, indent=2), encoding="utf-8")
    return metadata


def main() -> None:
    results = [prepare(study) for study in STUDIES]
    (ROOT / "references/master_studies.json").write_text(
        json.dumps(results, indent=2), encoding="utf-8"
    )
    print(f"Prepared {len(results)} master studies")


if __name__ == "__main__":
    main()
