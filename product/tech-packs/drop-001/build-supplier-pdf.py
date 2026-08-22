from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.colors import HexColor, white, black
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.platypus import Paragraph, Table, TableStyle
from reportlab.lib.units import mm
from PIL import Image as PILImage

ROOT = Path(r"C:\Users\mbaho\OneDrive\Documents\vorg-eavy-bible")
ASSETS = ROOT / "product" / "tech-packs" / "drop-001" / "assets"
OUT = ROOT / "output" / "pdf"
OUT.mkdir(parents=True, exist_ok=True)
PDF = OUT / "VORG-EAVY_Drop-001_Supplier-Packet_v0.2.pdf"

W, H = landscape(A4)
INK = HexColor("#090909")
PAPER = HexColor("#F7F4EE")
GREY = HexColor("#666661")
LINE = HexColor("#D5D0C7")
SILVER = HexColor("#BEBBB4")
WINE = HexColor("#651C32")
ESPRESSO = HexColor("#3A211B")
PALE = HexColor("#ECE8DF")
BLUE = HexColor("#DDEBF7")
GREEN = HexColor("#D9EAD3")
AMBER = HexColor("#FFF2CC")
RED = HexColor("#F4CCCC")

c = canvas.Canvas(str(PDF), pagesize=(W, H), pageCompression=1)
c.setTitle("VORG-EAVY Drop 001 Supplier Packet v0.2")
c.setAuthor("VORG-EAVY")
c.setSubject("RFQ and prototype specification draft; not production ready")

PAGE = 0

BODY = ParagraphStyle("body", fontName="Helvetica", fontSize=8.2, leading=11, textColor=INK)
SMALL = ParagraphStyle("small", fontName="Helvetica", fontSize=6.7, leading=8.4, textColor=GREY)
TINY = ParagraphStyle("tiny", fontName="Helvetica", fontSize=5.8, leading=7.1, textColor=GREY)
LEAD = ParagraphStyle("lead", fontName="Helvetica", fontSize=11, leading=15, textColor=INK)
WHITE_SMALL = ParagraphStyle("white", fontName="Helvetica", fontSize=7.2, leading=9, textColor=white)


def P(text, style=BODY):
    return Paragraph(str(text), style)


def base_page(title, subtitle="", style_id="DROP 001", truth="RFQ / PROTOTYPE DRAFT"):
    global PAGE
    PAGE += 1
    c.setFillColor(PAPER)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    c.setFillColor(INK)
    c.rect(0, H-19*mm, W, 19*mm, fill=1, stroke=0)
    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 15)
    c.drawString(12*mm, H-11.5*mm, title)
    c.setFont("Helvetica", 6.8)
    c.setFillColor(SILVER)
    c.drawRightString(W-12*mm, H-9.5*mm, f"{style_id}  /  v0.2  /  2026-08-01")
    c.drawRightString(W-12*mm, H-14.5*mm, truth)
    if subtitle:
        c.setFillColor(GREY)
        c.setFont("Helvetica-Oblique", 7.4)
        c.drawString(12*mm, H-24.5*mm, subtitle)
    c.setStrokeColor(LINE)
    c.line(12*mm, 12*mm, W-12*mm, 12*mm)
    c.setFont("Helvetica", 6.5)
    c.setFillColor(GREY)
    c.drawString(12*mm, 7*mm, "Visuals show intent only. Written controls and approved physical standards govern.")
    c.drawRightString(W-12*mm, 7*mm, f"VORG-EAVY  /  {PAGE:02d}")


def finish():
    c.showPage()


def section_label(text, x, y, w, fill=INK, color=white):
    c.setFillColor(fill)
    c.rect(x, y-7*mm, w, 7*mm, fill=1, stroke=0)
    c.setFillColor(color)
    c.setFont("Helvetica-Bold", 7.5)
    c.drawString(x+3*mm, y-4.7*mm, text.upper())


def para(text, x, y_top, w, h, style=BODY):
    p = P(text, style)
    _, ph = p.wrap(w, h)
    p.drawOn(c, x, y_top-ph)
    return ph


def image_fit(file, x, y, w, h, pad=3*mm, bg=white):
    c.setFillColor(bg)
    c.setStrokeColor(LINE)
    c.roundRect(x, y, w, h, 2*mm, fill=1, stroke=1)
    im = PILImage.open(file)
    iw, ih = im.size
    scale = min((w-2*pad)/iw, (h-2*pad)/ih)
    dw, dh = iw*scale, ih*scale
    c.drawImage(str(file), x+(w-dw)/2, y+(h-dh)/2, dw, dh, preserveAspectRatio=True, mask="auto")


def table(data, x, y_top, widths, row_heights=None, font=7, header=True, fills=None, aligns=None):
    wrapped=[]
    for r, row in enumerate(data):
        style = ParagraphStyle(f"tbl{r}", parent=BODY, fontSize=font, leading=font+2, textColor=white if header and r==0 else INK)
        wrapped.append([P(v if v is not None else "", style) for v in row])
    t=Table(wrapped, colWidths=widths, rowHeights=row_heights, repeatRows=1 if header else 0)
    commands=[
        ("VALIGN",(0,0),(-1,-1),"TOP"),
        ("GRID",(0,0),(-1,-1),0.35,LINE),
        ("LEFTPADDING",(0,0),(-1,-1),4),
        ("RIGHTPADDING",(0,0),(-1,-1),4),
        ("TOPPADDING",(0,0),(-1,-1),3),
        ("BOTTOMPADDING",(0,0),(-1,-1),3),
    ]
    if header:
        commands += [("BACKGROUND",(0,0),(-1,0),INK),("TEXTCOLOR",(0,0),(-1,0),white)]
    if fills:
        for row_idx, color in fills.items(): commands.append(("BACKGROUND",(0,row_idx),(-1,row_idx),color))
    if aligns:
        for col_idx, align in aligns.items(): commands.append(("ALIGN",(col_idx,0),(col_idx,-1),align))
    t.setStyle(TableStyle(commands))
    _, th=t.wrap(sum(widths), H)
    t.drawOn(c,x,y_top-th)
    return th


