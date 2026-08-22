from __future__ import annotations

from pathlib import Path
from typing import Iterable, Sequence

from PIL import Image
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from reportlab.platypus import Paragraph, Table, TableStyle


ROOT = Path(__file__).resolve().parents[2]
ASSET_DIR = ROOT / "launch" / "assets" / "fall-drop-launch-report"
OUTPUT = ROOT / "output" / "pdf" / "VORG_Fall_Drop_Launch_Decision_Report.pdf"

W, H = landscape(A4)
MARGIN_X = 38
TOP = H - 38
BOTTOM = 30

INK = colors.HexColor("#111011")
CREAM = colors.HexColor("#F5F3EE")
PAPER = colors.HexColor("#FBFAF7")
WHITE = colors.HexColor("#FFFFFF")
RED = colors.HexColor("#920F28")
BURGUNDY = colors.HexColor("#6E0F22")
ESPRESSO = colors.HexColor("#4B3323")
MUTED = colors.HexColor("#746F69")
LINE = colors.HexColor("#D9D5CF")
SOFT = colors.HexColor("#EFEAE2")
GREEN = colors.HexColor("#2F604D")
AMBER = colors.HexColor("#A05A12")

DISPLAY = "Times-Bold"
BODY = "Helvetica"
BODY_BOLD = "Helvetica-Bold"


def money(value: float) -> str:
    return f"C${value:,.0f}"


def fit_lines(
    text: str,
    font: str,
    size: float,
    width: float,
    max_lines: int | None = None,
) -> list[str]:
    words = str(text).split()
    if not words:
        return [""]
    lines: list[str] = []
    current = words[0]
    for word in words[1:]:
        trial = current + " " + word
        if stringWidth(trial, font, size) <= width:
            current = trial
        else:
            lines.append(current)
            current = word
    lines.append(current)
    if max_lines and len(lines) > max_lines:
        lines = lines[:max_lines]
        last = lines[-1]
        while last and stringWidth(last + "...", font, size) > width:
            last = last[:-1]
        lines[-1] = last.rstrip() + "..."
    return lines


def wrapped(
    c: canvas.Canvas,
    text: str,
    x: float,
    y: float,
    width: float,
    *,
    font: str = BODY,
    size: float = 9.5,
    leading: float = 12.5,
    colour: colors.Color = INK,
    max_lines: int | None = None,
) -> float:
    c.setFillColor(colour)
    c.setFont(font, size)
    for line in fit_lines(text, font, size, width, max_lines=max_lines):
        c.drawString(x, y, line)
        y -= leading
    return y


def bullets(
    c: canvas.Canvas,
    items: Iterable[str],
    x: float,
    y: float,
    width: float,
    *,
    size: float = 9.2,
    leading: float = 12.2,
    colour: colors.Color = INK,
    gap: float = 4,
) -> float:
    for item in items:
        c.setFillColor(RED)
        c.circle(x + 3, y + 3, 2.2, fill=1, stroke=0)
        y = wrapped(
            c,
            item,
            x + 14,
            y,
            width - 14,
            font=BODY,
            size=size,
            leading=leading,
            colour=colour,
        )
        y -= gap
    return y


def section_label(c: canvas.Canvas, text: str, *, dark: bool = False) -> None:
    c.setFillColor(RED if not dark else colors.HexColor("#D43A52"))
    c.setFont(BODY_BOLD, 8.5)
    c.drawString(MARGIN_X, H - 34, text.upper())


def footer(c: canvas.Canvas, page: int, *, dark: bool = False) -> None:
    colour = colors.HexColor("#8B8680") if not dark else colors.HexColor("#8A8585")
    c.setStrokeColor(colour)
    c.setLineWidth(0.5)
    c.line(MARGIN_X, 26, W - MARGIN_X, 26)
    c.setFillColor(colour)
    c.setFont(BODY_BOLD, 6.4)
    c.drawString(MARGIN_X, 16, "VORG / FALL DROP / LAUNCH DECISION REPORT")
    c.drawRightString(W - MARGIN_X, 16, f"{page:02d}")


def page_base(
    c: canvas.Canvas,
    page: int,
    label: str,
    *,
    dark: bool = False,
    paper: colors.Color | None = None,
) -> None:
    c.setFillColor(INK if dark else (paper or PAPER))
    c.rect(0, 0, W, H, fill=1, stroke=0)
    section_label(c, label, dark=dark)
    footer(c, page, dark=dark)


def page_title(
    c: canvas.Canvas,
    title: str,
    subtitle: str | None = None,
    *,
    x: float = MARGIN_X,
    y: float = H - 74,
    width: float = W - 2 * MARGIN_X,
    dark: bool = False,
    size: float = 29,
) -> float:
    colour = WHITE if dark else INK
    y = wrapped(c, title, x, y, width, font=DISPLAY, size=size, leading=size * 1.02, colour=colour)
    if subtitle:
        y -= 6
        y = wrapped(c, subtitle, x, y, width, font=BODY, size=10.2, leading=13, colour=MUTED)
    return y


def crop_image(
    c: canvas.Canvas,
    path: Path,
    x: float,
    y: float,
    width: float,
    height: float,
    *,
    focus_x: float = 0.5,
    focus_y: float = 0.5,
) -> None:
    with Image.open(path) as im:
        iw, ih = im.size
    scale = max(width / iw, height / ih)
    draw_w = iw * scale
    draw_h = ih * scale
    dx = x - (draw_w - width) * focus_x
    dy = y - (draw_h - height) * focus_y
    c.saveState()
    clip = c.beginPath()
    clip.rect(x, y, width, height)
    c.clipPath(clip, stroke=0, fill=0)
    c.drawImage(ImageReader(str(path)), dx, dy, draw_w, draw_h, preserveAspectRatio=True, mask="auto")
    c.restoreState()


