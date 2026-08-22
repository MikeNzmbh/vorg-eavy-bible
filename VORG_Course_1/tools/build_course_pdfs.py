from __future__ import annotations

import csv
import json
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import letter, landscape
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph


ROOT = Path(__file__).resolve().parents[1]
PRESENTATION = ROOT / "presentation/VORG_Course_1_Luxury_Compositing_Taste.pdf"
WORKBOOK = ROOT / "workbook/VORG_Course_1_Workbook.pdf"

STONE = colors.HexColor("#F1EDE5")
INK = colors.HexColor("#111111")
MUTED = colors.HexColor("#68635E")
BURGUNDY = colors.HexColor("#5B1422")
RED = colors.HexColor("#D92D20")
CHROME = colors.HexColor("#A7A9AC")
BLUE = colors.HexColor("#0B2545")
WHITE = colors.white
PALE = colors.HexColor("#DDD6CB")

SLIDE_W, SLIDE_H = 960, 540


def clean(text: str) -> str:
    return (
        text.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
    )


def paragraph(
    c: canvas.Canvas,
    text: str,
    x: float,
    y: float,
    w: float,
    h: float,
    *,
    size: float = 18,
    leading: float | None = None,
    color=INK,
    font: str = "Helvetica",
    bold: bool = False,
    align: int = TA_LEFT,
    link: str | None = None,
) -> None:
    face = "Helvetica-Bold" if bold and font == "Helvetica" else font
    style = ParagraphStyle(
        "box",
        fontName=face,
        fontSize=size,
        leading=leading or size * 1.25,
        textColor=color,
        alignment=align,
        spaceAfter=0,
    )
    body = clean(text).replace("\n", "<br/>")
    if link:
        body = f'<link href="{link}" color="#5B1422"><u>{body}</u></link>'
    p = Paragraph(body, style)
    pw, ph = p.wrap(w, h)
    p.drawOn(c, x, y + h - ph)


def bullet_text(items: Iterable[str]) -> str:
    return "\n".join(f"- {item}" for item in items)


def footer(c: canvas.Canvas, number: int, source: str | None = None) -> None:
    c.setStrokeColor(PALE)
    c.setLineWidth(0.7)
    c.line(44, 32, SLIDE_W - 44, 32)
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 8.5)
    c.drawString(44, 17, "VORG COURSE 1 - PRIVATE EDUCATIONAL MASTER STUDY")
    c.drawRightString(SLIDE_W - 44, 17, f"{number:02d}")
    if source:
        label = source if len(source) < 94 else source[:91] + "..."
        c.setFillColor(BURGUNDY)
        c.setFont("Helvetica", 7.2)
        c.drawCentredString(SLIDE_W / 2, 17, label)
        c.linkURL(source, (240, 10, 720, 29), relative=0)


def slide_base(c: canvas.Canvas, number: int, *, dark: bool = False, source: str | None = None) -> None:
    c.setFillColor(INK if dark else STONE)
    c.rect(0, 0, SLIDE_W, SLIDE_H, fill=1, stroke=0)
    footer(c, number, source)


def title_slide(c: canvas.Canvas, number: int) -> None:
    slide_base(c, number, dark=True)
    c.setFillColor(BURGUNDY)
    c.rect(0, 0, 28, SLIDE_H, fill=1, stroke=0)
    paragraph(c, "VORG COURSE 1", 72, 402, 300, 28, size=13, color=CHROME, bold=True)
    paragraph(c, "Luxury Fashion\nCompositing Taste", 72, 225, 650, 160, size=48, leading=50, color=WHITE, bold=True)
    paragraph(
        c,
        "Master real Jacquemus and Rhode references one image at a time - then build original VORG work.",
        72,
        130,
        620,
        72,
        size=20,
        color=PALE,
    )
    c.setFillColor(RED)
    c.circle(812, 212, 58, fill=1, stroke=0)
    c.setStrokeColor(CHROME)
    c.setLineWidth(6)
    c.line(760, 356, 812, 268)
    c.line(812, 268, 866, 356)
    c.showPage()


def section_slide(c: canvas.Canvas, number: int, index: str, title: str, subtitle: str) -> None:
    slide_base(c, number, dark=True)
    c.setFillColor(BURGUNDY)
    c.rect(0, 0, 280, SLIDE_H, fill=1, stroke=0)
    paragraph(c, index, 54, 342, 170, 100, size=70, color=WHITE, bold=True)
    paragraph(c, title, 340, 250, 540, 140, size=42, leading=45, color=WHITE, bold=True)
    paragraph(c, subtitle, 342, 160, 500, 80, size=19, color=PALE)
    c.showPage()


def text_slide(
    c: canvas.Canvas,
    number: int,
    title: str,
    items: list[str],
    *,
    takeaway: str | None = None,
    source: str | None = None,
    accent=BURGUNDY,
) -> None:
    slide_base(c, number, source=source)
    c.setFillColor(accent)
    c.rect(44, 474, 94, 6, fill=1, stroke=0)
    paragraph(c, title, 44, 390, 770, 76, size=34, leading=37, bold=True)
    if takeaway:
        c.setFillColor(WHITE)
        c.roundRect(44, 305, 872, 62, 12, fill=1, stroke=0)
        paragraph(c, takeaway, 68, 312, 820, 44, size=18, color=accent, bold=True)
        body_y, body_h = 70, 212
    else:
        body_y, body_h = 92, 268
    paragraph(c, bullet_text(items), 70, body_y, 780, body_h, size=19, leading=26, color=INK)
    c.showPage()


def image(c: canvas.Canvas, path: Path, x: float, y: float, w: float, h: float, *, contain: bool = False) -> None:
    reader = ImageReader(str(path))
    iw, ih = reader.getSize()
    scale = min(w / iw, h / ih) if contain else max(w / iw, h / ih)
    dw, dh = iw * scale, ih * scale
    dx, dy = x + (w - dw) / 2, y + (h - dh) / 2
    c.saveState()
    p = c.beginPath()
    p.rect(x, y, w, h)
    c.clipPath(p, stroke=0, fill=0)
    c.drawImage(reader, dx, dy, dw, dh, preserveAspectRatio=True, mask="auto")
    c.restoreState()


def image_slide(
    c: canvas.Canvas,
    number: int,
    title: str,
    path: Path,
    caption: str,
    *,
    source: str | None = None,
    side: str = "right",
) -> None:
    slide_base(c, number, source=source)
    if side == "right":
        image(c, path, 450, 54, 466, 422)
        c.setFillColor(BURGUNDY)
        c.rect(44, 474, 94, 6, fill=1, stroke=0)
        paragraph(c, title, 44, 315, 360, 140, size=33, leading=36, bold=True)
        paragraph(c, caption, 44, 128, 350, 170, size=18, leading=24, color=MUTED)
    else:
        image(c, path, 44, 54, 510, 422)
        c.setFillColor(BURGUNDY)
        c.rect(596, 474, 94, 6, fill=1, stroke=0)
        paragraph(c, title, 596, 315, 320, 140, size=33, leading=36, bold=True)
        paragraph(c, caption, 596, 128, 310, 170, size=18, leading=24, color=MUTED)
    c.showPage()