def pill(text, x, y, fill, color=INK, w=35*mm):
    c.setFillColor(fill)
    c.roundRect(x,y,w,8*mm,4*mm,fill=1,stroke=0)
    c.setFillColor(color)
    c.setFont("Helvetica-Bold",7)
    c.drawCentredString(x+w/2,y+2.7*mm,text.upper())


def bullets(items, x, y_top, w, style=BODY, gap=2.3*mm):
    y=y_top
    for item in items:
        c.setFillColor(WINE)
        c.circle(x+1.4*mm,y-2.1*mm,0.8*mm,fill=1,stroke=0)
        ph=para(item,x+5*mm,y,w-5*mm,22*mm,style)
        y-=ph+gap
    return y


# 1 Cover
c.setFillColor(INK); c.rect(0,0,W,H,fill=1,stroke=0)
c.setFillColor(white); c.setFont("Helvetica-Bold",28); c.drawString(18*mm,H-28*mm,"DROP 001")
c.setFillColor(SILVER); c.setFont("Helvetica",10); c.drawString(18*mm,H-36*mm,"SUPPLIER RFQ + PROTOTYPE SPECIFICATION DRAFT / v0.2")
image_fit(ROOT/"site"/"assets"/"logo_black.png", W-106*mm, H-105*mm, 88*mm, 88*mm, pad=0, bg=INK)
c.setFillColor(white); c.setFont("Helvetica-Bold",23); c.drawString(18*mm,78*mm,"FIVE IDEAS.")
c.drawString(18*mm,66*mm,"ZERO BULK AUTHORIZATIONS.")
c.setFillColor(SILVER); c.setFont("Helvetica",9)
c.drawString(18*mm,51*mm,"The Firm Jacket / Women's low-rise denim / Men's denim / Scarf / Women's long-sleeve top")
c.setFillColor(WINE); c.rect(18*mm,24*mm,W-36*mm,12*mm,fill=1,stroke=0)
c.setFillColor(white); c.setFont("Helvetica-Bold",9); c.drawCentredString(W/2,28.5*mm,"FOUNDER REVIEW REQUIRED BEFORE RFQ RELEASE OR BULK SPEND")
c.setFillColor(SILVER); c.setFont("Helvetica",7); c.drawString(18*mm,13*mm,"Created 2026-08-01  /  Ottawa–Gatineau first wedge  /  November 5–12, 2026 conditional working window")
PAGE=1; finish()

# 2 Decision
base_page("THE MONEY DECISION","Recommended sourcing architecture under a hard C$6,000 clothes-and-inbound cash cap.")
pill("BULK: NO-GO",12*mm,H-39*mm,RED,w=42*mm)
pill("SAMPLES: GO",58*mm,H-39*mm,GREEN,w=42*mm)
pill("CHINA-FIRST",104*mm,H-39*mm,BLUE,w=42*mm)
pill("MAX 2 FACTORIES",150*mm,H-39*mm,AMBER,w=48*mm)
pill("2–3 BULK WINNERS",202*mm,H-39*mm,PALE,w=54*mm)
section_label("Recommendation",12*mm,H-54*mm,124*mm)
para("China is the most rational place to run a controlled sampling tournament. It is not an automatic quality decision and no candidate is approved. The first bulk order should use no more than two production relationships: a denim specialist and a jacket/top generalist. The scarf stays ready-stock-plus-label or sample-only unless fibre and pilling evidence clear.",12*mm,H-64*mm,124*mm,48*mm,LEAD)
section_label("What not to do",148*mm,H-54*mm,137*mm,fill=WINE)
bullets([
    "Do not place all five custom styles in bulk simply to complete the lineup.",
    "Do not split a C$6,000 order across China, Portugal, and Canada; duplicated freight, MOQs, and QC overwhelm the hedge.",
    "Do not spend C$6,000 at the factory door. The current merchandise envelope is approximately C$3,900.",
    "Do not call a marketplace badge, audit membership, or good sample 'vetting.'"
],148*mm,H-64*mm,137*mm)
section_label("Founder decision requested",12*mm,60*mm,273*mm)
table([
    ["Decision","Recommended answer","Founder response"],
    ["Sampling country","China-first; one hub; invite three candidates plus one challenger","Approve / revise"],
    ["Bulk assortment","Only two or three proof winners","Approve / revise"],
    ["Bodysuit","Defer; sample the black long-sleeve top","Approve / revise"],
    ["Cash rule","C$6,000 landed-to-Ottawa cap including border/control costs","Approve / revise"]
],12*mm,50*mm,[55*mm,128*mm,90*mm],font=7.5)
finish()