def card(
    c: canvas.Canvas,
    x: float,
    y: float,
    width: float,
    height: float,
    *,
    fill: colors.Color = WHITE,
    stroke: colors.Color | None = None,
    radius: float = 8,
) -> None:
    c.setFillColor(fill)
    if stroke:
        c.setStrokeColor(stroke)
        c.setLineWidth(0.6)
    else:
        c.setStrokeColor(fill)
    c.roundRect(x, y, width, height, radius, fill=1, stroke=1 if stroke else 0)


def metric_card(
    c: canvas.Canvas,
    x: float,
    y: float,
    width: float,
    height: float,
    value: str,
    label: str,
    *,
    value_colour: colors.Color = INK,
    fill: colors.Color = SOFT,
    note: str | None = None,
) -> None:
    card(c, x, y, width, height, fill=fill)
    c.setFillColor(value_colour)
    c.setFont(DISPLAY, 22)
    c.drawString(x + 14, y + height - 30, value)
    c.setFillColor(MUTED)
    c.setFont(BODY_BOLD, 6.7)
    c.drawString(x + 14, y + 15, label.upper())
    if note:
        wrapped(c, note, x + 14, y + height - 46, width - 28, size=7.1, leading=9, colour=MUTED, max_lines=2)


CELL = ParagraphStyle(
    "cell",
    fontName=BODY,
    fontSize=7.4,
    leading=9.2,
    textColor=INK,
    alignment=TA_LEFT,
    spaceAfter=0,
    spaceBefore=0,
)
CELL_BOLD = ParagraphStyle(
    "cell_bold",
    parent=CELL,
    fontName=BODY_BOLD,
)
CELL_HEAD = ParagraphStyle(
    "cell_head",
    parent=CELL,
    fontName=BODY_BOLD,
    fontSize=6.4,
    leading=8,
    textColor=WHITE,
)


def P(value: object, *, bold: bool = False, head: bool = False) -> Paragraph:
    style = CELL_HEAD if head else (CELL_BOLD if bold else CELL)
    return Paragraph(str(value), style)


def draw_table(
    c: canvas.Canvas,
    rows: Sequence[Sequence[object]],
    x: float,
    top: float,
    col_widths: Sequence[float],
    *,
    header: bool = True,
    font_size: float | None = None,
    row_padding: float = 7,
    zebra: bool = True,
    total_rows: set[int] | None = None,
) -> float:
    data: list[list[Paragraph]] = []
    for ri, row in enumerate(rows):
        data.append([P(v, head=(header and ri == 0), bold=(total_rows is not None and ri in total_rows)) for v in row])
    if font_size:
        for ri, row in enumerate(data):
            for cell_obj in row:
                cell_obj.style = ParagraphStyle(
                    f"table_{font_size}_{ri}",
                    parent=(CELL_HEAD if header and ri == 0 else CELL),
                    fontName=BODY_BOLD if (header and ri == 0) or (total_rows and ri in total_rows) else BODY,
                    fontSize=font_size if not (header and ri == 0) else max(5.8, font_size - 0.6),
                    leading=font_size * 1.25,
                    textColor=WHITE if header and ri == 0 else INK,
                )
    table = Table(data, colWidths=list(col_widths), hAlign="LEFT")
    style_commands = [
        ("BACKGROUND", (0, 0), (-1, 0), INK if header else WHITE),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), row_padding),
        ("RIGHTPADDING", (0, 0), (-1, -1), row_padding),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("LINEBELOW", (0, 0), (-1, -1), 0.3, LINE),
    ]
    if zebra:
        start = 1 if header else 0
        for ri in range(start, len(rows)):
            if (ri - start) % 2 == 0:
                style_commands.append(("BACKGROUND", (0, ri), (-1, ri), WHITE))
            else:
                style_commands.append(("BACKGROUND", (0, ri), (-1, ri), colors.HexColor("#F4F1EC")))
    if total_rows:
        for ri in total_rows:
            style_commands.append(("BACKGROUND", (0, ri), (-1, ri), SOFT))
            style_commands.append(("LINEABOVE", (0, ri), (-1, ri), 0.8, INK))
    table.setStyle(TableStyle(style_commands))
    _, height = table.wrapOn(c, sum(col_widths), H)
    table.drawOn(c, x, top - height)
    return top - height


def draw_numbered_step(
    c: canvas.Canvas,
    number: int,
    title: str,
    body: str,
    x: float,
    y: float,
    width: float,
    *,
    dark: bool = False,
) -> float:
    circle_colour = RED
    c.setFillColor(circle_colour)
    c.circle(x + 13, y - 1, 13, fill=1, stroke=0)
    c.setFillColor(WHITE)
    c.setFont(BODY_BOLD, 9)
    c.drawCentredString(x + 13, y - 4, str(number))
    title_colour = WHITE if dark else INK
    c.setFillColor(title_colour)
    c.setFont(BODY_BOLD, 9)
    c.drawString(x + 38, y + 1, title.upper())
    new_y = wrapped(c, body, x + 38, y - 15, width - 38, size=8.4, leading=10.5, colour=MUTED)
    return new_y - 9


def page_01(c: canvas.Canvas) -> None:
    crop_image(c, ASSET_DIR / "campaign-burgundy.jpg", W * 0.48, 0, W * 0.52, H, focus_x=0.53, focus_y=0.48)
    c.setFillColor(CREAM)
    c.rect(0, 0, W * 0.52, H, fill=1, stroke=0)
    c.setFillColor(RED)
    c.roundRect(46, H - 82, 136, 18, 9, fill=1, stroke=0)
    c.setFillColor(WHITE)
    c.setFont(BODY_BOLD, 6.8)
    c.drawCentredString(114, H - 76, "CORRECTED ECOMMERCE STRESS TEST")
    c.setFillColor(INK)
    c.setFont(DISPLAY, 34)
    c.drawString(46, H - 138, "VORG")
    c.drawString(46, H - 176, "FALL DROP")
    c.drawString(46, H - 214, "LAUNCH DECISION")
    c.setFillColor(RED)
    c.rect(46, H - 240, 54, 3, fill=1, stroke=0)
    wrapped(
        c,
        "A five-product proof buy built around real orders, controlled variants, contribution margin, and a vendor-backed November gate.",
        46,
        H - 272,
        W * 0.39,
        font=BODY,
        size=12,
        leading=16,
        colour=INK,
    )
    c.setFillColor(MUTED)
    c.setFont(BODY_BOLD, 7.2)
    c.drawString(46, 58, "PREPARED 21 JULY 2026 / CAD WORKING MODEL")
    c.setFont(BODY, 6.8)
    c.drawString(46, 43, "Concept visuals only. Samples and vendor evidence control production truth.")
    c.showPage()