def compare_slide(
    c: canvas.Canvas,
    number: int,
    title: str,
    left_title: str,
    left_items: list[str],
    right_title: str,
    right_items: list[str],
    takeaway: str,
) -> None:
    slide_base(c, number)
    paragraph(c, title, 44, 418, 820, 60, size=34, bold=True)
    c.setFillColor(WHITE)
    c.roundRect(44, 132, 410, 260, 12, fill=1, stroke=0)
    c.roundRect(506, 132, 410, 260, 12, fill=1, stroke=0)
    paragraph(c, left_title, 70, 335, 350, 36, size=22, color=BURGUNDY, bold=True)
    paragraph(c, bullet_text(left_items), 70, 164, 350, 158, size=16.5, leading=22)
    paragraph(c, right_title, 532, 335, 350, 36, size=22, color=BLUE, bold=True)
    paragraph(c, bullet_text(right_items), 532, 164, 350, 158, size=16.5, leading=22)
    paragraph(c, takeaway, 84, 65, 792, 42, size=17, align=TA_CENTER, bold=True)
    c.showPage()


def study_teardown(c: canvas.Canvas, number: int, study: dict, analysis: list[str]) -> None:
    brand_dir = "jacquemus" if str(study["id"]).startswith("J") else "rhode"
    folder = ROOT / f"references/{brand_dir}/studies/{study['id']}"
    slide_base(c, number, source=str(study["page_url"]))
    paragraph(c, f"{study['id']} - reduce the image before rebuilding it", 44, 456, 850, 40, size=29, bold=True)
    labels = ["ORIGINAL", "GRAYSCALE", "BLURRED READ", "VALUE GROUPS"]
    files = ["original.jpg", "grayscale.jpg", "blurred.jpg", "value-groups.jpg"]
    for idx, (label, file_name) in enumerate(zip(labels, files)):
        x = 44 + idx * 222
        image(c, folder / file_name, x, 190, 198, 230)
        paragraph(c, label, x, 164, 198, 20, size=10, color=MUTED, bold=True, align=TA_CENTER)
    palette = study.get("palette", [])
    for idx, value in enumerate(palette):
        c.setFillColor(colors.HexColor(value))
        c.rect(44 + idx * 64, 86, 54, 34, fill=1, stroke=0)
    paragraph(c, bullet_text(analysis), 390, 56, 520, 90, size=14.5, leading=19)
    c.showPage()


def study_assignment(c: canvas.Canvas, number: int, study: dict, steps: list[str], target: str) -> None:
    brand_dir = "jacquemus" if str(study["id"]).startswith("J") else "rhode"
    folder = ROOT / f"references/{brand_dir}/studies/{study['id']}"
    slide_base(c, number, source=str(study["page_url"]))
    image(c, folder / "silhouette.jpg", 44, 64, 330, 410)
    paragraph(c, f"Rebuild {study['id']} as a private master study", 418, 394, 490, 72, size=32, leading=35, bold=True)
    paragraph(c, bullet_text(steps), 418, 164, 470, 210, size=17, leading=23)
    c.setFillColor(BURGUNDY)
    c.roundRect(418, 78, 470, 60, 10, fill=1, stroke=0)
    paragraph(c, target, 438, 86, 430, 42, size=16.5, color=WHITE, bold=True)
    c.showPage()


def linked_lessons(c: canvas.Canvas, lessons: list[dict], x: float, y: float, w: float, h: float) -> None:
    if not lessons:
        paragraph(
            c,
            "No new tutorial this week. Work directly from the official references and course worksheets.",
            x,
            y + 24,
            w,
            74,
            size=12.5,
            leading=17,
            color=MUTED,
        )
        return

    current_y = y + h
    visible_lessons = lessons[:2]
    for lesson in visible_lessons:
        title = lesson["title"]
        if len(title) > 64:
            title = title[:61] + "..."
        paragraph(c, title, x, current_y - 28, w, 24, size=12.5, color=BURGUNDY, bold=True, link=lesson["url"])
        meta = f"{lesson['channel']} | {lesson['duration']} | watch {lesson['timestamps']}"
        paragraph(c, meta, x, current_y - 47, w, 17, size=9.5, color=MUTED)
        current_y -= 58
    if len(lessons) > len(visible_lessons):
        paragraph(
            c,
            f"+ {len(lessons) - len(visible_lessons)} more verified lesson(s) in the curriculum CSV",
            x,
            y,
            w,
            18,
            size=9.5,
            color=MUTED,
            bold=True,
        )


def week_slide(
    c: canvas.Canvas,
    number: int,
    week: int,
    title: str,
    outcome: str,
    work: list[str],
    deliverable: str,
    lessons: list[dict],
) -> None:
    slide_base(c, number)
    c.setFillColor(BURGUNDY)
    c.rect(0, 0, 202, SLIDE_H, fill=1, stroke=0)
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 66)
    c.drawString(44, 350, f"W{week}")
    paragraph(c, title, 244, 424, 660, 58, size=33, bold=True)
    paragraph(c, outcome, 244, 356, 640, 54, size=17, color=BURGUNDY, bold=True)
    paragraph(c, bullet_text(work), 244, 160, 370, 180, size=16, leading=21)
    c.setFillColor(WHITE)
    c.roundRect(640, 148, 276, 194, 10, fill=1, stroke=0)
    paragraph(c, "WATCH WITH A JOB", 660, 310, 236, 22, size=11, color=MUTED, bold=True)
    linked_lessons(c, lessons, 660, 170, 236, 132)
    c.setFillColor(INK)
    c.roundRect(244, 72, 672, 60, 10, fill=1, stroke=0)
    deliverable_label = f"Deliverable: {deliverable}"
    deliverable_size = 16.0
    while stringWidth(deliverable_label, "Helvetica-Bold", deliverable_size) > 628 and deliverable_size > 12:
        deliverable_size -= 0.5
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", deliverable_size)
    c.drawString(266, 94, deliverable_label)
    c.showPage()


def load_studies() -> list[dict]:
    return json.loads((ROOT / "references/master_studies.json").read_text(encoding="utf-8"))


def load_lessons() -> list[dict]:
    with (ROOT / "youtube_curriculum/verified_youtube_lessons.csv").open(encoding="utf-8-sig") as handle:
        return list(csv.DictReader(handle))