# 3 Truth
base_page("EVIDENCE BOUNDARY","A supplier pack is a control artifact, not proof of production readiness.")
table([
    ["Class","Current statement","Evidence / limit","Status"],
    ["Known","Founder-selected five-product set","Repository mission and product brief","APPROVED"],
    ["Known","C$5,000–C$6,000 initial production/inventory ceiling","Founder-set boundary","APPROVED"],
    ["Assumption","Starting POMs, tolerances, materials, construction, colours","Prototype hypotheses; no physical fit","DECISION NEEDED"],
    ["Assumption","17.5% blended duty and logistics allowances","Planning only; broker/vendor quotes required","DECISION NEEDED"],
    ["Open","Patterns, grades, size curve, wash standard, fabric articles","No approved physical artifacts","BLOCKED"],
    ["Open","Factories, capacity, subcontractors, pricing, lead time","Desktop research only","BLOCKED"],
    ["Open","Fit, wear, fibre, colourfastness, shrinkage, flammability","No passed evidence","BLOCKED"],
    ["Open","Price-revealed demand and final inventory units","No current product-level proof attached","BLOCKED"]
],12*mm,H-35*mm,[28*mm,95*mm,105*mm,45*mm],font=7.2,
fills={3:AMBER,4:AMBER,5:RED,6:RED,7:RED,8:RED})
section_label("Manufacturing truth hierarchy",12*mm,68*mm,273*mm)
table([
    ["1","Approved POM / BOM / construction / artwork"],
    ["2","Approved physical material, colour, wash, trim, and label standards"],
    ["3","Signed, dated, sealed pre-production sample"],
    ["4","Purchase order with exact site, Incoterm, tolerances, tests, remedies, and no-substitution clause"],
    ["5","Passed in-line evidence and independent pre-shipment inspection"]
],12*mm,58*mm,[14*mm,259*mm],font=8,header=False)
finish()

# 4 Lineup
base_page("DROP 001 LINE PLAN","One controlled colour/wash per fitted SKU; scarf colours remain conditional.")
table([
    ["Style ID","Product","Base","Colour / wash","Role","Current status"],
    ["VE-FJ-001","The Firm Jacket","M","Black","Hero / authority","DECISION NEEDED"],
    ["VE-WD-001","Women's low-rise denim","28","Washed black","Women's anchor","DECISION NEEDED"],
    ["VE-MD-001","Men's denim","32","Midnight indigo","Men's anchor","DECISION NEEDED"],
    ["VE-SC-001","Brushed scarf","OS","Espresso / burgundy","Low-size-risk accent","DECISION NEEDED"],
    ["VE-WT-001","Women's fitted long sleeve","S","Black","Layer / outfitting","DECISION NEEDED"],
    ["VE-WB-001","Women's bodysuit","TBD","Not selected","Deferred complexity","BLOCKED"]
],12*mm,H-35*mm,[30*mm,55*mm,18*mm,44*mm,73*mm,53*mm],font=7.6,
fills={6:RED})
section_label("SKU-control rules",12*mm,76*mm,273*mm)
bullets([
    "Women's and men's denim are separate fits, patterns, size sets, and wear tests; never reuse one block by relabelling.",
    "White top is sample-only until black proves opacity, recovery, price, and demand.",
    "Screen colours are not production standards. Approve physical lab dips, wash blankets, and shade bands.",
    "Do not approve a size curve until base fits are approved and the target customer measurements are documented."
],12*mm,65*mm,273*mm)
finish()

# Jacket pages
base_page("THE FIRM JACKET / VISUAL INTENT","Cropped black quilted blouson; leather collar; straight continuous quilted sleeves with clean self-fabric ends; silver two-way zipper.","VE-FJ-001")
image_fit(ASSETS/"VE-FJ-001-tech-flat-v0.2.png",12*mm,22*mm,132*mm,128*mm)
image_fit(ASSETS/"VE-FJ-001-construction-details-v0.2.png",151*mm,22*mm,134*mm,128*mm)
finish()

base_page("THE FIRM JACKET / CONTROL SPEC","Starting prototype values. Factory measures every sample and records deviations.","VE-FJ-001")
table([
    ["POM","Measurement","Target cm","Tol ±","Method"],
    ["01","1/2 chest","61.0","1.0","2.5 cm below armhole"],["02","1/2 hem","58.0","1.0","Straight"],
    ["03","HPS length","58.0","1.0","HPS to hem"],["04","Shoulder","51.0","0.7","Seam to seam"],
    ["05","Sleeve length","62.5","0.7","Shoulder seam to finished edge"],["06","1/2 bicep","24.5","0.7","2.5 cm below armhole"],
    ["07","1/2 sleeve opening","16.0","0.7","Finished edge flat; no cinch/taper"],["08","Sleeve-end turnback","3.0","0.3","Finished self-fabric hem depth"],
    ["09","Collar fall","7.5","0.5","Centre back"],["10","CF zipper","54.0","0.5","End to end"],["11","Pocket opening","16.0","0.5","Usable opening"],
    ["12","Diamond quilt","3.5","0.3","Nominal repeat"]
],12*mm,H-35*mm,[14*mm,48*mm,26*mm,18*mm,58*mm],font=6.8)
section_label("Material / construction gates",174*mm,H-35*mm,111*mm)
bullets([
    "Shell: cotton-rich coated/dense twill, 260–300 gsm target. Submit exact mill/article/finish.",
    "Wadding: 60–80 gsm target; quilt must stay low-loft and symmetric across major seams.",
    "Lining: 55–75 gsm smooth woven; no dye transfer.",
    "Collar: black genuine leather, 0.8–1.0 mm starting target. Submit species/tannery/grade/thickness/finish and material-test evidence.",
    "Sleeve end: no cuff component. Quilt shell continues straight to the full opening; 3 cm self-fabric turnback with two precise parallel topstitch rows.",
    "Two-way zipper must lie flat, cycle cleanly, and match the approved silver finish.",
    "Pocket ends reinforced. No unapproved shell, wadding, lining, zipper, leather-collar, or sleeve-end substitution."
],174*mm,H-47*mm,111*mm,style=SMALL)
pill("STATUS: DECISION NEEDED",174*mm,24*mm,AMBER,w=58*mm)
finish()