def page_02(c: canvas.Canvas) -> None:
    page_base(c, 1, "01 / EXECUTIVE DECISION")
    y = page_title(c, "November, conditionally.", "The report supports proof work. It does not authorize bulk production.")
    metric_card(c, 38, 317, 238, 102, "HOLD BULK", "CURRENT SPEND AUTHORITY", value_colour=RED)
    metric_card(c, 293, 317, 238, 102, "NOV 5-12", "WORKING LAUNCH WINDOW", value_colour=GREEN)
    metric_card(c, 548, 317, 256, 102, "OCTOBER: NO", "UNLESS PP SAMPLES + CALENDAR CLEAR", value_colour=AMBER)

    card(c, 38, 73, 372, 214, fill=WHITE)
    c.setFillColor(RED)
    c.setFont(BODY_BOLD, 8)
    c.drawString(55, 263, "WHAT MAY MOVE NOW")
    bullets(
        c,
        [
            "Supplier RFQs, landed quotes, MOQs, lead times, and sample requests.",
            "Separate women's and men's denim fitting and measurement work.",
            "Physical-sample campaign proof, price testing, and size/colour selections.",
            "Shopify build, policies, analytics, checkout QA, and pop-up planning.",
        ],
        54,
        239,
        334,
        size=8.6,
        leading=11.1,
    )

    card(c, 428, 73, 376, 214, fill=INK)
    c.setFillColor(colors.HexColor("#D43A52"))
    c.setFont(BODY_BOLD, 8)
    c.drawString(445, 263, "WHAT REMAINS BLOCKED")
    bullets(
        c,
        [
            "Bulk production without PP samples, quotes, and price-revealed demand receipts.",
            "A one-block unisex jean shortcut or a second jacket colour in the first buy.",
            "A public launch date without inbound confidence and a meaningful QC buffer.",
            "Customer-facing use of concept images as if they prove the real product.",
        ],
        444,
        239,
        338,
        size=8.6,
        leading=11.1,
        colour=WHITE,
    )
    c.showPage()


def page_03(c: canvas.Canvas) -> None:
    page_base(c, 2, "02 / CORRECTIONS")
    y = page_title(c, "What changed - and why it matters", "The old deck looked disciplined while hiding demand, variant, and cash risk.")
    rows = [
        ["ISSUE", "OLD POSITION", "CORRECTED POSITION"],
        ["Unit count", "165 units", "The table contained 155. The new proof buy contains 126."],
        ["Product taxonomy", "Four families called five products", "Five product lines: jacket, women's denim, men's denim, top, scarf."],
        ["Denim fit", "One unisex block", "Separate women's and men's blocks; one wash each."],
        ["Colour depth", "Two colours across every family", "One production colour for jacket and top; two scarves only."],
        ["Demand logic", "Global category revenue", "Orders, sessions, channel coverage, size/colour selections, and receipts."],
        ["Margin", "66.2% product GM", "69.2% product GM plus fees, leakage, cash recovery, and reserves."],
        ["Launch date", "Fall / October implied", "Early November only after vendor-backed calendar and proof gates."],
        ["Ecommerce", "Outfit as conversion unit", "Outfits merchandise; PDP, fit confidence, checkout, and policy convert."],
        ["Evidence page", "Clipped sources and mixed relevance", "Readable ledger with current operational sources and truth labels."],
    ]
    draw_table(c, rows, 38, y - 18, [120, 245, 400], font_size=7.7, row_padding=8)
    c.showPage()


def page_04(c: canvas.Canvas) -> None:
    page_base(c, 3, "03 / CORRECTED ASSORTMENT")
    y = page_title(c, "Five product lines. Six colour SKUs.", "Working assumptions only. Vendor quotes, samples, and demand evidence still control the buy.")
    rows = [
        ["PRODUCT", "COLOUR / WASH", "UNITS", "LANDED", "RETAIL", "REVENUE", "GM", "GATE"],
        ["The Firm Jacket", "void black / navy-black", "12", "C$85", "C$249", "C$2,988", "65.9%", "one colour; price proof"],
        ["Women's low-rise denim", "one approved wash", "24", "C$38", "C$128", "C$3,072", "70.3%", "women's block"],
        ["Men's denim", "one approved wash", "20", "C$38", "C$128", "C$2,560", "70.3%", "men's block"],
        ["Women's long-sleeve", "black", "30", "C$18", "C$68", "C$2,040", "73.5%", "white sample-only"],
        ["Scarves", "espresso 26 / burgundy 14", "40", "C$12", "C$35", "C$1,400", "65.7%", "label + fibre proof"],
        ["TOTAL", "6 colour SKUs", "126", "", "", "C$12,060", "69.2%", "C$3,712 buy"],
    ]
    table_bottom = draw_table(c, rows, 38, y - 10, [135, 138, 42, 58, 58, 70, 48, 180], font_size=6.8, total_rows={6})
    images_y = 47
    image_w = 180
    image_h = min(110, table_bottom - images_y - 12)
    if image_h > 58:
        for i, (name, label) in enumerate(
            [
                ("jacket-black-front.jpg", "HERO"),
                ("denim-concept.jpg", "TWO FITS / ONE WASH EACH"),
                ("top-black.jpg", "SOCIAL / BLACK BULK"),
                ("scarf-burgundy.jpg", "ENTRY / TWO COLOURS"),
            ]
        ):
            x = 38 + i * 193
            crop_image(c, ASSET_DIR / name, x, images_y, image_w, image_h, focus_y=0.45)
            c.setFillColor(INK)
            c.rect(x, images_y, image_w, 16, fill=1, stroke=0)
            c.setFillColor(WHITE)
            c.setFont(BODY_BOLD, 6.2)
            c.drawString(x + 6, images_y + 5.5, label)
    c.showPage()