def build_presentation() -> int:
    PRESENTATION.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(PRESENTATION), pagesize=(SLIDE_W, SLIDE_H), pageCompression=1)
    c.setTitle("VORG Course 1: Luxury Fashion Compositing Taste")
    c.setAuthor("VORG")
    studies = {item["id"]: item for item in load_studies()}
    lessons = load_lessons()
    by_week = {week: [x for x in lessons if x["week"] == f"{week:02d}"] for week in range(1, 9)}
    n = 1

    title_slide(c, n); n += 1
    text_slide(c, n, "The method: exact master studies, not generated substitutes", [
        "Use one official source image at a time.",
        "Reduce it to values, shapes, light, color, and surface clues.",
        "Rebuild privately with real photography, CGI, and retouching.",
        "Compare at thumbnail size and 200 percent before calling it finished.",
        "Keep Jacquemus and Rhode as separate disciplines.",
    ], takeaway="Results come from matching relationships, not copying software settings."); n += 1
    text_slide(c, n, "Eight weeks has one narrow commercial outcome", [
        "Take properly photographed people and products into polished campaign images.",
        "Use Blender only for geometry, reflections, shadows, depth, and set elements.",
        "Use Photoshop and Camera Raw for the still-image composite and final retouch.",
        "Use DaVinci Resolve 21 for Photo-page grading, motion, shot matching, and delivery where useful.",
        "Finish a six-image VORG campaign system, not one lucky image.",
    ], takeaway="You are training a repeatable specialty - fashion compositing - not becoming a generalist."); n += 1
    text_slide(c, n, "Private study has a hard boundary", [
        "Official brand images are reduced-resolution references for criticism and education.",
        "Do not post the replicas as original work, sell them, or use them in VORG advertising.",
        "Do not remove logos, credits, or watermarks.",
        "Credit the source page and retain the manifest entry.",
        "The capstone uses VORG-owned photography and garments only.",
        "Generative images are excluded from the core practice method.",
    ], takeaway="Replicate to learn; create original work to publish."); n += 1
    compare_slide(c, n, "Give each application one clear job", "STILL CAMPAIGNS", [
        "Camera Raw: RAW development and local masks",
        "Photoshop: compositing, retouching, texture, export",
        "Blender: CGI objects, reflections, shadows, passes",
    ], "MOTION / CAMPAIGN SYSTEM", [
        "Resolve 21 Photo: still organization and grading",
        "Resolve Color: scopes, node grades, shot matching",
        "Fusion: motion composite only when motion adds value",
    ], "The fastest workflow is the one that preserves product truth with the fewest handoffs."); n += 1
    text_slide(c, n, "Version baseline checked on 10 July 2026", [
        "Blender 5.1 stable for course exercises; 5.2 was still a release candidate when checked.",
        "Photoshop 27.8 and Camera Raw 18.4.1 terminology.",
        "DaVinci Resolve 21, including the new Photo page.",
        "Interface placement can change; the course teaches decisions and names the current controls.",
        "Re-check official documentation before a production-critical workflow change.",
    ], source="https://www.blackmagicdesign.com/products/davinciresolve"); n += 1
    text_slide(c, n, "The eight-week progression is cumulative", [
        "Week 1: taste, hierarchy, and the master-study method.",
        "Week 2: photography and RAW source discipline.",
        "Week 3: premium shine and reflection design.",
        "Week 4: only the Blender skills that support compositing.",
        "Week 5: Photoshop integration and retouching.",
        "Week 6: color management and campaign consistency.",
        "Week 7: Resolve, motion restraint, and system QA.",
        "Week 8: six-image VORG capstone.",
    ]); n += 1
    text_slide(c, n, "Taste is a chain of controlled decisions", [
        "Notice relationships before details.",
        "Explain why the hierarchy works.",
        "Reproduce the relationship deliberately.",
        "Remove what competes with the subject.",
        "Recognize when texture, light, scale, or color becomes fake.",
        "Translate learned control into original work.",
    ], takeaway="Taste is not a moodboard. It is perception plus repeatable correction."); n += 1
    text_slide(c, n, "Start every teardown with the three-second read", [
        "What lands first?",
        "What is the second visual event?",
        "What is the emotional read before details?",
        "Does the image still work at phone-thumbnail size?",
        "If the answer changes after explanation, the hierarchy is weak.",
    ]); n += 1
    text_slide(c, n, "Hierarchy concentrates contrast where the sale happens", [
        "Name the hero, supporting subject, and negative space.",
        "Locate the sharpest edge and highest local contrast.",
        "Track where saturation is concentrated.",
        "Remove accidental highlights and bright background exits.",
        "Confirm the product is still readable without the caption.",
    ]); n += 1
    text_slide(c, n, "Composition is controlled visual weight", [
        "Map center, thirds, symmetry, and deliberate imbalance.",
        "Trace the largest three shapes before tracing details.",
        "Check crop pressure around hands, face, garment edges, and props.",
        "Use foreground, middle ground, and background to create depth.",
        "Flip the image to expose hidden imbalance and tangencies.",
    ]); n += 1
    text_slide(c, n, "Estimate the camera before opening Blender", [
        "Horizon placement reveals camera height.",
        "Parallel-line convergence reveals perspective strength.",
        "Compression suggests focal length but does not prove it.",
        "Subject scale depends on distance as much as focal length.",
        "Label estimates as estimates until camera metadata or on-set records confirm them.",
    ]); n += 1
    text_slide(c, n, "Light is read through shadows and highlight shape", [
        "Estimate key direction, source size, softness, and height.",
        "Separate fill from environmental bounce.",
        "Read the shadow edge before the shadow darkness.",
        "The highlight shape reveals the light or reflected card.",
        "All inserted objects must share the same light logic.",
    ]); n += 1
    text_slide(c, n, "Surface language comes from gradients, edges, and microtexture", [
        "Matte surfaces show broad tonal change with weak highlights.",
        "Gloss surfaces show the environment with controlled roughness.",
        "Metal has no diffuse shortcut - it is reflection design.",
        "Denim needs fiber and fold direction, not generic noise.",
        "Skin needs pores and local variation after retouching.",
    ]); n += 1
    text_slide(c, n, "Color discipline protects hierarchy", [
        "Name dominant, supporting, and accent hues.",
        "Control saturation by priority, not globally.",
        "Protect natural skin relationships.",
        "Watch black-point behavior in denim and chrome.",
        "Keep white garments dimensional through edge and highlight control.",
    ]); n += 1
    text_slide(c, n, "Retouching is successful when the image stays physical", [
        "Preserve skin pores and garment texture.",
        "Clean dust without sterilizing the surface.",
        "Correct geometry without changing the product.",
        "Dodge and burn form; do not paint generic shine.",
        "Match grain after scale, blur, and color are already correct.",
    ], takeaway="Product truth has veto power over polish."); n += 1
    text_slide(c, n, "Seven fast tests catch most taste failures", [
        "Thumbnail: does the idea survive at phone size?",
        "Squint: do three value groups remain clear?",
        "Grayscale: does color hide weak structure?",
        "Mirror: does balance collapse when flipped?",
        "Distraction: where does the eye go that does not sell?",
        "Shadow: do all elements share one world?",
        "Reality: does the composite hold at 200 percent?",
    ]); n += 1

    section_slide(c, n, "01", "Jacquemus\nmaster studies", "Scale, sun, architecture, silhouette, and immediate visual ideas."); n += 1
    image_slide(c, n, "The Jacquemus reference set is broad, but the drills are narrow", ROOT / "references/jacquemus/studies/J01/original.jpg", "Twenty official references are indexed. Only three become master studies so the work stays deep instead of turning into indiscriminate moodboarding.", source=studies["J01"]["page_url"]); n += 1
    for sid, analysis, steps, target in [
        ("J01", ["First read: white torso, red lower mass, then face.", "Estimated hard sun from camera-left; shadow proves direction.", "Three large fields: sky/water, pale stone, red garment."], ["Shoot a real model in a simple light garment.", "Match camera height and centered silhouette before color.", "Rebuild hard-sun direction and shadow edge.", "Grade sky, stone, skin, white, then red - in that order.", "Do not recreate the exact garment or publish the replica."], "Target: hierarchy and light logic within 10 percent - not identity or wardrobe duplication."),
        ("J02", ["First read: central doorway and distant statue.", "One-point perspective carries the frame.", "Warm wood reflections create depth without clutter."], ["Photograph a hallway or construct a simple Blender corridor.", "Match vanishing point and camera height first.", "Use practical lights as motivated sources.", "Preserve reflective floor gradients and dark edge framing.", "Insert one neutral object only after the empty set matches."], "Target: believable camera match and interior depth before adding a fashion subject."),
        ("J03", ["First read: pale blue silhouette, then burgundy bag.", "The horizon sits low enough to keep the figure dominant.", "Pastel planes separate by hue more than contrast."], ["Shoot a full-length walk with clean garment edges.", "Match horizon and body scale before styling color.", "Keep face and skin neutral while separating sky, sea, and floor.", "Use one contrasting real accessory - not a copied product.", "Compare silhouette and crop at thumbnail size."], "Target: a clean outdoor model frame with one controlled color event."),
    ]:
        study = studies[sid]
        image_slide(c, n, f"{sid} original reference - {study['title']}", ROOT / f"references/jacquemus/studies/{sid}/original.jpg", "Observe for three seconds, then write the first and second visual events before reading the analysis.", source=study["page_url"], side="right"); n += 1
        study_teardown(c, n, study, analysis); n += 1
        study_assignment(c, n, study, steps, target); n += 1
    text_slide(c, n, "Premium shine is designed in the reflected environment", [
        "Choose the highlight shape before changing roughness.",
        "Use large white cards for broad gradients and black cards for edge definition.",
        "Keep highlights below clipping so the material still has form.",
        "Add bevels and microtexture before adding bloom.",
        "A glossy slider cannot repair weak geometry or an empty reflection field.",
    ]); n += 1
    text_slide(c, n, "Surreal scale stays believable when physics stays strict", [
        "Camera perspective and focal length must match the plate.",
        "Contact and cast shadows must agree with the source light.",
        "Reflections must contain the same environment.",
        "Depth of field and grain must match after scaling.",
        "One simple impossible idea is stronger than many unexplained effects.",
    ]); n += 1
    text_slide(c, n, "Jacquemus test: rebuild one relationship exactly", [
        "Choose J01 for hard-sun model discipline.",
        "Choose J02 for camera matching and architectural depth.",
        "Choose J03 for clean color separation and silhouette.",
        "Score against the source - not against how impressive the edit feels.",
        "Below 75: revise. At 85 with no realism errors: keep as a private portfolio study.",
    ], takeaway="Do not combine the three references. Master one problem at a time."); n += 1

    section_slide(c, n, "02", "Rhode\nmaster studies", "Cleanliness, intimacy, wet surfaces, skin truth, and tonal separation."); n += 1
    image_slide(c, n, "Rhode teaches control at close distance", ROOT / "references/rhode/studies/R02/original.jpg", "Twenty official references are indexed across portrait, product, hand, set, and macro work. Three drills isolate portrait light, product cleanliness, and skin detail.", source=studies["R02"]["page_url"], side="left"); n += 1
    for sid, analysis, steps, target in [
        ("R01", ["First read: eyes, then wet lip highlight.", "Warm skin sits against a quiet neutral field.", "Specular points stay small; texture remains visible."], ["Shoot a consented portrait with a large soft source.", "Match crop and eye-line before retouching.", "Balance skin globally, then protect local color variation.", "Dodge and burn form without smoothing pores.", "Match hair black-point and lip highlight separately."], "Target: intimate, polished skin that remains recognizably photographed."),
        ("R02", ["First read: bottle silhouette, then vertical label.", "White-on-white separation comes from edge tone and reflection.", "Water film adds texture without hiding geometry."], ["Photograph one neutral bottle on a pale surface.", "Build edge separation with cards, not an outline effect.", "Retain label and product geometry exactly.", "Add real or photographed moisture only if physically plausible.", "Match highlight roll-off before adding grain."], "Target: product remains accurate while still feeling tactile and hydrated."),
        ("R03", ["First read: eyes, then cheek highlight and lip.", "Soft global light coexists with crisp local speculars.", "Retouch keeps brows, pores, and small asymmetries."], ["Shoot a tight beauty crop with a controlled soft source.", "Create separate skin-tone and specular masks.", "Remove distractions without changing anatomy.", "Use micro dodge-and-burn before any texture separation.", "Review at 100 and 200 percent for synthetic patches."], "Target: dewy rather than greasy; refined rather than plastic."),
    ]:
        study = studies[sid]
        image_slide(c, n, f"{sid} original reference - {study['title']}", ROOT / f"references/rhode/studies/{sid}/original.jpg", "Write the three-second read first. Do not begin with retouching settings.", source=study["page_url"], side="right"); n += 1
        study_teardown(c, n, study, analysis); n += 1
        study_assignment(c, n, study, steps, target); n += 1
    compare_slide(c, n, "Dewy and greasy separate at the highlight map", "DEWY", ["Small controlled speculars", "Broad soft gradients", "Pores and local color remain", "Highlights support facial form"], "GREASY / SYNTHETIC", ["Random hot spots", "Clipped forehead and nose", "Uniform blur under shine", "Highlights ignore facial planes"], "Moisture is not a global effect. It is a local surface and lighting decision."); n += 1
    compare_slide(c, n, "Clean is organized; empty is unresolved", "CLEAN", ["One clear hero", "Quiet supporting texture", "Tonal separation", "Intentional whitespace", "Edge and shadow control"], "EMPTY", ["No secondary event", "Flat background", "Weak depth", "Unmotivated crop", "No tactile information"], "Minimal images still need hierarchy, texture, depth, and commercial function."); n += 1
    text_slide(c, n, "Rhode test: clean the frame without erasing reality", [
        "Choose R01 for portrait hierarchy and natural skin.",
        "Choose R02 for white-on-white product separation.",
        "Choose R03 for macro specular control.",
        "Do not copy product packaging for public work.",
        "Judge skin and product geometry before judging color style.",
    ], takeaway="Do not combine Rhode softness with Jacquemus scale inside the practice drill."); n += 1

    section_slide(c, n, "03", "The technical\nreconstruction", "Capture enough evidence, rebuild only what the image needs, and integrate in layers."); n += 1
    text_slide(c, n, "Shoot for CGI before you need CGI", [
        "RAW original, locked exposure, focal length, camera height, and distance.",
        "Clean plate, gray card, color reference, and light-position photo.",
        "Chrome or reflective reference and a neutral matte sphere when available.",
        "Shadow reference, background plate, focus plates, and extra framing.",
        "Garment detail, wrinkles, hardware, and alternate crops.",
    ]); n += 1
    text_slide(c, n, "Camera match is a constraint problem", [
        "Set image aspect ratio and sensor assumptions.",
        "Align horizon and verticals before matching object scale.",
        "Use known dimensions to anchor real-world scale.",
        "Adjust focal length and camera distance together.",
        "Do not use lens distortion to hide a perspective mismatch.",
    ]); n += 1
    text_slide(c, n, "Lighting reference removes guesswork", [
        "Start with one motivated key matching direction and softness.",
        "Add environment fill and negative fill separately.",
        "Use reflected cards to shape glossy materials.",
        "Check the cast shadow before fine material work.",
        "Render a gray material test before polishing the shader.",
    ]); n += 1
    text_slide(c, n, "Blender scope: only skills that support the composite", [
        "Real-world scale, simple modeling, bevels, normals, and smooth shading.",
        "Cycles, denoising, HDRI, area lights, and transparent film.",
        "Roughness, coat, metallic, transmission, IOR, normal, and bump.",
        "Shadow catcher, object masks, Cryptomatte, and render passes.",
        "OpenEXR when range and pass control justify the extra complexity.",
    ], source="https://docs.blender.org/manual/en/5.1/"); n += 1
    text_slide(c, n, "Real-world scale stabilizes light, bevels, and depth", [
        "Model a measured object, not an eyeballed object.",
        "Use centimeters or meters consistently.",
        "Match bevel radius to the real edge, not the screen zoom.",
        "Depth of field depends on camera, distance, aperture, and scale.",
        "A scale error can masquerade as a material or lighting error.",
    ]); n += 1
    text_slide(c, n, "Geometry earns the highlight before the shader does", [
        "Use enough bevel for a readable edge highlight.",
        "Control normals and shading on broad surfaces.",
        "Avoid mathematically perfect razor edges.",
        "Match silhouette before adding microdetail.",
        "Keep product geometry accurate when the object is real.",
    ]); n += 1
    text_slide(c, n, "Material realism is a three-way interaction", [
        "Object shape controls the path of reflection.",
        "Material parameters control reflection spread and energy.",
        "The environment supplies the reflected image.",
        "Changing roughness alone cannot create a premium highlight.",
        "Test the shader under at least two lighting setups.",
    ]); n += 1
    text_slide(c, n, "Reflection design is product lighting", [
        "Large white cards create broad gradients.",
        "Narrow strips describe curvature and edges.",
        "Black cards create shape through negative reflection.",
        "Curved cards prevent abrupt highlight endings.",
        "The reflected environment must agree with the photographic plate.",
    ]); n += 1
    text_slide(c, n, "Chrome and glass expose every weak decision", [
        "Chrome needs a designed environment because nearly all visible color is reflection.",
        "Glass needs accurate IOR, thickness, transmission, and background interaction.",
        "Avoid perfectly clean surfaces; add controlled microvariation.",
        "Keep caustic and dispersion effects only when the plate supports them.",
        "Check edges against both dark and light backgrounds.",
    ]); n += 1
    text_slide(c, n, "Shadow catchers help, but they do not solve the composite", [
        "Match plane orientation and scale.",
        "Match light direction and softness before shadow density.",
        "Keep ambient contact and cast shadow editable.",
        "Inspect indirect color spill from the CGI object.",
        "Treat inferred floor material and light as estimates until tested.",
    ], source="https://docs.blender.org/manual/en/5.1/render/cycles/object_settings/object_data.html"); n += 1
    text_slide(c, n, "Render passes separate decisions", [
        "Beauty pass for reference, not as the only handoff.",
        "Shadow and ambient/contact information when supported.",
        "Diffuse, glossy, transmission, and emission only when they help diagnose.",
        "Cryptomatte or object/material masks for precise adjustment.",
        "Z or mist data only when depth treatment is justified.",
    ]); n += 1
    text_slide(c, n, "OpenEXR preserves range and pass control", [
        "Use 16-bit half float for most practical compositing.",
        "Keep data passes linear and document the view transform.",
        "Confirm Photoshop or the chosen compositor reads the channels correctly.",
        "Do not add a complex EXR workflow when PNG plus clean masks is sufficient.",
        "Archive render settings with the source scene.",
    ]); n += 1
    text_slide(c, n, "Photoshop layer order should expose the logic", [
        "00_REFERENCE / 01_RAW_BASE / 02_CLEANUP",
        "03_SUBJECT_MASK / 04_CGI_OBJECTS / 05_CONTACT_SHADOWS",
        "06_REFLECTIONS / 07_LIGHT_WRAP / 08_COLOR_INTEGRATION",
        "09_DODGE_BURN / 10_TEXTURE_GRAIN / 11_GLOBAL_GRADE",
        "12_OUTPUT - with source files and linked Smart Objects preserved.",
    ]); n += 1
    text_slide(c, n, "Mask quality is judged at the transition, not the thumbnail", [
        "Use Select Subject as a starting point, not proof.",
        "Refine hair and fabric at the final output scale.",
        "Remove edge contamination from the old background.",
        "Match the source blur before adding light wrap.",
        "Check the mask on black, white, and the final plate.",
    ], source="https://helpx.adobe.com/photoshop/desktop/make-selections/automatic-color-based-selections/improved-select-subject-and-remove-background-results.html"); n += 1
    text_slide(c, n, "Contact shadow and bounced light sell weight", [
        "Separate tight contact, broad cast, and ambient occlusion.",
        "Use the source shadow edge as the softness reference.",
        "Add colored bounce only where nearby surfaces justify it.",
        "Reduce opacity by zooming out, not by guessing at 200 percent.",
        "Check that every shadow points back to a plausible light.",
    ]); n += 1
    text_slide(c, n, "Match depth and grain after geometry and light", [
        "Match focus plane and blur falloff, not one global blur value.",
        "Scale grain with the image, not with the inserted object's original resolution.",
        "Match sharpening halos and edge acuity.",
        "Add grain late and inspect at output size.",
        "If CGI remains too sharp, check geometry and contrast before blur.",
    ]); n += 1
    text_slide(c, n, "Resolve 21 adds a Photo page - use it deliberately", [
        "Photo page: organize, rate, process RAW stills, and apply nondestructive grades.",
        "Color page: scopes, node order, qualifiers, windows, and look development.",
        "Photoshop still leads for detailed layer composites and retouching in this course.",
        "Resolve leads for campaign consistency, motion, shot matching, and delivery.",
        "Do not round-trip stills without a clear color-management plan.",
    ], source="https://www.blackmagicdesign.com/uk/products/davinciresolve/photo"); n += 1

    section_slide(c, n, "04", "Why it\nlooks fake", "Diagnose the first broken physical relationship instead of adding polish."); n += 1
    troubleshooting = [
        ("Perspective mismatch", ["Brain signal: lines and scale imply different cameras.", "Correction: align horizon and vanishing point; then solve lens and distance.", "Mini drill: overlay plate and render at 50 percent opacity."]),
        ("Floating object", ["Brain signal: no tight contact or weight deformation.", "Correction: add contact, cast, and ambient shadow separately.", "Mini drill: remove the object and rebuild only its shadow system."]),
        ("Wrong highlight direction", ["Brain signal: glossy object reflects a light that does not exist in the plate.", "Correction: rebuild the reflected cards and environment.", "Mini drill: gray-shade the object and solve reflection before color."]),
        ("Black and white levels do not share a world", ["Brain signal: inserted blacks clip or whites float above the plate.", "Correction: match neutral balance, toe, shoulder, and local contrast.", "Mini drill: compare on waveform and grayscale."]),
        ("Depth and grain mismatch", ["Brain signal: one element looks cut from a sharper camera.", "Correction: match focus, motion/defocus blur, edge acuity, and grain scale.", "Mini drill: judge at final delivery resolution."]),
        ("Plastic skin or fake water", ["Brain signal: repeated highlights, uniform blur, and impossible droplets.", "Correction: preserve texture and respect gravity, surface tension, and light direction.", "Mini drill: remove the effect until the base photo works again."]),
        ("Over-clean CGI", ["Brain signal: perfect edges and uniform surfaces read as synthetic.", "Correction: add measured bevels, microvariation, and environment-specific reflection.", "Mini drill: compare silhouette and highlight breakup at 200 percent."]),
        ("Product truth failure", ["Brain signal: seams, color, fit, label, or geometry changed.", "Correction: return to the real source and rebuild the mask or object.", "Mini drill: make a side-by-side accuracy checklist before grading."]),
    ]
    for title, items in troubleshooting:
        text_slide(c, n, title, items, takeaway="Fix the physical relationship before adding glow, clarity, or a global look."); n += 1

    section_slide(c, n, "05", "Eight-week\nexecution", "Every week ends in an artifact, a score, and a revision decision."); n += 1
    week_slide(c, n, 1, "Taste and master-study discipline", "Learn to see hierarchy before touching software.", ["Complete 7 daily teardowns.", "Analyze J01, J02, J03, R01, R02, and R03.", "Select one Jacquemus drill to rebuild in Week 2.", "Score references with the same rubric used on your work."], "Week_01_Taste_Library.pdf", by_week[1]); n += 1
    week_slide(c, n, 2, "Photography and RAW source control", "Capture a plate that can survive compositing.", ["Photograph one model and one product in RAW.", "Record focal length, height, distance, and light placement.", "Create clean plate, gray card, and shadow references.", "Develop nondestructively in Camera Raw."], "Week_02_Photography_Test.pdf", by_week[2]); n += 1
    week_slide(c, n, 3, "Premium shine and reflection design", "Make three distinct highlight shapes on one object.", ["Window-light glossy-object test.", "White-card and black-card reflection test.", "Black-denim texture test.", "White-product edge test.", "Label shiny, plastic, and premium-glossy failures."], "Week_03_Shine_Lab.pdf", by_week[3]); n += 1
    week_slide(c, n, 4, "Blender for fashion compositing", "Build only the CGI elements needed by the plate.", ["Match one real camera.", "Build red lacquer, chrome, stone, glass, and wet-floor tests.", "Use real-world scale and measured bevels.", "Render transparent background, masks, and shadow information."], "Blend files + asset library + first composite", by_week[4]); n += 1
    week_slide(c, n, 5, "Photoshop integration and retouching", "Make separate elements feel photographed together.", ["Use the required layer stack.", "Build contact, cast, and ambient shadows.", "Match color, depth, edge contamination, and grain.", "Preserve skin and clothing texture.", "Create a before/after breakdown."], "Week_05_Compositing_Breakdown.psd", by_week[5]); n += 1
    week_slide(c, n, 6, "Color and campaign consistency", "Balance first, look second, match third.", ["Create a neutral balance for three frames.", "Build one restrained look with labeled nodes or layers.", "Protect skin, whites, black denim, and burgundy.", "Use scopes to confirm - not replace - visual judgment.", "Save gallery stills and match notes."], "VORG look-development sheet + node tree", by_week[6]); n += 1
    week_slide(c, n, 7, "Resolve, motion restraint, and system QA", "Use motion and Fusion only when they improve the campaign idea.", ["Bring one still system into Resolve 21.", "Build a 6-second teaser with one controlled motion event.", "Check shot matching, scopes, grain, and highlight roll-off.", "Audit every frame for garment and identity truth.", "Revise anything below 75."], "Week_07_Motion_Consistency_Test.mp4", by_week[7]); n += 1
    week_slide(c, n, 8, "VORG capstone campaign", "Deliver six related images using VORG-owned source material.", ["Model hero with one CGI idea.", "Product-only still life.", "Macro texture image.", "Canadian environmental image.", "Clean commercial image.", "Controlled experimental image."], "Six masters + adaptations + breakdowns", by_week[8]); n += 1
    text_slide(c, n, "The capstone is a six-image system", [
        "1. Model hero: real model, real garment, one CGI element.",
        "2. Product still: garment or scarf treated as an art object.",
        "3. Macro: denim, stitching, hardware, moisture, or skin.",
        "4. Environment: lake, stone, concrete, glass, water, or architecture.",
        "5. Commercial: clear product presentation for site or paid media.",
        "6. Experimental: one controlled surreal idea.",
    ], takeaway="Adapt approved masters to portrait, square, hero, mobile hero, story, poster, and email banner."); n += 1
    text_slide(c, n, "Score every major exercise out of 100", [
        "Composition and hierarchy: 20",
        "Lighting logic: 15",
        "Material realism: 15",
        "Perspective and scale: 15",
        "Shadow and reflection integration: 15",
        "Color discipline: 10",
        "Product truthfulness: 5",
        "VORG originality: 5",
    ], takeaway="Below 75 must be revised. Portfolio-ready starts at 85 with no major realism error."); n += 1
    text_slide(c, n, "Begin Week 1 with J01 - and do not open Blender", [
        "Set a three-second timer and write the first visual event.",
        "Review the grayscale, blurred, and value-group files.",
        "Trace the three largest shapes in the workbook.",
        "Estimate camera height and key-light direction; label both as estimates.",
        "Write what you would remove.",
        "Then repeat with R02 and compare your observation speed - not the styles.",
    ], takeaway="The first result is a sharper eye. Software comes after the visual target is clear."); n += 1
    text_slide(c, n, "Sources and acknowledgements", [
        "Official Jacquemus site and collection pages - 20 indexed references.",
        "Official Rhode site and product pages - 20 indexed references.",
        "Blender 5.1 manual and official Blender channel.",
        "Adobe Photoshop and Camera Raw documentation and Adobe Photoshop channel.",
        "Blackmagic Design Resolve 21 product, Photo, training, and new-features pages.",
        "PiXimperfect, CG Cookie, Blender Guru, Casey Faris, Darren Mostyn, and The Blenderender for selected focused lessons.",
        "Full URLs, access dates, categories, and usage notes live in source_manifest and youtube_curriculum.",
    ], takeaway="All inferred camera and lighting notes are estimates. Brand images remain the property of their respective owners."); n += 1

    c.save()
    count = n - 1
    if count != 85:
        raise RuntimeError(f"Expected 85 slides, built {count}")
    return count