# Women's denim
base_page("WOMEN'S DENIM / VISUAL INTENT","Low-rise washed-black relaxed straight/wide 5-pocket jean; not a reused men's block.","VE-WD-001")
image_fit(ASSETS/"VE-WD-001-tech-flat-v0.1.png",12*mm,22*mm,180*mm,128*mm)
section_label("High-risk fit intent",200*mm,H-35*mm,85*mm,fill=WINE)
bullets([
    "Low waist must sit as intended without front collapse or back gaping.",
    "Relaxed thigh and straight/wide leg; avoid accidental barrel shape.",
    "Wear-test rise, crotch comfort, pocket placement, and seated movement across sizes.",
    "Approve wash blanket and a sealed garment before bulk."
],200*mm,H-47*mm,85*mm)
pill("BASE 28 / PROTOTYPE",200*mm,31*mm,AMBER,w=52*mm)
finish()

base_page("WOMEN'S DENIM / CONTROL SPEC","Centimetres; starting base-size 28 hypothesis only.","VE-WD-001")
table([
    ["POM","Measurement","Target","Tol ±","Method"],
    ["01","1/2 waistband","39.0","1.0","Along top edge"],["02","Front rise","20.5","0.7","Including waistband"],
    ["03","Back rise","31.5","0.7","Including waistband"],["04","1/2 hip","50.5","1.0","20 cm below top edge"],
    ["05","1/2 thigh","31.5","0.7","2.5 cm below crotch"],["06","1/2 knee","25.5","0.7","At half inseam"],
    ["07","1/2 leg opening","24.0","0.7","Flat"],["08","Inseam","81.0","0.7","Crotch to hem"],
    ["09","Outseam","103.5","1.0","Top edge to hem"],["10","Fly length","11.5","0.5","Visible seam"]
],12*mm,H-35*mm,[14*mm,49*mm,23*mm,18*mm,57*mm],font=6.9)
section_label("Denim controls",174*mm,H-35*mm,111*mm)
bullets([
    "12–13 oz cotton-rich rigid or comfort-rigid target; supplier identifies exact mill, composition, lot, usable width, shrinkage, and price.",
    "Wash blanket controls black depth, seam highs, abrasion placement, crocking, and shade range.",
    "Approve zipper/button supplier and finish. Nickel-free evidence where claimed.",
    "Fit test at least 6–10 relevant participants; log body measurements, size, movement, and return-risk comments.",
    "Grade only after base fit approval; return graded nest and measured size set."
],174*mm,H-47*mm,111*mm,style=SMALL)
pill("FIT + WASH BLOCKED",174*mm,24*mm,RED,w=52*mm)
finish()

# Men's denim
base_page("MEN'S DENIM / VISUAL INTENT","Midnight-indigo relaxed straight 5-pocket jean with its own block and wash standard.","VE-MD-001")
image_fit(ASSETS/"VE-MD-001-tech-flat-v0.1.png",12*mm,22*mm,180*mm,128*mm)
section_label("High-risk fit intent",200*mm,H-35*mm,85*mm,fill=WINE)
bullets([
    "Relaxed seat/thigh with a controlled straight leg and clean break.",
    "Independent men's rise, fly, hip, thigh, and pocket geometry.",
    "Prevent leg twist, indigo bleeding, weak belt-loop ends, and zipper failure.",
    "Approve wash blanket, shade band, and sealed garment."
],200*mm,H-47*mm,85*mm)
pill("BASE 32 / PROTOTYPE",200*mm,31*mm,AMBER,w=52*mm)
finish()

base_page("MEN'S DENIM / CONTROL SPEC","Centimetres; starting base-size 32 hypothesis only.","VE-MD-001")
table([
    ["POM","Measurement","Target","Tol ±","Method"],
    ["01","1/2 waistband","43.0","1.0","Along top edge"],["02","Front rise","28.5","0.7","Including waistband"],
    ["03","Back rise","39.5","0.7","Including waistband"],["04","1/2 hip","55.5","1.0","20 cm below top edge"],
    ["05","1/2 thigh","34.0","0.7","2.5 cm below crotch"],["06","1/2 knee","26.0","0.7","At half inseam"],
    ["07","1/2 leg opening","23.5","0.7","Flat"],["08","Inseam","81.0","0.7","Crotch to hem"],
    ["09","Outseam","108.5","1.0","Top edge to hem"],["10","Fly length","17.0","0.5","Visible seam"]
],12*mm,H-35*mm,[14*mm,49*mm,23*mm,18*mm,57*mm],font=6.9)
section_label("Denim controls",174*mm,H-35*mm,111*mm)
bullets([
    "12.5–13.5 oz cotton-rich rigid denim target; exact article and lot evidence required.",
    "Midnight-indigo depth with minimal uncontrolled contrast; physical standard controls.",
    "Stress seams, fly, pockets, belt loops, tack button, zipper, hems, and bar tacks require function evidence.",
    "Test dimensional stability, wet/dry crocking, colourfastness, seam performance, hardware, and wash consistency.",
    "Grade only from approved men's base fit; do not infer from women's grading."
],174*mm,H-47*mm,111*mm,style=SMALL)
pill("FIT + WASH BLOCKED",174*mm,24*mm,RED,w=52*mm)
finish()

base_page("DENIM / CONSTRUCTION INTENT","Reference zones for both blocks; written style-specific measurements and wash standards control.","VE-WD-001 + VE-MD-001")
image_fit(ASSETS/"VE-DENIM-001-construction-details-v0.1.png",12*mm,22*mm,150*mm,128*mm)
table([
    ["Zone","Control","Reject if"],
    ["Waist/fly","Stable waistband; clean fly; secure stop/button","Roll, gap, flare, failure"],
    ["Pockets","Approved placement/shape; reinforced corners","Asymmetry or distortion"],
    ["Stress seams","Factory states stitch/seam/SPI; bar-tack loops","Grin, skipped stitch, weak tack"],
    ["Wash","Physical blanket + sealed garment + lot map","Random abrasion or shade band"],
    ["Hems","Even, twist-free, approved stitch/finish","Roping beyond standard, torque"],
    ["Labels","Correct block/size/content/origin/care","Mismatch or missing copy"]
],170*mm,H-35*mm,[30*mm,67*mm,58*mm],font=6.7)
section_label("Factory must return",170*mm,64*mm,115*mm)
bullets(["Measured sample report.","Wash recipe/plant identity and subcontractor disclosure.","Fabric roll/lot and wash-lot mapping.","Photos of inside construction and bulk shade groups."],170*mm,54*mm,115*mm,style=SMALL)
finish()