def page_05(c: canvas.Canvas) -> None:
    page_base(c, 4, "04 / VARIANT CONTROL", dark=True)
    y = page_title(c, "Do not buy colours. Buy evidence.", "The size curve is a cash decision, not a styling preference.", dark=True)
    metric_card(c, 38, 335, 226, 92, "22", "PLANNED SELLABLE VARIANTS", value_colour=WHITE, fill=colors.HexColor("#242122"))
    metric_card(c, 282, 335, 226, 92, "5.7", "AVERAGE UNITS PER VARIANT", value_colour=WHITE, fill=colors.HexColor("#242122"))
    metric_card(c, 526, 335, 278, 92, "1 WASH / FIT", "DENIM COMPLEXITY RULE", value_colour=colors.HexColor("#D43A52"), fill=colors.HexColor("#242122"))

    rows = [
        ["PRODUCT", "VARIANT LOGIC", "COUNT", "UNIT-CURVE RULE"],
        ["Jacket", "1 colour x 4 sizes", "4", "No second colour in Drop 001."],
        ["Women's denim", "1 wash x 6 sizes", "6", "Use female fit proof and price-revealed selections."],
        ["Men's denim", "1 wash x 5 sizes", "5", "Use an independent men's block and selection curve."],
        ["Long-sleeve", "1 colour x 5 sizes", "5", "White stays sample-only until opacity + demand clear."],
        ["Scarves", "2 colours x one size", "2", "Espresso carries more units; burgundy carries image tension."],
    ]
    draw_table(c, rows, 38, 305, [120, 190, 58, 397], font_size=7.2)
    c.setFillColor(colors.HexColor("#D43A52"))
    c.setFont(BODY_BOLD, 7.2)
    c.drawString(38, 51, "RULE")
    wrapped(c, "No size or colour receives bulk depth merely to look complete. A SKU without fit evidence and a price-revealed selection is unresolved.", 81, 51, 720, size=8.2, leading=10.5, colour=WHITE)
    c.showPage()


def page_06(c: canvas.Canvas) -> None:
    page_base(c, 5, "05 / PRICE ARCHITECTURE")
    y = page_title(c, "Price must survive the whole order", "Comparable sticker prices are context. The sample and contribution margin must earn the final number.")
    products = [
        ("jacket-black-front.jpg", "JACKET", "C$249 test", "65.9% product GM", "C$199 was too thin at C$85 landed. If C$249 fails, reduce cost or units."),
        ("denim-concept.jpg", "DENIM", "C$128 test", "70.3% product GM", "Near full-price heritage denim. Fit, wash, trust, and returns must justify parity."),
        ("top-black.jpg", "LONG-SLEEVE", "C$68 test", "73.5% product GM", "Below the current Canadian SKIMS reference, but still needs a VORG-specific reason."),
        ("scarf-espresso.jpg", "SCARF", "C$35", "65.7% product GM", "Pop-up entry and cart add-on. Do not use paid acquisition for a standalone scarf order."),
    ]
    card_w = 184
    gap = 12
    x0 = 38
    card_y = 78
    card_h = 341
    for i, (image_name, label, price, gm, body) in enumerate(products):
        x = x0 + i * (card_w + gap)
        card(c, x, card_y, card_w, card_h, fill=WHITE, stroke=LINE)
        crop_image(c, ASSET_DIR / image_name, x, card_y + 156, card_w, 185, focus_y=0.43)
        c.setFillColor(RED)
        c.setFont(BODY_BOLD, 7)
        c.drawString(x + 13, card_y + 138, label)
        c.setFillColor(INK)
        c.setFont(DISPLAY, 16)
        c.drawString(x + 13, card_y + 113, price)
        c.setFillColor(GREEN)
        c.setFont(BODY_BOLD, 6.7)
        c.drawString(x + 13, card_y + 95, gm.upper())
        wrapped(c, body, x + 13, card_y + 74, card_w - 26, size=7.4, leading=9.5, colour=MUTED, max_lines=6)
    c.showPage()


def page_07(c: canvas.Canvas) -> None:
    page_base(c, 6, "06 / BOTTOM-UP MARKET")
    y = page_title(c, "The market is 86 orders", "For this drop, billions in category revenue matter less than attributable people, sessions, and size intent.")
    metric_card(c, 38, 354, 177, 83, "126", "PLANNED UNITS", value_colour=INK)
    metric_card(c, 230, 354, 177, 83, "107", "UNITS AT 85%", value_colour=GREEN)
    metric_card(c, 422, 354, 177, 83, "86", "ORDERS AT 1.25 UPT", value_colour=RED)
    metric_card(c, 614, 354, 190, 83, "2,810", "SESSIONS AT 3.06%", value_colour=ESPRESSO)

    box_y = 128
    box_h = 160
    steps = [
        ("ATTENTION", "Qualified product-first traffic"),
        ("CONFIDENCE", "Fit, price, delivery, return clarity"),
        ("ORDER", "86 completed purchases"),
        ("PROOF", "107 units kept, not merely shipped"),
    ]
    for i, (title, body) in enumerate(steps):
        x = 38 + i * 195
        card(c, x, box_y, 172, box_h, fill=WHITE, stroke=LINE)
        c.setFillColor(RED)
        c.circle(x + 25, box_y + 122, 14, fill=1, stroke=0)
        c.setFillColor(WHITE)
        c.setFont(BODY_BOLD, 8)
        c.drawCentredString(x + 25, box_y + 119, str(i + 1))
        c.setFillColor(INK)
        c.setFont(BODY_BOLD, 8)
        c.drawString(x + 15, box_y + 87, title)
        wrapped(c, body, x + 15, box_y + 66, 142, size=8.2, leading=10.5, colour=MUTED)
        if i < len(steps) - 1:
            c.setStrokeColor(RED)
            c.setLineWidth(1.5)
            c.line(x + 174, box_y + 80, x + 190, box_y + 80)
            c.line(x + 185, box_y + 84, x + 190, box_y + 80)
            c.line(x + 185, box_y + 76, x + 190, box_y + 80)
    wrapped(c, "Benchmark note: 3.06% is a current fashion ecommerce reference, not a VORG forecast. Model 2%-4% and report by channel and device.", 38, 95, 760, size=8, leading=10.3, colour=MUTED)
    c.showPage()