def wb_header(c: canvas.Canvas, page: int, title: str, subtitle: str = "") -> None:
    width, height = letter
    c.setFillColor(STONE)
    c.rect(0, 0, width, height, fill=1, stroke=0)
    c.setFillColor(BURGUNDY)
    c.rect(0, height - 26, width, 26, fill=1, stroke=0)
    paragraph(c, title, 44, height - 112, width - 88, 64, size=24, leading=27, bold=True)
    if subtitle:
        paragraph(c, subtitle, 44, height - 142, width - 88, 28, size=11, color=MUTED)
    c.setStrokeColor(PALE)
    c.line(44, 42, width - 44, 42)
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 8)
    c.drawString(44, 27, "VORG COURSE 1 WORKBOOK - PRIVATE EDUCATIONAL USE")
    c.drawRightString(width - 44, 27, str(page))


def ruled(c: canvas.Canvas, x: float, y: float, w: float, lines: int, gap: float = 24) -> None:
    c.setStrokeColor(PALE)
    for idx in range(lines):
        c.line(x, y - idx * gap, x + w, y - idx * gap)


def label(c: canvas.Canvas, text: str, x: float, y: float, w: float = 500) -> None:
    paragraph(c, text, x, y, w, 20, size=10, color=BURGUNDY, bold=True)