# Top
base_page("WOMEN'S LONG SLEEVE / VISUAL INTENT","Black fitted stretch-jersey top. White is sample-only. Bodysuit is deferred.","VE-WT-001")
image_fit(ASSETS/"VE-WT-001-tech-flat-v0.1.png",12*mm,22*mm,180*mm,128*mm)
section_label("Risk decision",200*mm,H-35*mm,85*mm,fill=WINE)
bullets([
    "Select the long-sleeve top for first proof. A bodysuit adds torso-length, gusset, closure, hygiene, and return risk.",
    "Black must remain opaque under stretch and recover after wear.",
    "Sample white only to expose transparency and seam-show risks; do not allocate bulk yet."
],200*mm,H-47*mm,85*mm)
pill("BODYSUIT: DEFER",200*mm,31*mm,RED,w=52*mm)
finish()

base_page("WOMEN'S LONG SLEEVE / CONTROL SPEC","Centimetres; starting base-size S hypothesis only.","VE-WT-001")
table([
    ["POM","Measurement","Target","Tol ±","Method"],
    ["01","1/2 chest","38.0","0.7","2.5 cm below armhole"],["02","1/2 waist","32.5","0.7","Narrowest"],
    ["03","1/2 hem","39.0","0.7","Straight"],["04","HPS length","57.0","0.7","HPS to hem"],
    ["05","Shoulder","34.5","0.5","Seam to seam"],["06","Sleeve length","64.0","0.7","Shoulder seam to edge"],
    ["07","1/2 bicep","13.5","0.5","2.5 cm below armhole"],["08","Cuff opening","8.5","0.5","Flat"],
    ["09","Neck width","17.5","0.5","Seam to seam"],["10","Front neck drop","8.0","0.5","HPS line to seam"]
],12*mm,H-35*mm,[14*mm,49*mm,23*mm,18*mm,57*mm],font=6.9)
section_label("Material / construction gates",174*mm,H-35*mm,111*mm)
bullets([
    "180–220 gsm lyocell/modal-rich jersey with elastane target. Submit exact composition, GSM, stretch, recovery, and width.",
    "Factory proposes stretch seam and hem construction; sample must not tunnel, wave, pop, grow, or twist.",
    "Wear test through movement and a full day; remeasure recovery. Test opacity under intended stretch.",
    "Approve black lab dip and bulk dye lot. No white bulk without a separate proof decision."
],174*mm,H-47*mm,111*mm,style=SMALL)
pill("MATERIAL + FIT BLOCKED",174*mm,24*mm,RED,w=60*mm)
finish()

# Scarf
base_page("SCARF / VISUAL INTENT","Espresso and burgundy brushed scarf; low-size-risk does not mean low material risk.","VE-SC-001")
image_fit(ASSETS/"VE-SC-001-tech-flat-details-v0.1.png",12*mm,22*mm,180*mm,128*mm)
section_label("Commercial intent",200*mm,H-35*mm,85*mm,fill=WINE)
bullets([
    "Prefer a proven ready-stock body with exact label application for Drop 001.",
    "Do not claim cashmere or wool from price, handfeel, or listing language.",
    "Retain two colours only if total MOQ, fibre evidence, pilling, shedding, and demand pass."
],200*mm,H-47*mm,85*mm)
pill("FIBRE CLAIM BLOCKED",200*mm,31*mm,RED,w=56*mm)
finish()

base_page("SCARF / CONTROL SPEC","Provisional blended-material route; physical handfeel and lab evidence control.","VE-SC-001")
table([
    ["POM","Measurement","Target cm","Tol ±","Method"],
    ["01","Body width","30","1.0","Excluding fringe"],
    ["02","Body length","180","2.0","Excluding fringe"],
    ["03","Fringe each end","9","0.5","Finished average"],
    ["04","Total length","198","2.0","Including fringe"]
],12*mm,H-35*mm,[16*mm,54*mm,30*mm,22*mm,50*mm],font=7.2)
section_label("Provisional material brief",12*mm,73*mm,160*mm)
para("70% recycled polyester / 30% wool, 260–320 gsm, is a prototype hypothesis—not an approved claim. Supplier must state exact fibre percentages by mass and provide intended-bulk fibre, pilling, shedding, colourfastness, and dimensional evidence.",12*mm,63*mm,160*mm,35*mm,LEAD)
section_label("Reject if",184*mm,H-35*mm,101*mm,fill=WINE)
bullets(["Low MOQ applies only to a different composition or size.","Certificate cannot be verified for the exact material/facility.","Uncontrolled pilling, shedding, fringe loss, or shade variation.","Supplier uses 'cashmere feel' as permission to claim cashmere."],184*mm,H-47*mm,101*mm,style=SMALL)
finish()