def page_08(c: canvas.Canvas) -> None:
    page_base(c, 7, "07 / ORDER COVERAGE")
    y = page_title(c, "Every order needs a source", "Coverage is a planning contract. It is not certainty and it cannot double-count the same person.")
    rows = [
        ["SOURCE", "WORKING ORDERS", "EVIDENCE REQUIRED"],
        ["Waitlist email", "30", "500 reachable subscribers; 6% working purchase assumption; delivery + click tracking."],
        ["SMS", "included", "Do not count it as incremental unless the person and conversion are deduplicated."],
        ["Pop-up", "20", "Capacity, RSVP quality, attendance plan, POS, local pickup, and observed conversion."],
        ["Connector / creator", "10", "Unique link or code; consent and disclosure where applicable."],
        ["Other qualified ecommerce", "26", "About 850 sessions at 3.06%; named owner and tracked source."],
        ["TOTAL", "86", "Enough modeled orders for 85% unit sell-through at 1.25 UPT."],
    ]
    bottom = draw_table(c, rows, 38, y - 8, [165, 110, 490], font_size=7.5, total_rows={6})

    card(c, 38, 68, 765, 108, fill=INK)
    c.setFillColor(colors.HexColor("#D43A52"))
    c.setFont(BODY_BOLD, 7.2)
    c.drawString(55, 151, "DO NOT COUNT")
    bullets(
        c,
        [
            "Likes, compliments, unpriced polls, friends saying they would buy, or duplicate screenshots.",
            "An SMS subscriber who is already counted as an email order without deduplication.",
            "Creator reach without a link, code, order, qualified DM, or price-revealed selection.",
        ],
        55,
        130,
        720,
        size=7.7,
        leading=9.7,
        gap=2,
        colour=WHITE,
    )
    c.showPage()


def page_09(c: canvas.Canvas) -> None:
    page_base(c, 8, "08 / CAMPAIGN PROOF GATE", dark=True)
    y = page_title(c, "Receipts before reach", "The threshold is an internal cash-risk rule, not an external fashion benchmark.", dark=True)
    left_x = 42
    right_x = 430
    left_y = 407
    right_y = 407
    left_steps = [
        ("Three physical-sample tests", "Run product-first, founder-first, and city-first creative with tracked outcomes."),
        ("Forty qualified selections", "Capture person, product, size, colour, city, price accepted, timestamp, and source."),
        ("Eight per product", "No product enters bulk while all its interest is hidden inside a blended total."),
    ]
    right_steps = [
        ("Two verified tactics", "Approve at least two campaign tactics with linked evidence under the Drop OS."),
        ("Objection ledger", "Record price, fit, opacity, warmth, shipping, styling, and return objections."),
        ("Evidence-built unit curve", "Allocate sizes and depth from fitting and deduplicated demand, not even splits."),
    ]
    for i, (title, body) in enumerate(left_steps, 1):
        left_y = draw_numbered_step(c, i, title, body, left_x, left_y, 340, dark=True)
    for i, (title, body) in enumerate(right_steps, 4):
        right_y = draw_numbered_step(c, i, title, body, right_x, right_y, 365, dark=True)

    card(c, 42, 72, 753, 84, fill=colors.HexColor("#242122"))
    c.setFillColor(colors.HexColor("#D43A52"))
    c.setFont(BODY_BOLD, 7.2)
    c.drawString(58, 132, "QUALIFIED SIGNAL")
    wrapped(c, "A deduplicated person chose a product, size, colour, and accepted a revealed price. Anything weaker can inform creative, but it cannot unlock bulk cash.", 58, 112, 715, size=8.2, leading=10.5, colour=WHITE)
    c.showPage()


def page_10(c: canvas.Canvas) -> None:
    page_base(c, 9, "09 / CASH ENVELOPE")
    y = page_title(c, "C$10,000 is a ceiling, not permission", "The corrected plan separates committed work from reserves and keeps production below the founder cap.")
    rows = [
        ["USE", "AMOUNT", "TREATMENT"],
        ["Production buy", "C$3,712", "Blocked until quote, sample, demand, and PO gate."],
        ["Development / samples / freight", "C$1,400", "Staged spend."],
        ["Proof-first content", "C$900", "Release in tranches after sample hooks work."],
        ["Packaging", "C$500", "Validate per-order cost and labels."],
        ["Shopify / domain / tools", "C$300", "Basic plan plus required apps only."],
        ["Pop-up operations", "C$900", "Venue, staffing, POS, and local pickup."],
        ["Controlled paid tests", "C$450", "No scale without signal."],
        ["Compliance / insurance", "C$250", "Textile labels, policies, event needs."],
        ["Returns / shipping reserve", "C$350", "Not marketing cash."],
        ["Contingency / retained cash", "C$1,238", "Uncommitted until exception approval."],
        ["TOTAL", "C$10,000", "C$8,412 committed plan + C$1,588 reserves."],
    ]
    draw_table(c, rows, 38, y - 7, [184, 82, 325], font_size=6.6, row_padding=7, total_rows={11})
    metric_card(c, 650, 332, 154, 92, "C$3,712", "WORKING PRODUCTION", value_colour=GREEN)
    metric_card(c, 650, 224, 154, 92, "C$8,412", "COMMITTED PLAN", value_colour=INK)
    metric_card(c, 650, 116, 154, 92, "C$1,588", "RESERVES", value_colour=RED)
    wrapped(c, "Founder salary load remains TBD and excluded. Add it to the next quote-backed model; do not withdraw cash until the next PO is funded.", 650, 96, 154, size=7.1, leading=9, colour=MUTED)
    c.showPage()