def fields_page(c: canvas.Canvas, page: int, title: str, prompts: list[tuple[str, int]], subtitle: str = "") -> None:
    wb_header(c, page, title, subtitle)
    width, height = letter
    y = height - 180
    for prompt, lines in prompts:
        label(c, prompt, 44, y, width - 88)
        y -= 28
        ruled(c, 44, y, width - 88, lines)
        y -= lines * 24 + 16
    c.showPage()


def checklist_page(c: canvas.Canvas, page: int, title: str, items: list[str], subtitle: str = "") -> None:
    wb_header(c, page, title, subtitle)
    width, height = letter
    y = height - 176
    c.setFont("Helvetica", 11)
    for item in items:
        c.setStrokeColor(BURGUNDY)
        c.rect(48, y - 2, 11, 11, fill=0, stroke=1)
        paragraph(c, item, 70, y - 8, width - 118, 28, size=11.5, leading=14)
        y -= 36
    c.showPage()


def grid_page(c: canvas.Canvas, page: int, title: str, columns: int = 3, rows: int = 3) -> None:
    wb_header(c, page, title, "Use the grid to trace large shapes, horizon, subject axis, and negative space.")
    x, y, w, h = 54, 148, 504, 500
    c.setStrokeColor(INK)
    c.rect(x, y, w, h, fill=0, stroke=1)
    c.setStrokeColor(PALE)
    for col in range(1, columns):
        c.line(x + w * col / columns, y, x + w * col / columns, y + h)
    for row in range(1, rows):
        c.line(x, y + h * row / rows, x + w, y + h * row / rows)
    c.showPage()