# BOM and materials
base_page("MATERIAL + BOM APPROVAL MATRIX","Supplier names exact mill/article and returns one row per component. No silent equivalent.")
table([
    ["Style","Critical component","Target","Approval evidence","Status"],
    ["VE-FJ-001","Shell / wadding / lining / leather collar / continuous sleeve end","Specified ranges; no separate cuff","Cards + quilt/collar samples + sleeve-end close-up + test data","SUPPLIER TO CONFIRM"],
    ["VE-FJ-001","Two-way metal zipper","Silver, wave-free, cycle tested","Exact vendor/article + approved trim","SUPPLIER TO CONFIRM"],
    ["VE-WD-001","12–13 oz washed-black denim","Cotton-rich; controlled crock/shrink","Mill article + wash blanket + lab","BLOCKED"],
    ["VE-MD-001","12.5–13.5 oz indigo denim","Cotton-rich; controlled bleed/twist","Mill article + wash blanket + lab","BLOCKED"],
    ["VE-WT-001","180–220 gsm stretch jersey","Opaque, soft, recovery","Full-width swatch + wear/test report","BLOCKED"],
    ["VE-SC-001","260–320 gsm woven body","Provisional blend; low shedding","Independent fibre/pilling evidence","BLOCKED"],
    ["ALL","Main/care/content/origin labels","Approved exact artwork and copy","Strike-off + sewn placement","BLOCKED"],
    ["ALL","Packaging / barcode / carton","Correct style/size/colour/count","Packing sample + PSI evidence","SUPPLIER TO CONFIRM"]
],12*mm,H-35*mm,[30*mm,49*mm,62*mm,84*mm,48*mm],font=7.2,
fills={3:RED,4:RED,5:RED,6:RED,7:RED})
section_label("Change-control rule",12*mm,54*mm,273*mm,fill=WINE)
para("A material, wash plant, trim, stitch, artwork, packing, facility, or subcontractor change requires written disclosure, price/lead impact, new evidence, and approval before production continues. The supplier may not decide that an alternative is 'same quality.'",12*mm,44*mm,273*mm,25*mm,LEAD)
finish()

# Colour labels compliance
base_page("COLOUR, LABEL & COMPLIANCE CONTROLS","Physical standards, accurate claims, and exact approved brand assets.")
table([
    ["Style","Colour / wash","Production control","Decision"],
    ["VE-FJ-001","Black","Shell/lining/leather-collar/zip physical set","One colour"],
    ["VE-WD-001","Washed black","Wash blanket + sealed garment + shade band","One wash"],
    ["VE-MD-001","Midnight indigo","Wash blanket + sealed garment + shade band","One wash"],
    ["VE-WT-001","Black","Lab dip + opacity/recovery sample","White sample-only"],
    ["VE-SC-001","Espresso / burgundy","Yarn/fabric standards + shade band","Both conditional"]
],12*mm,H-35*mm,[32*mm,48*mm,113*mm,55*mm],font=7.3)
section_label("Canadian label gate",12*mm,72*mm,160*mm)
bullets([
    "Fibre names and percentages by mass must reflect the final tested material.",
    "Dealer identity is required. Bilingual fibre/care presentation is the safest national route.",
    "Origin text must be accurate. Use the broker/legal review before printing bulk labels.",
    "Flammability applies to imported and sold textile apparel."
],12*mm,62*mm,160*mm)
section_label("Approved logo reference",184*mm,72*mm,101*mm)
image_fit(ROOT/"site"/"assets"/"logo_black.png",184*mm,19*mm,101*mm,43*mm,pad=0,bg=INK)
c.setFillColor(GREY); c.setFont("Helvetica-Oblique",6.5); c.drawString(184*mm,16*mm,"Exact local asset only. Supplier may not redraw or approximate.")
finish()

# Testing
base_page("TEST PLAN / STOP-SHIP LOGIC","Agree methods and thresholds with the lab before PO; attach reports to the exact intended bulk lot.")
table([
    ["Applies","Control","Evidence","Stop-ship trigger"],
    ["ALL","Fibre composition","Independent report tied to material lot","Claim differs from result"],
    ["ALL","Canadian textile flammability","Accredited report","Failure"],
    ["ALL","Dimensional stability / appearance","Before/after POM and photos","Outside approved tolerance"],
    ["VE-FJ-001","Straight continuous sleeve end","Measured opening + mirrored macro photos","Any cuff component, taper, cinch, distortion, or uneven hem"],
    ["VE-FJ-001","Leather collar","Thickness/type/finish/flex/rub/restricted-substance evidence","Unverified leather, transfer, cracking, or mismatch"],
    ["DENIM","Wet/dry crocking and colourfastness","Lab report on wash/bulk lot","Transfer/change beyond agreed grade"],
    ["DENIM","Seams, hardware, leg twist, wash consistency","Function tests + PSI","Failure or uncontrolled lot"],
    ["VE-WT-001","Stretch, recovery, opacity, seam durability","Wear/test log","Sheer, growth, popped seam"],
    ["VE-SC-001","Fibre, pilling, shedding, fringe security","Lab/handling report","False claim or visible failure"],
    ["ALL","Labels, barcode, carton, count","Approved copy + PSI","Mismatch/missing"],
    ["ALL","Broken-needle / metal control","Factory log / scan policy","Uncontrolled metal risk"]
],12*mm,H-35*mm,[25*mm,91*mm,91*mm,66*mm],font=7.2)
section_label("Inspection",12*mm,48*mm,273*mm)
para("Working starting point: independent pre-shipment inspection at 80% packed; critical defects 0, major AQL 2.5, minor AQL 4.0, plus separate POM, colour/wash, function, labels, packaging, and quantity requirements. This is a proposed contract position—not a universal standard or substitute for lab testing.",12*mm,38*mm,273*mm,24*mm,LEAD)
finish()