def page_11(c: canvas.Canvas) -> None:
    page_base(c, 10, "10 / DOWNSIDE ECONOMICS")
    y = page_title(c, "85% sell-through is not automatically safe", "Returns, discounts, shipping, and reserve consumption decide whether the proof loop can fund itself.")
    rows = [
        ["SELL-THROUGH", "LIST REVENUE", "ECON. PROFIT", "CASH AFTER COMMITTED", "CASH IF C$10K USED", "LEFTOVER COST"],
        ["50%", "C$6,030", "-C$710", "-C$2,566", "-C$4,154", "C$1,856"],
        ["70%", "C$8,442", "C$886", "-C$228", "-C$1,816", "C$1,114"],
        ["85%", "C$10,251", "C$2,083", "C$1,526", "-C$62", "C$557"],
        ["100%", "C$12,060", "C$3,280", "C$3,280", "C$1,692", "C$0"],
    ]
    draw_table(c, rows, 38, y - 3, [102, 118, 116, 154, 145, 130], font_size=7.2)

    card(c, 38, 96, 470, 172, fill=INK)
    c.setFillColor(colors.HexColor("#D43A52"))
    c.setFont(BODY_BOLD, 7.3)
    c.drawString(55, 242, "85% SELL-THROUGH + 10% COMMERCIAL LEAKAGE")
    metric_card(c, 55, 120, 135, 92, "C$1,087", "ECONOMIC PROFIT", value_colour=WHITE, fill=colors.HexColor("#242122"))
    metric_card(c, 205, 120, 135, 92, "C$530", "CASH AFTER COMMITTED", value_colour=WHITE, fill=colors.HexColor("#242122"))
    metric_card(c, 355, 120, 135, 92, "-C$1,058", "IF ALL RESERVES USED", value_colour=colors.HexColor("#D43A52"), fill=colors.HexColor("#242122"))

    card(c, 528, 96, 276, 172, fill=SOFT)
    c.setFillColor(RED)
    c.setFont(BODY_BOLD, 7.2)
    c.drawString(545, 242, "ASSUMPTIONS")
    bullets(
        c,
        [
            "Proportional product mix and 1.25 units per order.",
            "Shopify Basic: 2.8% + C$0.30 per online order.",
            "C$4,700 non-inventory committed spend used.",
            "No shipping subsidy, tax, founder pay, or damage loss." ,
        ],
        545,
        218,
        240,
        size=7.3,
        leading=9.2,
        gap=2,
    )
    c.showPage()


def page_12(c: canvas.Canvas) -> None:
    page_base(c, 11, "11 / ECOMMERCE SYSTEM", paper=CREAM)
    y = page_title(c, "The outfit merchandises. The funnel converts.", "Build confidence at every handoff from attention to kept order.")
    stages = [
        ("DISCOVERY", "Product-first hooks, founder proof, Ottawa/Gatineau attribution."),
        ("PDP", "Fit, measurements, material, delivery, returns, real sample media."),
        ("CART", "C$150 shipping test, scarf add-on, local pickup, no hero discount."),
        ("CHECKOUT", "Guest checkout, express pay, tax/shipping/inventory QA."),
        ("LIFECYCLE", "Recovery, delivery, fit/care, review, Drop 002 capture."),
    ]
    box_w = 138
    gap = 17
    start_x = 38
    box_y = 200
    box_h = 197
    for i, (title, body) in enumerate(stages):
        x = start_x + i * (box_w + gap)
        card(c, x, box_y, box_w, box_h, fill=WHITE, stroke=LINE)
        c.setFillColor(RED)
        c.setFont(DISPLAY, 26)
        c.drawString(x + 13, box_y + 151, f"0{i + 1}")
        c.setFillColor(INK)
        c.setFont(BODY_BOLD, 7.4)
        c.drawString(x + 13, box_y + 120, title)
        wrapped(c, body, x + 13, box_y + 95, box_w - 26, size=7.8, leading=10.2, colour=MUTED)
        if i < len(stages) - 1:
            c.setStrokeColor(RED)
            c.setLineWidth(1.1)
            c.line(x + box_w + 3, box_y + 98, x + box_w + gap - 3, box_y + 98)
    card(c, 38, 79, 758, 86, fill=INK)
    c.setFillColor(colors.HexColor("#D43A52"))
    c.setFont(BODY_BOLD, 7.1)
    c.drawString(55, 140, "MEASUREMENT CONTRACT")
    wrapped(c, "Track conversion by source, device, product, size, city, and new vs. returning visitor. Report shipped orders and kept units separately from checkouts.", 55, 120, 720, size=8.2, leading=10.5, colour=WHITE)
    c.showPage()