def taste_journal(c: canvas.Canvas, page: int, day: int) -> None:
    fields_page(c, page, f"Daily taste journal - Day {day}", [
        ("Source image and URL", 1),
        ("Three-second read: first event / second event / emotion", 2),
        ("Three largest value groups", 2),
        ("Estimated lens, camera height, and key-light direction", 2),
        ("Dominant / supporting / accent color", 2),
        ("One unnecessary element", 1),
        ("Why it feels expensive or cheap", 2),
        ("One original VORG application - not a copied layout", 2),
    ], "Target time: 15-25 minutes. Stop when the observation is clear.")


def build_workbook() -> int:
    WORKBOOK.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(WORKBOOK), pagesize=letter, pageCompression=1)
    c.setTitle("VORG Course 1 Workbook")
    c.setAuthor("VORG")
    page = 1
    wb_header(c, page, "VORG COURSE 1 WORKBOOK", "Luxury Fashion Compositing Taste")
    paragraph(c, "Real-image master studies. Exact observation. Controlled reconstruction. Original VORG capstone.", 44, 440, 500, 150, size=26, leading=31, bold=True)
    c.setFillColor(RED); c.circle(470, 240, 50, fill=1, stroke=0)
    c.showPage(); page += 1
    fields_page(c, page, "How to use this workbook", [("Weekly study hours and fixed practice blocks", 3), ("Software installed and version", 3), ("Storage and backup plan", 3), ("How weekly self-critiques will be saved", 3)]); page += 1
    checklist_page(c, page, "Private master-study rules", ["Use only official, attributed references.", "Keep replicas private and educational.", "Do not remove logos or credits.", "Do not publish a brand replica as VORG work.", "Use VORG-owned photos and products for the capstone.", "Do not use generated imagery as the practice target."]); page += 1
    fields_page(c, page, "Assignment scorecard", [("Composition and hierarchy /20", 2), ("Lighting logic /15", 2), ("Material realism /15", 2), ("Perspective and scale /15", 2), ("Shadow and reflection integration /15", 2), ("Color discipline /10", 2), ("Product truth /5 and VORG originality /5", 2)]); page += 1
    fields_page(c, page, "Full image teardown", [("Three-second read", 3), ("Hierarchy and focal point", 3), ("Composition and shape language", 3), ("Camera estimate", 3), ("Lighting estimate", 3), ("Surface language", 3), ("Color", 3), ("Retouching and commercial function", 3)]); page += 1
    grid_page(c, page, "Composition grid"); page += 1
    grid_page(c, page, "Crop alternatives", columns=4, rows=4); page += 1
    fields_page(c, page, "Lighting map", [("Key direction, size, height, softness", 3), ("Fill and negative fill", 3), ("Shadow density and edge", 3), ("Highlight shape and likely reflected card", 3), ("What is inferred vs. proven", 3)]); page += 1
    fields_page(c, page, "Material analysis", [("Material and expected behavior", 2), ("Diffuse / specular / transmission clues", 3), ("Roughness and coat estimate", 3), ("Microtexture and controlled imperfections", 3), ("How the environment appears in the surface", 3)]); page += 1
    fields_page(c, page, "Color palette exercise", [("Dominant hue", 2), ("Supporting hue", 2), ("Accent hue", 2), ("Skin / product / background relationship", 3), ("Black-point and highlight color", 3), ("What to desaturate first", 2)]); page += 1
    fields_page(c, page, "Camera estimate", [("Aspect ratio and crop", 2), ("Horizon and camera height", 2), ("Estimated focal length and why", 3), ("Camera-to-subject distance", 2), ("Perspective and distortion clues", 3), ("What evidence would confirm the estimate", 2)]); page += 1
    fields_page(c, page, "Photoshop layer plan", [("00-03: reference, RAW, cleanup, mask", 4), ("04-08: CGI, shadows, reflections, light wrap, color", 5), ("09-12: dodge/burn, texture, grade, output", 4), ("Linked files and Smart Objects", 3)]); page += 1
    fields_page(c, page, "Blender scene plan", [("Plate, dimensions, and camera metadata", 3), ("Real-world scale anchors", 3), ("Objects and measured bevels", 3), ("Lights, cards, and environment", 4), ("Passes, masks, and output settings", 3)]); page += 1
    fields_page(c, page, "Resolve node plan", [("Input transform / color management", 3), ("Balance and contrast", 3), ("Skin or product isolation", 3), ("Look and saturation hierarchy", 3), ("Grain, output, and shot match", 3)]); page += 1
    fields_page(c, page, "Shot planning", [("Commercial job and output ratios", 3), ("Hero product and supporting elements", 3), ("Location / background / weather", 3), ("Camera, lens, height, and distance", 3), ("Lighting diagram and references", 3), ("Clean plates and backup shots", 3)]); page += 1
    checklist_page(c, page, "CGI realism checklist", ["Perspective and scale match.", "Contact shadow exists and shares the light.", "Cast-shadow direction and softness match.", "Reflections contain the plate environment.", "Depth of field and edge acuity match.", "Grain scale matches the final output.", "Bevels and normals produce physical highlights.", "Microtexture is controlled.", "Black and white levels share the plate.", "Object survives a 200 percent review."]); page += 1
    checklist_page(c, page, "Product-truth checklist", ["Garment silhouette is unchanged.", "Fit and body relationship are accurate.", "Color matches the approved product.", "Seams, labels, hardware, and texture remain accurate.", "No anatomy or identity change.", "No invented material behavior.", "No misleading water, gloss, or performance claim.", "Before/after comparison is archived."]); page += 1
    fields_page(c, page, "Self-critique", [("Intended visual idea", 2), ("What should be noticed first", 2), ("Reference principle studied", 2), ("What was reconstructed technically", 3), ("What remains visibly fake", 3), ("What a professional art director would remove", 2), ("Product accuracy and VORG originality", 3), ("What changes with two more hours", 2), ("Portfolio-ready? Why or why not?", 2)]); page += 1

    studies = load_studies()
    for study in studies:
        fields_page(c, page, f"Master study {study['id']} - {study['title']}", [("Three-second read", 2), ("Three largest shapes and values", 3), ("Camera and lighting estimate", 3), ("Surface and color clues", 3), ("Rebuild plan", 4), ("What not to copy or publish", 2)], str(study["page_url"])); page += 1

    week_prompts = [
        (1, "Taste library", "Seven teardowns + one chosen master study"),
        (2, "Photography test", "RAW model plate + RAW product plate + reference captures"),
        (3, "Shine lab", "Three highlight shapes + black-denim and white-product tests"),
        (4, "Blender composite", "Camera match + materials + passes + first integration"),
        (5, "Photoshop breakdown", "Layered composite + before/after + realism fixes"),
        (6, "Color consistency", "Three balanced frames + one repeatable look"),
        (7, "Motion and QA", "Six-second teaser + campaign match audit"),
        (8, "Capstone", "Six masters + adaptations + final self-critique"),
    ]
    for week, title, deliverable in week_prompts:
        fields_page(c, page, f"Week {week} - {title}", [("Outcome for this week", 2), ("Daily practice blocks", 4), ("Reference chosen and why", 3), ("Technical risk", 3), ("Deliverable", 3), ("Score and revision decision", 3)], f"Required result: {deliverable}"); page += 1

    for day in range(1, 17):
        taste_journal(c, page, day); page += 1

    checklist_page(c, page, "On-set capture checklist", ["RAW photography.", "Locked exposure where possible.", "Lens and focal length recorded.", "Camera height and distance recorded.", "Clean plate without model.", "Gray card and color reference.", "Chrome or reflective reference when available.", "Matte sphere or neutral object when available.", "Light-placement reference photo.", "Focus plates and background plate.", "Shadow reference and extra framing.", "Garment-detail and wrinkle photos.", "Product close-ups and alternate crops."]); page += 1
    fields_page(c, page, "Capstone six-shot board", [("1. Model hero", 3), ("2. Product still", 3), ("3. Macro texture", 3), ("4. Canadian environment", 3), ("5. Clean commercial", 3), ("6. Controlled experiment", 3)]); page += 1
    fields_page(c, page, "Capstone adaptation matrix", [("Instagram portrait and square", 3), ("Website hero and mobile hero", 3), ("Story and poster", 3), ("Email banner", 3), ("Optional six-second teaser", 3), ("Crop and product-truth risks", 3)]); page += 1
    fields_page(c, page, "Final capstone rubric", [("Composition and hierarchy /20", 2), ("Lighting logic /15", 2), ("Material realism /15", 2), ("Perspective and scale /15", 2), ("Shadow and reflection integration /15", 2), ("Color discipline /10", 2), ("Product truth /5", 2), ("VORG originality /5", 2), ("Required revisions", 3)]); page += 1
    fields_page(c, page, "Final course review", [("Strongest skill gained", 3), ("Weakest visible failure", 3), ("Best master-study lesson", 3), ("What must be repeated before a campaign shoot", 3), ("Which work is private study vs. publishable VORG work", 3), ("Next 30-day practice plan", 4)]); page += 1
    c.save()
    return page - 1


def write_index(slides: int, workbook_pages: int) -> None:
    payload = {
        "title": "VORG Course 1: Luxury Fashion Compositing Taste",
        "method": "Real-image master studies; no generated practice targets",
        "presentation_slides": slides,
        "workbook_pages": workbook_pages,
        "official_reference_images": 40,
        "master_studies": 6,
        "verified_youtube_lessons": 13,
        "checked_date": "2026-07-10",
        "presentation_output": str(PRESENTATION.relative_to(ROOT)).replace("\\", "/"),
        "workbook_output": str(WORKBOOK.relative_to(ROOT)).replace("\\", "/"),
    }
    (ROOT / "presentation/course_build_summary.json").write_text(json.dumps(payload, indent=2), encoding="utf-8")


def main() -> None:
    slides = build_presentation()
    pages = build_workbook()
    write_index(slides, pages)
    print(f"Built {slides}-slide presentation PDF and {pages}-page workbook PDF")


if __name__ == "__main__":
    main()