# RFQ
base_page("CONTROLLED RFQ / REQUIRED RESPONSE","Send the same version to every candidate. Quote custom production, not marketplace stock.")
table([
    ["Commercial field","Required answer"],
    ["Legal entity","Full registered name, registration/credit number, invoice/payee/bank match"],
    ["Production site","Address, factory/trader role, live dated walk-through, assessment report"],
    ["Scope","Which processes are direct; every subcontractor name/address/function"],
    ["MOQ","Custom MOQ by style + colour + material + wash; sample and size-set MOQ"],
    ["Price","Sample cost; FOB unit price by quantity break; setup, label, packing, testing extras"],
    ["Materials","Mill/article/composition/GSM or oz/width/lot/shrink/crock/availability"],
    ["Lead","Material, sample, revision, PP, bulk, inspection-ready, and ship dates"],
    ["Freight","Incoterm/port; carton dimensions, weight, units/carton; HS inputs"],
    ["Terms","Deposit/balance; inspection right; rework/refund; late and no-substitution clauses"],
    ["References","Two recent customer references for fewer than 150 units to Canada/USA"],
    ["Validity","Quote validity, capacity hold, named sales/project/quality contacts"]
],12*mm,H-35*mm,[57*mm,216*mm],font=7.3)
section_label("Supplier acknowledgement",12*mm,40*mm,273*mm,fill=WINE)
para("Supplier confirms visuals are intent only, written controls govern, no substitution or undisclosed subcontracting is allowed, and bulk does not begin until the sealed pre-production sample and purchase order are signed.",12*mm,30*mm,273*mm,18*mm,LEAD)
finish()

# Shortlist
base_page("DESKTOP-QUALIFIED RFQ CANDIDATES","None is vetted or approved. Public metrics and vendor claims must be replaced by evidence.")
table([
    ["Candidate","Proposed use","Why it entered","Key unresolved risk","Decision"],
    ["Dongguan City Topshow","Jacket/top RFQ; denim challenger only","Public custom-manufacturer profile; legal-identity lead","Denim/wash path and mixed factory/trader claims","INVITE TO RFQ"],
    ["Dongguan Hangyue","Women's denim challenger; men's capability response","Women's jeans listings and low listing quantities","Listing MOQ may be stock, not custom; wash plant unproven","INVITE TO RFQ"],
    ["Hebei Dilly","Ready-stock scarf challenger","Scarf category and low-MOQ listings","Composition and 'cashmere-feel' language require testing","INVITE TO RFQ"],
    ["Hohhot Sona","Real-cashmere cost benchmark","Cashmere-specialist profile","Credible custom cashmere likely incompatible with C$35 retail","BENCHMARK"],
    ["MVFA Toronto","Domestic benchmark","Public CMT from 50/style/colour","Five styles exceed current cash architecture","BENCHMARK"],
    ["White Cotton Portugal","European casualwear benchmark","Public 50/style/colour and 6–10 week claims","Denim capability/CETA origin not automatic","BENCHMARK"],
    ["Billoomi India","Hold","Some small solid-colour MOQ claims","Denim MOQ 100 and unresolved adverse founder reports","HOLD"]
],12*mm,H-35*mm,[39*mm,48*mm,66*mm,78*mm,42*mm],font=6.65,
fills={7:RED})
section_label("Automatic disqualifiers",12*mm,48*mm,273*mm,fill=WINE)
para("Identity or bank mismatch; refused live video/inspection; hidden subcontractors; bulk-before-sample pressure; unverified/expired certificate; personal/off-record payment; unapproved substitution; refusal to state whether MOQ is custom or existing stock.",12*mm,38*mm,273*mm,22*mm,LEAD)
finish()

# Vetting
base_page("SUPPLIER VETTING / TWELVE GATES","A platform badge begins diligence. It does not finish it.")
table([
    ["Gate","Evidence required","Pass condition"],
    ["1 Identity","Licence, legal name, 18-digit China credit code where applicable","Invoice/payee/bank/site match"],
    ["2 Factory reality","Assessment report + scheduled live dated walk-through","Site and processes seen"],
    ["3 Capability","Machine/process map + subcontractor legal entities","Exact products can be made"],
    ["4 References","Two recent sub-150-unit Canada/USA customers","References confirm delivery/response"],
    ["5 Material","Swatches/cards, mill/article/lot/test data","Intended material is credible"],
    ["6 Proto","Paid sample measured and photographed","Issues logged"],
    ["7 Revision","Corrected sample / comments closure","Critical defects closed"],
    ["8 Size set / PP","Relevant sizes + sealed bulk-standard sample","Fit/grade/actual inputs approved"],
    ["9 Contract","Exact PO, site, Incoterm, tests, tolerances, remedies","No ambiguity/substitution"],
    ["10 Payment","Protected/documented channel; proposed 30/70 structure","Final balance tied to passed PSI"],
    ["11 Production / PSI","Lot records, dated photos, 80%-packed independent PSI","Report passes or reinspection"],
    ["12 Import / arrival","CARM, broker HS review, count/measure/quarantine","Landed evidence reconciles"]
],12*mm,H-35*mm,[28*mm,151*mm,94*mm],font=6.9)
finish()

# Budget country
base_page("C$6,000 LANDED CASH MODEL","Planning inputs are editable in the workbook. Exact duty and value-for-duty treatment require a broker.")
table([
    ["Cash use","Working CAD","Nature"],
    ["Factory merchandise invoice","3,900.00","Maximum planning envelope; not quote"],
    ["Consolidated international freight","650.00","Working allowance"],
    ["Duty at blended 17.5%","682.50","Planning assumption"],
    ["Import GST cash","229.125","Conservative planning assumption"],
    ["Brokerage","120.00","Working allowance"],
    ["Independent PSI","250.00","Control cost; do not cut to force fit"],
    ["Contingency","168.375","Thin residual buffer"],
    ["TOTAL","6,000.00","Hard ceiling"]
],12*mm,H-35*mm,[94*mm,38*mm,70*mm],font=7.5,fills={8:GREEN})
section_label("China vs diversification",225*mm,H-35*mm,60*mm,fill=WINE)
bullets([
    "China-first sampling: YES.",
    "Five-style China bulk now: NO.",
    "Multi-country Drop 001 split: NO.",
    "Capability-diversified max two factories: YES.",
    "Bulk two or three proof winners: YES."
],225*mm,H-47*mm,60*mm,style=SMALL)
section_label("Tariff reality",12*mm,43*mm,190*mm)
para("Reviewed 2026 Canadian tariff lines commonly show 17% MFN for cotton jeans and some cotton outerwear, and 18% for many knit tops and wool/synthetic scarves. Exact fibre, construction, gender/category, origin, and value determine classification. China does not receive CETA preference; Portuguese preference is not automatic and depends on origin rules/documentation.",12*mm,33*mm,190*mm,22*mm,SMALL)
finish()