def page_13(c: canvas.Canvas) -> None:
    page_base(c, 12, "12 / PRODUCT DETAIL PAGE")
    y = page_title(c, "Fit confidence is the conversion feature", "A fashion PDP has to replace touch, fitting room, and salesperson before checkout.")
    crop_image(c, ASSET_DIR / "top-black.jpg", 38, 78, 220, 350, focus_y=0.45)
    crop_image(c, ASSET_DIR / "denim-concept.jpg", 272, 78, 220, 350, focus_y=0.50)
    card(c, 510, 78, 294, 350, fill=WHITE, stroke=LINE)
    c.setFillColor(RED)
    c.setFont(BODY_BOLD, 7.2)
    c.drawString(528, 402, "REQUIRED BEFORE LAUNCH")
    bullets(
        c,
        [
            "Front, back, side, movement, close-up, and full-outfit imagery.",
            "Garment measurements beside model measurements and size worn.",
            "Denim shown on at least two relevant bodies with rise and inseam clarity.",
            "Plain-language fit notes, composition, construction, care, and origin details where applicable.",
            "Delivery estimate and return summary visible on the PDP.",
            "Real stock states and low-stock wording tied only to inventory truth.",
            "Real sample imagery replaces every concept visualization before public launch.",
        ],
        528,
        378,
        256,
        size=7.7,
        leading=9.8,
        gap=2.5,
    )
    c.showPage()


def page_14(c: canvas.Canvas) -> None:
    page_base(c, 13, "13 / MERCHANDISING + AOV")
    y = page_title(c, "Use the scarf to unlock the order", "The scarf should raise average order value without discounting the hero products.")
    metric_card(c, 38, 350, 231, 88, "C$128", "DENIM CART", value_colour=INK)
    metric_card(c, 287, 350, 231, 88, "+ C$35", "SCARF ADD-ON", value_colour=RED)
    metric_card(c, 536, 350, 268, 88, "C$163", "CROSSES C$150 SHIPPING TEST", value_colour=GREEN)

    looks = [
        ("LOOK 01 / HERO", "Jacket + women's or men's denim + espresso scarf", "Authority, texture, one hero colour."),
        ("LOOK 02 / SOCIAL", "Black long-sleeve + denim + burgundy scarf", "Clean body line with one vivid interruption."),
        ("LOOK 03 / LOCAL", "Denim + scarf + outerwear from the customer's wardrobe", "Lower barrier; proves styling usefulness beyond a full VORG uniform."),
    ]
    for i, (title, body, note) in enumerate(looks):
        x = 38 + i * 255
        card(c, x, 118, 236, 182, fill=WHITE, stroke=LINE)
        c.setFillColor(RED if i == 1 else INK)
        c.setFont(BODY_BOLD, 7.2)
        c.drawString(x + 15, 273, title)
        wrapped(c, body, x + 15, 242, 206, font=DISPLAY, size=12, leading=14, colour=INK, max_lines=3)
        wrapped(c, note, x + 15, 170, 206, size=8, leading=10.2, colour=MUTED, max_lines=4)
    c.setFillColor(RED)
    c.setFont(BODY_BOLD, 7.1)
    c.drawString(38, 87, "RULE")
    wrapped(c, "Test C$135 vs. C$150 shipping thresholds. Never advertise free shipping until the carrier cost and contribution impact are modeled.", 79, 87, 720, size=8.2, leading=10.5, colour=INK)
    c.showPage()


def page_15(c: canvas.Canvas) -> None:
    page_base(c, 14, "14 / LAUNCH CALENDAR", dark=True)
    y = page_title(c, "Aim for early November. Earn the date.", "Vendor lead time and inbound confidence control the calendar; the campaign does not outrank manufacturing truth.", dark=True)
    rows = [
        ["WINDOW", "REQUIRED OUTPUT", "SPEND / DATE GATE"],
        ["Jul 21-31", "Reconcile five products; RFQs; size tests; label requirements.", "No public date."],
        ["Aug 1-21", "Quotes, samples, fit sessions, initial PDP and policy work.", "Sample spend only."],
        ["Aug 22-Sep 7", "Proof sprint, price reveal, product + size + colour selections.", "No bulk without receipts."],
        ["Sep 8 onward", "Bulk only after PP approval and vendor-backed backward calendar.", "Founder PO approval."],
        ["Oct 12-25", "Inbound buffer, QC, real photography, PDP, returns/shipping QA.", "Announce only after confidence."],
        ["Oct 26-Nov 4", "Preheat, seeding, email/SMS verification, checkout rehearsal.", "No fake proof or scarcity."],
        ["Nov 5-12", "Open online drop plus controlled pop-up window.", "Conditional GO."],
    ]
    draw_table(c, rows, 38, y - 8, [110, 430, 225], font_size=7.2)
    card(c, 38, 72, 765, 76, fill=colors.HexColor("#242122"))
    c.setFillColor(colors.HexColor("#D43A52"))
    c.setFont(BODY_BOLD, 7)
    c.drawString(55, 124, "OCTOBER RULE")
    wrapped(c, "October becomes viable only if approved PP samples, landed quotes, campaign receipts, and the vendor's guaranteed inbound date clear with a real QC buffer. The current recorded evidence does not support that claim.", 55, 104, 720, size=7.8, leading=9.8, colour=WHITE)
    c.showPage()


def page_16(c: canvas.Canvas) -> None:
    page_base(c, 15, "15 / PRODUCTION DECISION GATE")
    y = page_title(c, "Every active product must clear the gate", "A blended score cannot hide an unquoted or unproven SKU.")
    left = [
        ("Supplier truth", "Landed quote, MOQ, lead time, freight method, and named owner."),
        ("Sample truth", "Approved measurements and PP sample before bulk production."),
        ("Demand truth", "Price-revealed product, size, colour selections and verified campaign tactics."),
        ("Margin truth", "Price survives COGS, payment, packaging, returns, and shipping treatment."),
    ]
    right = [
        ("Label truth", "Fibre content, dealer identity, final label artwork, placement, and accuracy."),
        ("Ecommerce truth", "Real imagery, sizing, policies, analytics, checkout, pickup, and stock states."),
        ("Operations truth", "Venue, insurance, staffing, POS, capacity, inventory, and photo consent."),
        ("Cash truth", "Production stays below cap and reserves remain identifiable and controlled."),
    ]
    y_left = 409
    y_right = 409
    for i, (title, body) in enumerate(left, 1):
        y_left = draw_numbered_step(c, i, title, body, 40, y_left, 355)
    for i, (title, body) in enumerate(right, 5):
        y_right = draw_numbered_step(c, i, title, body, 430, y_right, 365)
    card(c, 40, 69, 755, 82, fill=INK)
    c.setFillColor(colors.HexColor("#D43A52"))
    c.setFont(BODY_BOLD, 7.2)
    c.drawString(57, 126, "CURRENT DECISION")
    wrapped(c, "FIX IT / proof work only. Bulk production remains locked until every active SKU has quote, sample, margin, and demand evidence.", 57, 106, 716, font=DISPLAY, size=13, leading=15, colour=WHITE)
    c.showPage()


