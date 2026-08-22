from __future__ import annotations

import csv
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def row(
    brand: str,
    name: str,
    local_file: str,
    source_page: str,
    category: str,
    reason: str,
    principles: str,
) -> dict[str, str]:
    return {
        "brand": brand,
        "campaign_or_product": name,
        "source_page_url": source_page,
        "access_date": "2026-07-10",
        "image_category": category,
        "reason_included": reason,
        "visual_principles": principles,
        "local_reference_file": local_file,
        "usage_note": "Reduced-resolution private educational reference; do not republish or use commercially.",
    }


J_PAGE = "https://www.jacquemus.com/en_us/%22le-bonheur%22/lebonheur.html"
J_ARCHIVE = "https://www.jacquemus.com/en_us/collections/collections-jacquemus-page.html"
R_SHOP = "https://www.rhodeskin.com/collections/shop"
R_MILK = "https://www.rhodeskin.com/products/glazing-milk"

ROWS = [
    row("Jacquemus", "Le Bonheur cover", "references/jacquemus/official/0-JACQUEMUS-LEBONHEUR-COVER-SHOW-2.webp", J_PAGE, "show cover", "Immediate scale and environmental read.", "sunlight; negative space; landscape; strong silhouette"),
    row("Jacquemus", "Le Bonheur rack", "references/jacquemus/official/0-JACQUEMUS-LEBONHEUR-RACK.avif", J_PAGE, "set detail", "Shows restraint and physical texture without a conventional hero.", "repetition; textile movement; warm natural light"),
    row("Jacquemus", "Le Bonheur white/red look", "references/jacquemus/official/0-JACQUEMUS-LEBONHEUR-COVER-WOMEN-WHITEREDLOOK.avif", J_PAGE, "model hero", "Primary hard-sun composition master study.", "centrality; hard shadow; bold red; sea/stone separation"),
    row("Jacquemus", "Le Bonheur boat", "references/jacquemus/official/0-JACQUEMUS-LEBOHNEUR-BOAT.jpg", J_PAGE, "environmental", "Demonstrates scale and a simple surreal read grounded in place.", "wide scale; water; negative space; high-angle camera"),
    row("Jacquemus", "Le Bonheur look 01", "references/jacquemus/official/0-JACQUEMUS-LE-BONHEUR-FRONT-LOOK-01.avif", J_PAGE, "model", "Useful for silhouette and clothing-truth analysis.", "frontal pose; controlled background; color separation"),
    row("Jacquemus", "Le Bonheur look 02", "references/jacquemus/official/0-JACQUEMUS-LE-BONHEUR-FRONT-LOOK-02.avif", J_PAGE, "model", "Second pose/crop comparison within one visual world.", "series consistency; horizon; garment shape"),
    row("Jacquemus", "Le Bonheur look 03", "references/jacquemus/official/0-JACQUEMUS-LE-BONHEUR-FRONT-LOOK-03.avif", J_PAGE, "model", "Tests how a single campaign preserves hierarchy across garments.", "palette discipline; natural skin; clean outline"),
    row("Jacquemus", "Le Bonheur key look", "references/jacquemus/official/0-JACQUEMUS-LE-BONHEUR-KEY-LOOK-4.avif", J_PAGE, "model hero", "Adds a second hero-level comparison.", "pose; scale; sunlight; environmental depth"),
    row("Jacquemus", "Le Palmier cover", "references/jacquemus/official/0-JACQUEMUS-LEPALMIER-COVER-VIDEOLOOK.avif", J_ARCHIVE, "campaign cover", "Broadens the campaign reference set beyond one location.", "editorial crop; architecture; tonal control"),
    row("Jacquemus", "Le Paysan poster", "references/jacquemus/official/0-JACQUEMUS-POSTER-SHOWLEPAYSAN_2.avif", J_ARCHIVE, "show poster", "Shows instant concept communication at thumbnail size.", "surreal prop; immediate idea; shape language"),
    row("Jacquemus", "La Croisiere poster", "references/jacquemus/official/0-JACQUEMUS-POSTER-SHOW_LACROISIERE_2.avif", J_ARCHIVE, "show poster", "Useful for controlled interior geometry.", "symmetry; architectural lines; warm material field"),
    row("Jacquemus", "La Casa poster", "references/jacquemus/official/0-JACQUEMUS-POSTER-SHOW-LACASA.avif", J_ARCHIVE, "show poster", "Contrasts monumental setting against minimal typography.", "aerial scale; stone; water; text placement"),
    row("Jacquemus", "Les Sculptures poster", "references/jacquemus/official/0-JACQUEMUS-POSTER-SHOW-LESCULPTURES.avif", J_ARCHIVE, "show poster", "Demonstrates sculpture as visual support rather than decoration.", "object/figure tension; stone; geometric rhythm"),
    row("Jacquemus", "Le Chouchou poster", "references/jacquemus/official/0-JACQUEMUS-POSTER-SHOW-LECHOUCHOU.avif", J_ARCHIVE, "show poster", "Strong example of fashion scale in a recognizable site.", "long perspective; repetition; saturated accent"),
    row("Jacquemus", "Le Raphia poster", "references/jacquemus/official/0-JACQUEMUS-POSTER-SHOW-LERAPHIA.avif", J_ARCHIVE, "show poster", "Useful for suspended material and controlled visual noise.", "movement; texture; atmospheric depth"),
    row("Jacquemus", "Le Papier poster", "references/jacquemus/official/0-JACQUEMUS-POSTER-SHOW-LEPAPIER.avif", J_ARCHIVE, "show poster", "Teaches hard-shadow legibility in a pale environment.", "hard sun; scale; warm neutral palette"),
    row("Jacquemus", "Le Splash poster", "references/jacquemus/official/0-JACQUEMUS-POSTER-SHOW-LESPLASH.avif", J_ARCHIVE, "show poster", "Adds wet surface and tropical color behavior.", "water; saturation restraint; distant scale"),
    row("Jacquemus", "La Montagne poster", "references/jacquemus/official/0-JACQUEMUS-POSTER-SHOW-LAMONTAGNE.webp", J_ARCHIVE, "show poster", "Shows figures and color at landscape scale.", "negative space; horizon; grouped silhouettes"),
    row("Jacquemus", "La Croisiere architectural set", "references/jacquemus/official/0-JACQUEMUS_LACROISIERE_SET_3.webp", J_ARCHIVE, "set/environment", "Primary camera-match and architectural-light master study.", "one-point perspective; practical lights; reflective wood"),
    row("Jacquemus", "La Casa model look", "references/jacquemus/official/Jacquemus-La-Casa-Look-4x5-05-NO-LOGO.avif", J_ARCHIVE, "model hero", "Primary clean sunlit model master study.", "minimal horizon; pastel separation; centered movement"),
    row("Rhode", "Summer collection hero", "references/rhode/official/collection-page-summer-desktop_2000x.webp", R_SHOP, "campaign hero", "Shows current brand-level composition and product clarity.", "clean hierarchy; warm neutral; controlled skin"),
    row("Rhode", "Eye prep collection hero", "references/rhode/official/collection-page-eye-prep_d88d0dcd-dcec-48e7-a7a3-6bfe30798130_2000x.webp", R_SHOP, "campaign hero", "Useful for macro beauty framing.", "tight crop; tonal harmony; eye/skin detail"),
    row("Rhode", "Highlight Milk product card", "references/rhode/official/highlight-milk-1-product-card_2000x.webp", R_SHOP, "product still", "Clear baseline for commercial product accuracy.", "soft neutral; readable shape; clean edge"),
    row("Rhode", "Highlight Milk hover", "references/rhode/official/highlight-milk-1-hover_2000x.webp", R_SHOP, "skin macro", "Primary dewy-skin master study.", "controlled specular; pore retention; macro crop"),
    row("Rhode", "Soft Glam set product card", "references/rhode/official/soft-glam-set-product-card_2000x.webp", R_SHOP, "product grouping", "Tests grouping without clutter.", "repetition; tonal palette; product hierarchy"),
    row("Rhode", "Soft Glam set hover", "references/rhode/official/soft-glam-set-hover_2000x.webp", R_SHOP, "model/product", "Connects finished makeup to the product set.", "skin/product echo; intimate crop; soft contrast"),
    row("Rhode", "Pocket Brush product card", "references/rhode/official/pocket-brush-product-card_2000x.webp", R_SHOP, "product still", "Simple form useful for edge and material analysis.", "white-on-neutral separation; soft shadow"),
    row("Rhode", "Pocket Brush hover", "references/rhode/official/brush-hover_2000x.webp", R_SHOP, "product in use", "Shows hand/product scale and tactile function.", "hand pose; macro detail; controlled highlights"),
    row("Rhode", "Pocket Bronze product card", "references/rhode/official/bake-product-card_2000x.webp", R_SHOP, "product still", "Useful for warm product against warm background.", "hue separation; soft gradient; geometry"),
    row("Rhode", "Pocket Bronze hover", "references/rhode/official/bake-hover_2000x.webp", R_SHOP, "product in use", "Tests skin/product color relationship.", "tonal warmth; skin truth; tight crop"),
    row("Rhode", "Sun-kissed set product card", "references/rhode/official/sun-kissed-set-product-card_2000x.webp", R_SHOP, "product grouping", "Strong restrained grouping reference.", "overlap; negative space; repeated shapes"),
    row("Rhode", "Sun-kissed set hover", "references/rhode/official/sun-kissed-set-hover_2000x.webp", R_SHOP, "model/product", "Shows commercial clarity inside a campaign crop.", "face/product hierarchy; warm highlights"),
    row("Rhode", "Collection content card", "references/rhode/official/collection-page-content-card-5_1c169020-a71d-4e54-a8b7-3c1c41f2c12c_2000x.webp", R_SHOP, "editorial", "Adds non-grid campaign pacing.", "clean whitespace; restrained prop; texture"),
    row("Rhode", "Lip Case bronze product card", "references/rhode/official/lip-case-bronze-product-card_2000x.webp", R_SHOP, "product still", "Shows unusual product form with clean readability.", "single-object focus; molded surface; soft shadow"),
    row("Rhode", "Lip Case bronze hover", "references/rhode/official/lipcase-bronze-hover_2000x.webp", R_SHOP, "product in context", "Useful for product/hand scale and reflective edges.", "hand crop; gloss control; tonal harmony"),
    row("Rhode", "Snap-on Lip Case product card", "references/rhode/official/snap-on-colada-product-card_2000x.webp", R_SHOP, "product still", "Clean e-commerce presentation for shape matching.", "centered object; restrained color; product truth"),
    row("Rhode", "Snap-on Lip Case hover", "references/rhode/official/snap-on-colada-hover_2000x.webp", R_SHOP, "product in context", "Shows tactile interaction without clutter.", "hand/product relationship; clean background"),
    row("Rhode", "Glazing Milk portrait hero", "references/rhode/official/milk-Hero-1_Desktop_2000x.webp", R_MILK, "campaign portrait", "Primary portrait master study.", "skin texture; soft neutral; controlled specular"),
    row("Rhode", "Glazing Milk product hero", "references/rhode/official/glazing-milk-hero-desktop-final_1_2000x.webp", R_MILK, "wet product still", "Primary clean-product master study.", "white-on-white; water film; edge control"),
    row("Rhode", "Glazing Milk close portrait", "references/rhode/official/milk-hero-4-desktop_2000x.webp", R_MILK, "skin macro", "Second skin reference for comparison and consistency.", "pore retention; soft transitions; highlight placement"),
]


def main() -> None:
    output = ROOT / "source_manifest/source_manifest.csv"
    output.parent.mkdir(parents=True, exist_ok=True)
    with output.open("w", newline="", encoding="utf-8-sig") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(ROWS[0].keys()))
        writer.writeheader()
        writer.writerows(ROWS)
    print(f"Wrote {len(ROWS)} official reference rows")


if __name__ == "__main__":
    main()