# Inventory and PO
base_page("INVENTORY + PO GATES","Buy depth in proven winners. Do not buy breadth to imitate a mature collection.")
table([
    ["Gate","Required proof","If it fails"],
    ["Demand","≥40 price-revealed actions overall and ≥8/product at shown retail","Keep style sample-only"],
    ["Fit","6–10 relevant wear testers per block; measurements and return-risk logged","Revise or stop"],
    ["Material / wash","Approved intended article, physical standard, test evidence","No PO"],
    ["Quote / MOQ","Custom terms fit merchandise envelope after all border/control reserves","Narrow assortment"],
    ["Supplier","≥75/100 score and no automatic disqualifier","Reject / replace"],
    ["PP sample","Signed and sealed with all actual trims/labels/packing","No bulk start"],
    ["Inspection","Independent PSI right in PO; failed report blocks shipment","Correct and reinspect"],
    ["Cash","Total landed-to-Ottawa model ≤ C$6,000","Reduce units/styles, not controls"]
],12*mm,H-35*mm,[36*mm,154*mm,83*mm],font=7.2)
section_label("Allocation order after proof",12*mm,47*mm,273*mm)
table([
    ["1","Reserve freight, duty, GST cash, brokerage, inspection, and contingency."],
    ["2","Fund the two highest proof scores to meaningful size depth."],
    ["3","Add a third style only if MOQ and cash still pass."],
    ["4","Keep the remaining styles as approved samples for later release or test."],
    ["5","Do not increase inventory simply to earn a lower unit price."]
],12*mm,37*mm,[14*mm,259*mm],font=7.5,header=False)
finish()

# Founder lessons
base_page("REPEATED SMALL-BRAND FAILURE PATTERNS","Anecdotal founder reports are warnings, not verified findings about a shortlisted candidate.")
table([
    ["Reported failure","Control added to this pack"],
    ["Bulk trousers materially longer than sample","Signed POM, measured PP, bulk measurement inspection"],
    ["Bulk fabric/composition/GSM changed","Exact article/lot, no-substitution clause, fibre/GSM testing"],
    ["Bulk construction differed from sample","Sealed PP, inside construction evidence, inspection"],
    ["Over-ordering to obtain a lower unit cost","Hard landed cap; demand-ranked allocation"],
    ["Paying bulk to unlock sample","Paid sample ladder; no bulk-before-sample pressure"],
    ["Generic 'top factory' list used as diligence","Legal identity, live facility, subcontractors, references"],
    ["Believing a weak sample will improve automatically","Revision gate; unresolved critical issue stops progression"]
],12*mm,H-35*mm,[92*mm,181*mm],font=7.5)
section_label("Operating maxim",12*mm,49*mm,273*mm,fill=WINE)
para("The cheapest failed order is more expensive than the most expensive sample. Optimize first for fidelity, evidence, and recoverability—then for unit cost.",12*mm,37*mm,273*mm,22*mm,ParagraphStyle("maxim",parent=LEAD,fontName="Helvetica-Bold",fontSize=14,leading=18,textColor=INK,alignment=TA_CENTER))
finish()

# Sources and revision
base_page("SOURCES, PROVENANCE & REVISION","Full URLs and detailed notes are in the editable workbook and repository research memo.")
sources = [
    ["Canada","CBSA 2026 tariff Ch. 61/62; import guide; CARM; valuation"],
    ["Compliance","Competition Bureau textile labelling; Health Canada flammability"],
    ["Trade","Global Affairs Canada textiles/CETA origin quota FAQ"],
    ["FX","Bank of Canada Valet FXUSDCAD, 2026-07-31 = 1.4029"],
    ["Verification","Alibaba Verified Supplier; OEKO-TEX Label Check; WRAP facility map; Sedex limitations"],
    ["Inspection/testing","QIMA apparel/PSI; Intertek colourfastness"],
    ["Candidates","Topshow Alibaba/CNVerify/Made-in-China; Hangyue listing; China scarf supplier pages"],
    ["Benchmarks","MVFA Toronto; White Cotton; Create Fashion Brand; Hongyu; Billoomi"],
    ["Founder reports","Seven linked r/streetwearstartup failure-pattern threads; anecdotal only"],
    ["Visuals","GPT Images, created for this pack 2026-08-01; visual intent only"],
    ["Brand","Exact approved local VORG-EAVY logo asset; not generated or redrawn"]
]
table([["Category","Evidence set"],*sources],12*mm,H-35*mm,[47*mm,226*mm],font=7.1)
section_label("Revision",12*mm,48*mm,273*mm)
table([
    ["Version","Date","Scope","Status"],
    ["v0.1","2026-08-01","Initial RFQ/prototype pack, technical intent, research, budget, scorecard","SUPERSEDED"],
    ["v0.2","2026-08-01","Founder-directed jacket sleeve end: no cuff; continuous straight quilted sleeve with 3 cm stitched turnback","FOUNDER REVIEW"],
    ["v1.0","Pending","Sealed PP standard after all gates","BLOCKED"]
],12*mm,38*mm,[25*mm,33*mm,164*mm,51*mm],font=7)
finish()

c.save()
print(PDF)