def page_17(c: canvas.Canvas) -> None:
    page_base(c, 16, "16 / COMPLIANCE + TRUTH")
    y = page_title(c, "Protect the customer and the proof loop", "Operational truth belongs in the launch model, not in a last-week checklist.")
    areas = [
        ("TEXTILE LABELS", ["Fibre content in percentages", "Dealer identity / CA number path", "Legible, accessible, accurate labels", "No unverified material claims"]),
        ("CUSTOMER POLICIES", ["Shipping and delivery promise", "Return and refund policy", "Privacy / consent handling", "Real scarcity and stock language"]),
        ("EVENT CONTROL", ["Venue use and insurance", "Capacity, staffing, POS, security", "Photo consent and local pickup", "No alcohol, haze, flame, or unsafe rush"]),
        ("FINANCE", ["GST/HST threshold monitoring", "Tax treatment verified in Shopify", "Reserves separated from spend", "Founder salary load remains explicit"]),
    ]
    for i, (title, items) in enumerate(areas):
        x = 38 + (i % 2) * 389
        yy = 260 if i < 2 else 77
        card(c, x, yy, 371, 160, fill=WHITE, stroke=LINE)
        c.setFillColor(RED)
        c.setFont(BODY_BOLD, 7.2)
        c.drawString(x + 16, yy + 135, title)
        bullets(c, items, x + 16, yy + 112, 338, size=7.8, leading=9.8, gap=2)
    c.showPage()


def page_18(c: canvas.Canvas) -> None:
    page_base(c, 17, "17 / EVIDENCE LEDGER")
    y = page_title(c, "Sources, assumptions, and next move", "External references are context. Vendor quotes, samples, and VORG receipts control production decisions.")
    sources = [
        ("VORG internal truth", "docs/MASTER_BRIEF.md; product/drop-001.md; finance/unit-economics.md; strategy/drop-os-scoring-v1.md"),
        ("Shopify Canada pricing", "shopify.com/ca/pricing - checked 21 Jul 2026"),
        ("Shopify conversion benchmark", "shopify.com/ca/blog/ecommerce-conversion-rate - checked 21 Jul 2026"),
        ("SKIMS Canada price context", "skims.com/en-ca/products/fits-everybody-long-sleeve-t-shirt-onyx - checked 21 Jul 2026"),
        ("Levi's Canada denim context", "levi.com/CA/en_CA - women's low-rise and men's straight / loose pages - checked 21 Jul 2026"),
        ("Baymard PDP / returns research", "baymard.com/blog/current-state-ecommerce-product-page-ux - checked 21 Jul 2026"),
        ("Competition Bureau", "competition-bureau.canada.ca/en/labelling/textile-labelling - checked 21 Jul 2026"),
        ("CRA GST/HST", "canada.ca/.../t4002/t4002-3.html - checked 21 Jul 2026"),
    ]
    rows = [["SOURCE", "USE / LOCATION"]] + [[a, b] for a, b in sources]
    draw_table(c, rows, 38, y - 5, [200, 390], font_size=6.7, row_padding=7)

    card(c, 650, 206, 154, 219, fill=INK)
    c.setFillColor(colors.HexColor("#D43A52"))
    c.setFont(BODY_BOLD, 7)
    c.drawString(665, 399, "NEXT MOVE")
    steps = [
        "Issue RFQs for all five products.",
        "Fit separate denim blocks.",
        "Run the proof sprint.",
        "Replace assumptions with receipts.",
        "Regenerate this report before PO approval.",
    ]
    yy = 373
    for i, step in enumerate(steps, 1):
        c.setFillColor(RED)
        c.circle(668, yy + 2, 8, fill=1, stroke=0)
        c.setFillColor(WHITE)
        c.setFont(BODY_BOLD, 6.2)
        c.drawCentredString(668, yy, str(i))
        yy = wrapped(c, step, 682, yy + 4, 103, size=7.2, leading=9.2, colour=WHITE) - 8

    card(c, 38, 72, 766, 98, fill=SOFT)
    c.setFillColor(RED)
    c.setFont(BODY_BOLD, 7)
    c.drawString(55, 145, "VISUAL TRUTH BOUNDARY")
    wrapped(c, "Concept images reused from the founder-supplied working report are visual intent only. They do not prove a physical sample, final fit, material quality, production readiness, logo approval, or public image rights. Replace them with real samples and approved VORG assets before customer-facing use.", 55, 124, 725, size=7.8, leading=9.8, colour=INK)
    c.showPage()


def build() -> None:
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(OUTPUT), pagesize=(W, H), pageCompression=1)
    c.setTitle("VORG Fall Drop Launch Decision Report")
    c.setAuthor("VORG-EAVY")
    c.setSubject("Corrected October / November 2026 ecommerce launch stress test")
    c.setCreator("VORG-EAVY Bible / ReportLab")
    for render_page in [
        page_01,
        page_02,
        page_03,
        page_04,
        page_05,
        page_06,
        page_07,
        page_08,
        page_09,
        page_10,
        page_11,
        page_12,
        page_13,
        page_14,
        page_15,
        page_16,
        page_17,
        page_18,
    ]:
        render_page(c)
    c.save()
    print(f"Wrote {OUTPUT}")


if __name__ == "__main__":
    build()
