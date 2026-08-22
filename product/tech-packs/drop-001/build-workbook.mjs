import fs from "node:fs/promises";
import path from "node:path";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const ROOT = "C:/Users/mbaho/OneDrive/Documents/vorg-eavy-bible";
const THREAD = "019fbe68-eae2-7eb0-bfd0-2b66e455df0c";
const OUT = path.join(ROOT, "outputs", THREAD);
const PREVIEWS = path.join(OUT, "previews");
const ASSETS = path.join(ROOT, "product", "tech-packs", "drop-001", "assets");
await fs.mkdir(PREVIEWS, { recursive: true });

const C = {
  ink: "#0A0A0A", paper: "#F8F6F1", white: "#FFFFFF", silver: "#C7C5BF",
  line: "#D8D5CE", grey: "#6B6B67", pale: "#ECE9E2", blue: "#DDEBF7",
  green: "#E2F0D9", amber: "#FFF2CC", red: "#F4CCCC", wine: "#651C32", espresso: "#3A211B"
};

const wb = Workbook.create();

function title(sheet, text, subtitle, lastCol = "H") {
  sheet.showGridLines = false;
  sheet.mergeCells(`A1:${lastCol}2`);
  sheet.getRange("A1").values = [[text]];
  sheet.getRange(`A1:${lastCol}2`).format = {
    fill: C.ink, font: { color: C.white, bold: true, size: 22 },
    verticalAlignment: "center", horizontalAlignment: "left"
  };
  sheet.mergeCells(`A3:${lastCol}3`);
  sheet.getRange("A3").values = [[subtitle]];
  sheet.getRange(`A3:${lastCol}3`).format = {
    fill: C.paper, font: { color: C.grey, italic: true, size: 10 }, wrapText: true,
    verticalAlignment: "center"
  };
  sheet.getRange(`A1:${lastCol}200`).format.font = { name: "Aptos", size: 10 };
  sheet.getRange("A1").format.font = { name: "Aptos Display", size: 22, bold: true, color: C.white };
}

function header(sheet, range) {
  sheet.getRange(range).format = {
    fill: C.ink, font: { color: C.white, bold: true }, wrapText: true,
    verticalAlignment: "center", borders: { preset: "all", style: "thin", color: C.silver }
  };
}

function grid(sheet, range) {
  sheet.getRange(range).format = {
    borders: { preset: "all", style: "thin", color: C.line },
    verticalAlignment: "top", wrapText: true
  };
}

function widths(sheet, map) {
  for (const [col, width] of Object.entries(map)) sheet.getRange(`${col}:${col}`).format.columnWidth = width;
}

function statusRules(range) {
  range.conditionalFormats.add("containsText", { text: "approved", format: { fill: C.green, font: { color: "#274E13", bold: true } } });
  range.conditionalFormats.add("containsText", { text: "supplier to confirm", format: { fill: C.blue, font: { color: "#134F5C" } } });
  range.conditionalFormats.add("containsText", { text: "decision needed", format: { fill: C.amber, font: { color: "#7F6000", bold: true } } });
  range.conditionalFormats.add("containsText", { text: "blocked", format: { fill: C.red, font: { color: "#990000", bold: true } } });
}

async function dataUrl(file) {
  const bytes = await fs.readFile(file);
  return `data:image/png;base64,${bytes.toString("base64")}`;
}

const styles = [
  ["VE-FJ-001", "The Firm Jacket", "Unisex", "Black", "M", "Cropped quilted blouson; leather collar; straight continuous quilted sleeves with clean self-fabric ends; two-way silver zipper", "decision needed"],
  ["VE-WD-001", "Women's low-rise denim", "Women's", "Washed black", "28", "Low-rise relaxed straight/wide 5-pocket jean", "decision needed"],
  ["VE-MD-001", "Men's denim", "Men's", "Midnight indigo", "32", "Relaxed straight 5-pocket jean", "decision needed"],
  ["VE-SC-001", "Brushed scarf", "Unisex", "Espresso / burgundy", "OS", "Brushed woven scarf with controlled fringe and blank label area", "decision needed"],
  ["VE-WT-001", "Women's fitted long sleeve", "Women's", "Black", "S", "Fitted stretch jersey long-sleeve top", "decision needed"],
  ["VE-WB-001", "Women's bodysuit", "Women's", "Not selected", "TBD", "Deferred because torso fit, hygiene, and return risk are not yet proven", "blocked"]
];

// Cover
{
  const s = wb.worksheets.add("Cover");
  title(s, "VORG-EAVY / DROP 001", "Supplier RFQ + prototype specification draft / v0.2 / 2026-08-01", "J");
  s.mergeCells("A5:F8");
  s.getRange("A5").values = [["FIVE PRODUCT IDEAS.\nZERO BULK AUTHORIZATIONS."]];
  s.getRange("A5:F8").format = { fill: C.paper, font: { bold: true, size: 20, color: C.ink }, wrapText: true, verticalAlignment: "center" };
  s.mergeCells("A10:F15");
  s.getRange("A10").values = [["Use this workbook to quote, sample, measure, and compare. Visuals express intent only. Written measurements, BOM, construction notes, approved physical standards, sealed pre-production samples, and signed change control govern. Nothing here is production-ready."]];
  s.getRange("A10:F15").format = { fill: C.white, font: { size: 12, color: C.grey }, wrapText: true, verticalAlignment: "top", borders: { preset: "outside", style: "thin", color: C.line } };
  s.getRange("A18:C24").values = [
    ["Control", "Current truth", "Gate"],
    ["Budget", "C$6,000 landed-to-Ottawa cash cap", "Founder approval to revise"],
    ["Bulk status", "Blocked", "Quotes + fit + tests + PP + demand"],
    ["Country", "China-first sampling", "No country is automatically approved"],
    ["Supplier count", "Maximum two production relationships", "Capability proof"],
    ["Launch", "Nov 5–12, 2026 working window", "Vendor-backed critical path"],
    ["Version", "v0.2 RFQ/prototype", "Revision log controls"]
  ];
  header(s, "A18:C18"); grid(s, "A18:C24"); widths(s, {A:24,B:40,C:46,D:3,E:3,F:3,G:3,H:3,I:3,J:3});
  s.images.add({ dataUrl: await dataUrl(path.join(ROOT,"site","assets","logo_black.png")), anchor: { from: { row: 4, col: 6 }, extent: { widthPx: 410, heightPx: 410 } } });
  s.getRange("A27:J28").merge();
  s.getRange("A27").values = [["FOUNDER REVIEW REQUIRED BEFORE ANY RFQ IS RELEASED"]];
  s.getRange("A27:J28").format = { fill: C.wine, font: { color: C.white, bold: true, size: 13 }, horizontalAlignment: "center", verticalAlignment: "center" };
}

// Evidence & Limits
{
  const s = wb.worksheets.add("Evidence & Limits");
  title(s, "EVIDENCE & LIMITS", "Keep known facts, working assumptions, open questions, and blockers separate.", "F");
  const rows = [
    ["Type","Subject","Statement","Owner / evidence","Status","Next action"],
    ["Known","Product set","Jacket, women's denim, men's denim, scarf, women's top/bodysuit","Founder-stated active set","approved","Preserve roles"],
    ["Known","Cash ceiling","C$5,000–C$6,000 initial inventory/production spend","Repo mission","approved","Model all-in cash"],
    ["Known","Launch date","Nov 5–12, 2026 is conditional, not public commitment","Repo mission","approved","Reverse schedule only after quotes"],
    ["Assumption","Top direction","Black long-sleeve top replaces bodysuit for first proof round","Risk-control decision","decision needed","Founder confirms"],
    ["Assumption","Measurements","All starting POMs are prototype assumptions","This pack v0.2","decision needed","Fit on bodies and revise"],
    ["Assumption","Materials","Weights/compositions are target ranges, not nominated articles","This pack v0.2","supplier to confirm","Submit swatches and data sheets"],
    ["Known","Jacket sleeve end","No separate cuff: straight continuous quilted sleeve with an approximately 3 cm self-fabric turned hem and precise parallel topstitching","Founder direction 2026-08-01","approved","Factory preserves without taper or substitution"],
    ["Assumption","Budget","17.5% blended duty and logistics allowances","Live research + planning","decision needed","Broker and supplier quotes"],
    ["Open","Patterns","No approved base or graded patterns","Missing artifact","blocked","Patternmaker/factory develops"],
    ["Open","Factories","No shortlisted factory has passed identity, sample, or inspection gates","Desktop research only","blocked","Run vetting protocol"],
    ["Open","Tests","No wash, colourfastness, shrinkage, flammability, or fibre reports","Missing evidence","blocked","Test intended bulk materials"],
    ["Open","Demand","No current product-level price-revealed proof attached","Missing evidence","blocked","Run demand gate"],
    ["Open","PO","No final quantity, size curve, Incoterm, or ship window","Missing quotes/proof","blocked","Do not issue bulk PO"]
  ];
  s.getRange(`A5:F${4+rows.length}`).values = rows; header(s,"A5:F5"); grid(s,`A5:F${4+rows.length}`);
  statusRules(s.getRange(`E6:E${4+rows.length}`));
  widths(s,{A:14,B:20,C:62,D:32,E:22,F:36}); s.freezePanes.freezeRows(5);
}

// Visual References
{
  const s = wb.worksheets.add("Visual References");
  title(s, "VISUAL REFERENCES", "Generated visual intent. Exact measurements and approved physical samples control manufacturing.", "N");
  const refs = [
    ["VE-FJ-001","VE-FJ-001-tech-flat-v0.2.png",5,0],
    ["VE-FJ-001 DETAILS","VE-FJ-001-construction-details-v0.2.png",5,7],
    ["VE-WD-001","VE-WD-001-tech-flat-v0.1.png",25,0],
    ["VE-MD-001","VE-MD-001-tech-flat-v0.1.png",25,7],
    ["DENIM DETAILS","VE-DENIM-001-construction-details-v0.1.png",45,0],
    ["VE-WT-001","VE-WT-001-tech-flat-v0.1.png",45,7],
    ["VE-SC-001","VE-SC-001-tech-flat-details-v0.1.png",65,0]
  ];
  for (const [label,file,row,col] of refs) {
    s.getCell(row-1,col).values = [[label]];
    s.getCell(row-1,col).format = { fill: C.ink, font:{color:C.white,bold:true} };
    s.images.add({ dataUrl: await dataUrl(path.join(ASSETS,file)), anchor: { from: { row, col }, extent: { widthPx: 570, heightPx: 570 } } });
  }
  for (let c=0;c<14;c++) s.getRangeByIndexes(0,c,90,1).format.columnWidth = 10;
  s.getRange("A86:N88").merge();
  s.getRange("A86").values = [["PROVENANCE — Created with GPT Images for this VORG-EAVY RFQ/prototype pack on 2026-08-01. No third-party garment image is claimed as the product. Approved local VORG-EAVY logo asset is used only on the cover; generated drawings intentionally leave label zones blank."]];
  s.getRange("A86:N88").format = { fill:C.paper, font:{color:C.grey,italic:true}, wrapText:true, borders:{preset:"outside",style:"thin",color:C.line} };
}

// Style Summary
{
  const s = wb.worksheets.add("Style Summary");
  title(s,"STYLE SUMMARY","One controlled line plan; separate styles and blocks; no substitute colours without approval.","G");
  const rows = [["Style ID","Product","Department","Colour / wash","Base size","Silhouette / intent","Status"], ...styles];
  s.getRange(`A5:G${4+rows.length}`).values=rows; header(s,"A5:G5"); grid(s,`A5:G${4+rows.length}`); statusRules(s.getRange(`G6:G${4+rows.length}`));
  s.getRange("G6:G20").dataValidation={rule:{type:"list",values:["approved","supplier to confirm","decision needed","blocked"]}};
  widths(s,{A:16,B:30,C:14,D:24,E:12,F:58,G:22}); s.freezePanes.freezeRows(5);
}

// Material research
{
  const s=wb.worksheets.add("Material Research");
  title(s,"FABRIC / MATERIAL RESEARCH","Targets are development briefs. Supplier must identify exact mill, article, lot, composition, weight, and test evidence.","I");
  const rows=[
    ["Style","Component","Target","Weight","Performance intent","Supplier submission","Risk","Status","Approval evidence"],
    ["VE-FJ-001","Shell","Cotton-rich coated or dense twill; matte black","260–300 gsm","Structure, low shine, abrasion resistance","Mill/article/composition/finish/width/price","Coating variation; bulk handfeel","supplier to confirm","Approved cutting + test report"],
    ["VE-FJ-001","Insulation","Low-loft polyester wadding","60–80 gsm","Controlled diamond quilt without puffiness","Article/loft/shrinkage","Migration and uneven loft","supplier to confirm","Quilt panel sample"],
    ["VE-FJ-001","Lining","Smooth woven polyester/viscose","55–75 gsm","Low friction, opacity","Article/composition/colourfastness","Dye transfer","supplier to confirm","Approved lining card"],
    ["VE-FJ-001","Collar","Black genuine leather; smooth premium grain and low sheen","0.8–1.0 mm starting target","Clean contrast texture and stable edge","Species/tannery/grade/thickness/finish/colourfastness/restricted-substance evidence","Shade, cracking, finish transfer, unsupported leather claim","supplier to confirm","Approved leather card + collar mock-up + tests"],
    ["VE-WD-001","Denim","Cotton-rich rigid or comfort-rigid denim","12–13 oz","Low-rise shape, controlled washed black","Mill/lot/composition/shrink/crock","Crocking, shrink, shade bands","supplier to confirm","Wash blanket + lab tests"],
    ["VE-MD-001","Denim","Cotton-rich rigid denim","12.5–13.5 oz","Midnight-indigo depth and recovery","Mill/lot/composition/shrink/crock","Bleeding, twist, shade bands","supplier to confirm","Wash blanket + lab tests"],
    ["VE-WT-001","Jersey","Lyocell/modal-rich jersey with elastane","180–220 gsm","Soft fitted body, opacity, recovery","Composition/GSM/stretch/recovery","Sheer, growth, seam waviness","supplier to confirm","Full-width swatch + wear test"],
    ["VE-SC-001","Woven body","Provisional 70% recycled polyester / 30% wool","260–320 gsm","Brushed hand, low shedding","Exact fibre test/GSM/finish","Pilling, shedding, false fibre claim","decision needed","Independent fibre + pilling test"]
  ];
  s.getRange(`A5:I${4+rows.length}`).values=rows; header(s,"A5:I5"); grid(s,`A5:I${4+rows.length}`); statusRules(s.getRange(`H6:H${4+rows.length}`));
  widths(s,{A:15,B:18,C:44,D:16,E:36,F:38,G:31,H:22,I:30}); s.freezePanes.freezeRows(5);
}

// BOM
{
  const s=wb.worksheets.add("BOM");
  title(s,"BILL OF MATERIALS","No substitutions without written change control and a new approved sample.","J");
  const rows=[
    ["Style","Item","Placement","Specification","Colour","Qty / garment","Supplier","Unit cost","Status","Proof required"],
    ["VE-FJ-001","Shell","Body/sleeves","Per Material Research","Black","TBC","TBC","TBC","supplier to confirm","Cutting + bulk lot card"],
    ["VE-FJ-001","Two-way zipper","CF","Silver-tone metal; smooth pull; locking slider","Silver","1","TBC","TBC","supplier to confirm","Approved trim + cycle test"],
    ["VE-FJ-001","Sleeve-end hem","Both sleeve openings","No separate cuff component; shell continues straight to wrist; 3 cm self-fabric turnback with two precise parallel topstitch rows","Black","2 sleeve ends","TBC","TBC","approved","Founder direction + measured sample"],
    ["VE-FJ-001","Wadding + lining","Interior","Per Material Research","Black","TBC","TBC","TBC","supplier to confirm","Quilt panel"],
    ["VE-WD-001","Denim","Body","12–13 oz cotton-rich","Washed black","TBC","TBC","TBC","supplier to confirm","Wash blanket + tests"],
    ["VE-WD-001","Tack button / zipper","Waist/fly","Nickel-free metal; YKK or approved equal","Gunmetal","1 each","TBC","TBC","supplier to confirm","Exact supplier + finish"],
    ["VE-MD-001","Denim","Body","12.5–13.5 oz cotton-rich","Midnight indigo","TBC","TBC","TBC","supplier to confirm","Wash blanket + tests"],
    ["VE-MD-001","Tack button / zipper","Waist/fly","Nickel-free metal; YKK or approved equal","Antique nickel","1 each","TBC","TBC","supplier to confirm","Exact supplier + finish"],
    ["VE-WT-001","Jersey","Body/sleeves","180–220 gsm lyocell/modal-rich stretch","Black","TBC","TBC","TBC","supplier to confirm","Bulk roll + tests"],
    ["VE-SC-001","Woven body","Full scarf","260–320 gsm provisional blend","Espresso/Burgundy","1","TBC","TBC","decision needed","Fibre and pilling report"],
    ["ALL","Main label","CB neck/waist/edge","Approved VORG-EAVY artwork only","Black/white","1","TBC","TBC","blocked","Exact artwork + strike-off"],
    ["ALL","Care/content label","Interior","Bilingual fibre/care/dealer/origin copy after review","Black/white","1","TBC","TBC","blocked","Compliance approval"],
    ["ALL","Packaging","Per unit","Recycled polybag or paper alternative; suffocation warning if applicable","Clear/black","1","TBC","TBC","decision needed","Packing test"]
  ];
  s.getRange(`A5:J${4+rows.length}`).values=rows; header(s,"A5:J5"); grid(s,`A5:J${4+rows.length}`); statusRules(s.getRange(`I6:I${4+rows.length}`));
  widths(s,{A:15,B:22,C:18,D:49,E:18,F:16,G:18,H:14,I:22,J:34}); s.freezePanes.freezeRows(5);
}

// POM
{
  const s=wb.worksheets.add("POM & Size Spec");
  title(s,"POM & STARTING SIZE SPEC","Centimetres. Base-size prototype assumptions only. Grade after approved base fit; factory returns measured sample and graded nest.","H");
  const data={
    "VE-FJ-001 / base M":[["01","1/2 chest",61,1,"2.5 cm below armhole"],["02","1/2 hem",58,1,"Straight"],["03","HPS length",58,1,"HPS to hem"],["04","Shoulder",51,0.7,"Seam to seam"],["05","Sleeve length",62.5,0.7,"Shoulder seam to finished sleeve edge"],["06","1/2 bicep",24.5,0.7,"2.5 cm below armhole"],["07","1/2 sleeve opening",16,0.7,"Finished edge flat; must not cinch or taper"],["08","Sleeve-end turnback depth",3,0.3,"Finished self-fabric hem depth"],["09","Collar fall",7.5,0.5,"CB"],["10","CF zipper length",54,0.5,"End to end"],["11","Pocket opening",16,0.5,"Usable opening"],["12","Diamond quilt",3.5,0.3,"Nominal repeat"]],
    "VE-WD-001 / base 28":[["01","1/2 waistband",39,1,"Along top edge"],["02","Front rise",20.5,0.7,"Incl. waistband"],["03","Back rise",31.5,0.7,"Incl. waistband"],["04","1/2 hip",50.5,1,"20 cm below top edge"],["05","1/2 thigh",31.5,0.7,"2.5 cm below crotch"],["06","1/2 knee",25.5,0.7,"At half inseam"],["07","1/2 leg opening",24,0.7,"Flat"],["08","Inseam",81,0.7,"Crotch to hem"],["09","Outseam",103.5,1,"Top edge to hem"],["10","Fly length",11.5,0.5,"Visible seam"]],
    "VE-MD-001 / base 32":[["01","1/2 waistband",43,1,"Along top edge"],["02","Front rise",28.5,0.7,"Incl. waistband"],["03","Back rise",39.5,0.7,"Incl. waistband"],["04","1/2 hip",55.5,1,"20 cm below top edge"],["05","1/2 thigh",34,0.7,"2.5 cm below crotch"],["06","1/2 knee",26,0.7,"At half inseam"],["07","1/2 leg opening",23.5,0.7,"Flat"],["08","Inseam",81,0.7,"Crotch to hem"],["09","Outseam",108.5,1,"Top edge to hem"],["10","Fly length",17,0.5,"Visible seam"]],
    "VE-WT-001 / base S":[["01","1/2 chest",38,0.7,"2.5 cm below armhole"],["02","1/2 waist",32.5,0.7,"Narrowest"],["03","1/2 hem",39,0.7,"Straight"],["04","HPS length",57,0.7,"HPS to hem"],["05","Shoulder",34.5,0.5,"Seam to seam"],["06","Sleeve length",64,0.7,"Shoulder seam to edge"],["07","1/2 bicep",13.5,0.5,"2.5 cm below armhole"],["08","Cuff opening",8.5,0.5,"Flat"],["09","Neck width",17.5,0.5,"Seam to seam"],["10","Front neck drop",8,0.5,"HPS line to seam"]],
    "VE-SC-001 / OS":[["01","Body width",30,1,"Excluding fringe"],["02","Body length",180,2,"Excluding fringe"],["03","Fringe length each end",9,0.5,"Finished average"],["04","Total length",198,2,"Including fringe"]]
  };
  let row=5;
  for (const [group,entries] of Object.entries(data)) {
    s.mergeCells(`A${row}:H${row}`); s.getRange(`A${row}`).values=[[group]];
    s.getRange(`A${row}:H${row}`).format={fill:C.wine,font:{color:C.white,bold:true,size:12}}; row++;
    s.getRange(`A${row}:H${row}`).values=[["POM","Measurement","Target cm","Tolerance ± cm","How measured","Sample 1","PP sample","Status"]]; header(s,`A${row}:H${row}`); row++;
    const start=row;
    s.getRange(`A${row}:H${row+entries.length-1}`).values=entries.map(x=>[...x,"","","decision needed"]);
    grid(s,`A${row}:H${row+entries.length-1}`); statusRules(s.getRange(`H${row}:H${row+entries.length-1}`)); row+=entries.length+1;
  }
  widths(s,{A:11,B:31,C:13,D:16,E:39,F:14,G:14,H:22}); s.freezePanes.freezeRows(4);
}

// Construction
{
  const s=wb.worksheets.add("Construction");
  title(s,"CONSTRUCTION","Callouts describe intent. Factory must propose stitch class, SPI, seam allowance, machinery, and reinforcement for approval.","H");
  const rows=[
    ["Style","Zone","Construction intent","Starting callout","Failure to avoid","Factory response","Proof","Status"],
    ["VE-FJ-001","Body","Cropped blouson with symmetric diamond quilting","3.5 cm nominal diamonds; pattern matched across major seams","Drifted quilting, bulky loft","TBC","Quilt panel + inside photos","supplier to confirm"],
    ["VE-FJ-001","Collar","Clean smooth black genuine-leather turn-down collar; edge controlled","Factory states leather spec, internal support, stitch/edge method","Rolling, cracking, transfer, asymmetry","TBC","Leather card + collar mock-up","supplier to confirm"],
    ["VE-FJ-001","Sleeve end","Continuous quilted sleeve runs straight to wrist with no separate cuff","3 cm self-fabric turnback; two subtle parallel topstitch rows; full opening remains straight","Any taper, cinch, gathering, rib, band, elastic, gusset, closure, bulky turn, or uneven stitching","TBC","Front/back/detail photos + measured opening","approved"],
    ["VE-FJ-001","CF","Exposed two-way zipper centered and wave-free","Reinforce zipper base/top; no exposed raw edges","Zipper wave, misalignment","TBC","Function test","supplier to confirm"],
    ["VE-FJ-001","Pockets","Symmetric welt/slash pocket direction","Bar tack ends; clean lining bag","Uneven openings","TBC","Measured sample","supplier to confirm"],
    ["VE-WD-001","Waist/rise","Contoured low-rise waistband; clean fly","Waistband non-roll; secure zipper stop","Waist gap, fly flare","TBC","Fit sample on bodies","supplier to confirm"],
    ["VE-MD-001","Waist/rise","Men's block, independent from women's block","Reinforce fly and belt loops","Reused women's block","TBC","Pattern/fit evidence","supplier to confirm"],
    ["VE-WD-001","Wash","Washed black with controlled seam highs","Approve wash blanket and sealed garment","Random abrasion, shade bands","TBC","Lot map + wash report","supplier to confirm"],
    ["VE-MD-001","Wash","Midnight indigo; minimal uncontrolled contrast","Approve wash blanket and sealed garment","Bleeding, leg twist","TBC","Lot map + wash report","supplier to confirm"],
    ["DENIM","Seams","Stress seams durable; pocket/loop ends reinforced","Factory proposes chain/lock stitch and SPI","Seam grin, weak bar tacks","TBC","Pull/function test","supplier to confirm"],
    ["VE-WT-001","Body seams","Stretch-compatible clean seams","Factory proposes overlock/coverstitch; no popped seams","Tunnelling, waviness","TBC","Stretch/recovery wear test","supplier to confirm"],
    ["VE-SC-001","Edges/fringe","Secure edge and even fringe","Fringe combed, tied/secured as sample","Shedding, unraveling","TBC","10-cycle handling check","supplier to confirm"]
  ];
  s.getRange(`A5:H${4+rows.length}`).values=rows; header(s,"A5:H5"); grid(s,`A5:H${4+rows.length}`); statusRules(s.getRange(`H6:H${4+rows.length}`));
  widths(s,{A:15,B:18,C:44,D:42,E:32,F:32,G:31,H:22}); s.freezePanes.freezeRows(5);
}

// Colorways
{
  const s=wb.worksheets.add("Colorways");
  title(s,"COLOURWAYS & PHYSICAL STANDARDS","Screen colours are communication aids only. Bulk colour is controlled by an approved physical standard and lot/shade band.","H");
  const rows=[
    ["Style","Marketing colour","Screen reference","Bulk plan","Physical standard","Lot control","Status","Decision"],
    ["VE-FJ-001","Black","#0A0A0A","One colour","Submit shell/lining/leather-collar/zipper physical set","No mixed dye lots or unmatched collar without approval","decision needed","Founder approves black system"],
    ["VE-WD-001","Washed black","#242424","One wash","Wash blanket + sealed garment","Shade-band range attached to PO","decision needed","Founder approves abrasion level"],
    ["VE-MD-001","Midnight indigo","#111B30","One wash","Wash blanket + sealed garment","Shade-band range attached to PO","decision needed","Founder approves depth"],
    ["VE-WT-001","Black","#0A0A0A","Black bulk; white sample only","Lab dip + opacity sample","One dye lot preferred","decision needed","Defer white bulk"],
    ["VE-SC-001","Espresso","#3A211B","Possible colour 1","Yarn/fabric standard","Shade band","decision needed","Confirm demand and fibre"],
    ["VE-SC-001","Burgundy","#651C32","Possible colour 2","Yarn/fabric standard","Shade band","decision needed","Confirm demand and fibre"]
  ];
  s.getRange(`A5:H${4+rows.length}`).values=rows; header(s,"A5:H5"); grid(s,`A5:H${4+rows.length}`); statusRules(s.getRange(`G6:G${4+rows.length}`));
  s.getRange("C6").format.fill=C.ink; s.getRange("C7").format.fill="#242424"; s.getRange("C8").format.fill="#111B30"; s.getRange("C9").format.fill=C.ink; s.getRange("C10").format.fill=C.espresso; s.getRange("C11").format.fill=C.wine;
  s.getRange("C6:C11").format.font={color:C.white}; widths(s,{A:15,B:22,C:18,D:26,E:46,F:36,G:22,H:35}); s.freezePanes.freezeRows(5);
}

// Testing and labels
{
  const s=wb.worksheets.add("Testing & Labels");
  title(s,"TESTING, LABELS & PACKING","Testing level is risk-based. Compliance and care copy require final material and legal review.","H");
  const rows=[
    ["Applies","Test / control","Working requirement","When","Evidence","Authority","Status","Stop-ship trigger"],
    ["ALL","Fibre composition","Independent fibre verification for claimed blend","Intended bulk material","Lab report / lot match","Competition Bureau label rules","blocked","Claim differs from result"],
    ["ALL","Flammability","Meet Canadian Textile Flammability Regulations","Pre-production","Accredited report","Health Canada","blocked","Failure"],
    ["ALL","Dimensional stability","Record wash/dry shrinkage; approve care method","Proto + PP","Before/after measurements","Product requirement","supplier to confirm","Outside approved tolerance"],
    ["VE-FJ-001","Sleeve-end construction","Confirm straight 1/2 opening, 3 cm turnback, twin parallel stitch, quilting continuity and no cinch","Proto + PP + PSI","Measured sample + mirrored close-up","Founder design control","blocked","Any taper, cuff component, distortion, or uneven hem"],
    ["VE-FJ-001","Leather collar","Thickness, species/type, finish adhesion, flex/cracking, dry/wet rub and applicable restricted-substance evidence","Intended collar material + PP","Supplier/lab reports tied to leather lot","Product/material requirement","blocked","Unverified leather, transfer, cracking, shade or finish mismatch"],
    ["DENIM","Dry/wet crocking","Set acceptable grade with test lab before PO","Wash blanket + bulk lot","Lab report","Intertek test capability reference","blocked","Excess transfer"],
    ["DENIM","Wash/colourfastness","Wash, perspiration, water as advised by lab","Wash blanket + bulk lot","Lab report","Intertek test capability reference","blocked","Visible unacceptable change"],
    ["DENIM","Hardware / seams","Zipper cycle, tack security, bar tacks, seam function","PP + PSI","Inspection record","Product requirement","supplier to confirm","Function failure"],
    ["VE-WT-001","Stretch/recovery/opacity","Wear and recovery test across intended sizes","Proto + PP","Wear-test log","Product requirement","blocked","Sheer, growth, popped seam"],
    ["VE-SC-001","Pilling/shedding","Set method with lab; compare after handling/wear","Proto + bulk lot","Lab/handling report","Product requirement","blocked","Uncontrolled pilling/shedding"],
    ["ALL","Labels","Fibre % by mass, dealer identity, bilingual names/care, accurate origin","Before PP","Approved artwork + sewn placement","Competition Bureau","blocked","Incorrect/missing copy"],
    ["ALL","Logo","Approved local artwork only; no redrawn mark","Strike-off before PP","Signed artwork/strike-off","VORG-EAVY brand control","blocked","Approximate/redrawn logo"],
    ["ALL","Packing","Correct style/size/colour barcode and count","PSI","Packing list + photos","PO","supplier to confirm","Mismatch"],
    ["ALL","Needle/metal control","Factory documents broken-needle control","Production","Log + scan policy","Product safety control","supplier to confirm","Uncontrolled metal risk"]
  ];
  s.getRange(`A5:H${4+rows.length}`).values=rows; header(s,"A5:H5"); grid(s,`A5:H${4+rows.length}`); statusRules(s.getRange(`G6:G${4+rows.length}`));
  widths(s,{A:15,B:28,C:50,D:20,E:32,F:31,G:22,H:34}); s.freezePanes.freezeRows(5);
}

// RFQ
{
  const s=wb.worksheets.add("Supplier RFQ");
  title(s,"SUPPLIER RFQ RESPONSE","Supplier completes every blue field and attaches evidence. Quote each style separately; state custom MOQ, not wholesale-stock MOQ.","N");
  s.getRange("A5:N5").values=[["Style","Legal entity","Factory address","Factory/trader","Custom MOQ/style/colour","Sample US$","FOB unit US$","Incoterm/port","Sample days","Bulk days","Subcontractors","Material article","Validity","Status"]]; header(s,"A5:N5");
  const rows=styles.slice(0,5).map(x=>[x[0],"","","","","","","","","","","","","supplier to confirm"]);
  s.getRange("A6:N10").values=rows; grid(s,"A5:N10"); s.getRange("B6:M10").format.fill=C.blue; statusRules(s.getRange("N6:N10"));
  s.getRange("A13:F24").values=[
    ["Company evidence","Required response","Attached/link","Reviewer","Result","Status"],
    ["Business licence","Legal name + 18-digit credit code","","","","supplier to confirm"],
    ["Bank match","Invoice/payee/bank entity match","","","","supplier to confirm"],
    ["Factory assessment","Current third-party report downloaded from profile","","","","supplier to confirm"],
    ["Live video","Dated walk-through with VORG-EAVY card","","","","supplier to confirm"],
    ["Subcontractors","Legal names/addresses/functions","","","","supplier to confirm"],
    ["Machine/capability list","Cut/sew/quilt/leather collar/denim/wash/knit/finish","","","","supplier to confirm"],
    ["Comparable references","Two recent sub-150-unit customers","","","","supplier to confirm"],
    ["Certificates","IDs, facility, scope, expiry; independently verified","","","","supplier to confirm"],
    ["Sample invoice","Cost/ship/lead/material/rounds","","","","supplier to confirm"],
    ["Commercial terms","Deposit/balance, inspection, remedies, no substitutions","","","","supplier to confirm"],
    ["Freight data","Carton count/size/weight/port/HS inputs","","","","supplier to confirm"]
  ];
  header(s,"A13:F13"); grid(s,"A13:F24"); s.getRange("C14:E24").format.fill=C.blue; statusRules(s.getRange("F14:F24"));
  widths(s,{A:17,B:26,C:28,D:18,E:25,F:15,G:15,H:22,I:14,J:14,K:30,L:30,M:15,N:22}); s.freezePanes.freezeRows(5);
}

// Supplier Scorecard
{
  const s=wb.worksheets.add("Supplier Scorecard");
  title(s,"SUPPLIER SCORECARD","Desktop research does not approve a supplier. Blank sample and test evidence keeps every candidate below the 75-point gate.","N");
  s.getRange("A5:N5").values=[["Candidate","Route/use","Identity /10","Capability /15","Sample /20","Material /15","MOQ/cost /10","Comms /5","Compliance /5","Lead/freight /10","Payment /5","References /5","Total /100","Decision"]]; header(s,"A5:N5");
  const candidates=[
    ["Dongguan Topshow","Jacket/top RFQ",6,7,0,2,5,3,3,6,5,2,"","RFQ only"],
    ["Dongguan Hangyue","Denim challenger",4,6,0,2,6,3,2,5,4,1,"","RFQ only"],
    ["Hebei Dilly","Ready-stock scarf",4,6,0,1,7,3,2,5,4,1,"","RFQ only"],
    ["Hohhot Sona","Cashmere benchmark",4,7,0,3,2,3,2,5,4,1,"","Benchmark"],
    ["MVFA Toronto","Domestic benchmark",6,8,0,2,2,3,2,7,3,1,"","Budget mismatch"],
    ["White Cotton","Portugal benchmark",5,6,0,2,2,3,3,5,3,1,"","Budget/MOQ mismatch"],
    ["Billoomi","India hold",4,5,0,1,2,2,1,3,3,0,"","Hold"]
  ];
  s.getRange("A6:N12").values=candidates; grid(s,"A5:N12");
  for(let r=6;r<=12;r++) s.getRange(`M${r}`).formulas=[[`=SUM(C${r}:L${r})`]];
  s.getRange("M6:M12").format.numberFormat="0";
  s.getRange("M6:M12").conditionalFormats.add("colorScale",{criteria:[{type:"lowestValue",color:"#F4CCCC"},{type:"percentile",value:50,color:"#FFF2CC"},{type:"highestValue",color:"#D9EAD3"}]});
  s.getRange("A15:C26").values=[
    ["Hard gate","Current result","Required"],
    ["Score","Fail","≥75/100"],["Legal identity","Blocked","Exact entity/bank match"],["Live facility","Blocked","Dated live walk-through"],["Paid sample","Blocked","Measured and reviewed"],["Revised fit","Blocked","All critical comments closed"],["PP sample","Blocked","Sealed bulk standard"],["Material tests","Blocked","Passed intended bulk lots"],["Demand","Blocked","40 overall + 8/product at shown price"],["Cash","Blocked","Landed model ≤ C$6,000"],["Inspection","Blocked","Contracted PSI / no stop-ship defect"],["Bulk PO","NO-GO","Founder signs gate"]
  ]; header(s,"A15:C15"); grid(s,"A15:C26"); statusRules(s.getRange("B16:B26"));
  widths(s,{A:27,B:27,C:14,D:16,E:14,F:14,G:14,H:12,I:15,J:16,K:14,L:15,M:15,N:22}); s.freezePanes.freezeRows(5);
}

// Budget
{
  const s=wb.worksheets.add("Landed Budget");
  title(s,"C$6,000 LANDED CASH MODEL","Editable blue inputs. Planning model only; supplier, freight, broker, and tax evidence must replace assumptions before a PO.","H");
  s.getRange("A5:D5").values=[["Input","Value","Unit","Source / status"]]; header(s,"A5:D5");
  s.getRange("A6:D13").values=[
    ["Cash cap",6000,"CAD","Founder ceiling / approved"],
    ["USD/CAD",1.4029,"CAD per USD","Bank of Canada 2026-07-31"],
    ["Planning duty",0.175,"% of merchandise","Working blended assumption; broker confirms"],
    ["Import GST",0.05,"%","Working cash assumption; accountant confirms recoverability"],
    ["Merchandise invoice",3900,"CAD","Maximum planning envelope, not quote"],
    ["International freight",650,"CAD","Consolidated working allowance"],
    ["Brokerage",120,"CAD","Working allowance"],
    ["Independent PSI",250,"CAD","Working allowance"]
  ]; grid(s,"A5:D13"); s.getRange("B6:B13").format.fill=C.blue; s.getRange("B6:B13").format.numberFormat="#,##0.00";
  s.getRange("A16:D16").values=[["Calculated use","CAD","Formula","Interpretation"]]; header(s,"A16:D16");
  s.getRange("A17:D23").values=[
    ["Merchandise",0,"Input link","65% of cap target"],["Freight",0,"Input link","One consolidated lane"],["Duty",0,"Merchandise × rate","Exact tariff pending"],["GST cash",0,"(Merchandise + duty) × rate","Conservative placeholder"],["Brokerage",0,"Input link","Quote pending"],["Inspection",0,"Input link","Do not remove to force fit"],["Contingency",0,"Cap − uses","Must remain non-negative"]
  ];
  s.getRange("B17").formulas=[["=B10"]]; s.getRange("B18").formulas=[["=B11"]]; s.getRange("B19").formulas=[["=B10*B8"]]; s.getRange("B20").formulas=[["=(B10+B19)*B9"]]; s.getRange("B21").formulas=[["=B12"]]; s.getRange("B22").formulas=[["=B13"]]; s.getRange("B23").formulas=[["=B6-SUM(B17:B22)"]];
  grid(s,"A16:D23"); s.getRange("B17:B23").format.numberFormat="$#,##0.00"; s.getRange("B23").conditionalFormats.add("cellIs",{operator:"lessThan",formula:0,format:{fill:C.red,font:{bold:true,color:"#990000"}}});
  s.getRange("F5:H5").values=[["Decision","Value","Gate"]]; header(s,"F5:H5");
  s.getRange("F6:H12").values=[
    ["Total cash use","","≤ C$6,000"],["Factory share","","Target about 65%"],["All-five bulk","NO-GO","MOQs/quotes unproven"],["Sampling tournament","GO","Separate development envelope"],["Country split","NO-GO","Duplicate costs"],["Max production relationships",2,"Generalist + denim specialist"],["Bulk assortment",2,"2–3 winners only"]
  ];
  s.getRange("G6").formulas=[["=SUM(B17:B23)"]]; s.getRange("G7").formulas=[["=B10/B6"]]; s.getRange("G6").format.numberFormat="$#,##0.00"; s.getRange("G7").format.numberFormat="0.0%"; grid(s,"F5:H12");
  s.getRange("F15:H21").values=[
    ["Allocation order","Rule","Status"],
    ["1","Reserve freight/duty/GST/broker/inspection first","approved"],
    ["2","Fund two strongest proof scores to depth","decision needed"],
    ["3","Add third style only if MOQ and cash still pass","decision needed"],
    ["4","Keep unproven styles at sample status","approved"],
    ["5","Do not increase quantity for unit discount alone","approved"],
    ["6","No bulk deposit before sealed PP approval","approved"]
  ]; header(s,"F15:H15"); grid(s,"F15:H21"); statusRules(s.getRange("H16:H21"));
  widths(s,{A:30,B:18,C:20,D:48,E:4,F:32,G:22,H:42}); s.freezePanes.freezeRows(5);
}

// Revision log
{
  const s=wb.worksheets.add("Revision Log");
  title(s,"REVISION LOG","Every supplier issue and founder decision receives a dated version. Never overwrite the approved standard silently.","G");
  s.getRange("A5:G5").values=[["Version","Date","Author","Scope","Change","Evidence/approver","Status"]]; header(s,"A5:G5");
  s.getRange("A6:G9").values=[
    ["v0.1","2026-08-01","Codex","Five-style RFQ/prototype pack","Initial controlled specification, sourcing memo, cost model, and technical-intent visuals","Superseded by founder sleeve-end direction","decision needed"],
    ["v0.2","2026-08-01","Founder + Codex","VE-FJ-001 sleeve end","Remove separate cuff. Continue quilted sleeve straight to full opening; add 3 cm self-fabric turned hem with precise parallel topstitch. Retain leather collar.","Founder-directed; visuals regenerated","approved"],
    ["v0.3","","","Supplier RFQ issue","","","blocked"],
    ["v1.0","","","Sealed PP standard","Only after fit, testing, cash, and inspection plan clear","","blocked"]
  ]; grid(s,"A5:G9"); statusRules(s.getRange("G6:G9")); widths(s,{A:12,B:15,C:20,D:27,E:58,F:35,G:22}); s.freezePanes.freezeRows(5);
}

// Sources
{
  const s=wb.worksheets.add("Sources");
  title(s,"SOURCES & PROVENANCE","Live links checked 2026-08-01. Marketplace/vendor claims are self-reported unless independently verified.","D");
  const sources=[
    ["Category","Source","URL","Use / limit"],
    ["FX","Bank of Canada Valet","https://www.bankofcanada.ca/valet/observations/FXUSDCAD/json?start_date=2026-07-30&end_date=2026-07-31","2026-07-31 USD/CAD observation"],
    ["Tariff","CBSA Chapter 62","https://www.cbsa-asfc.gc.ca/trade-commerce/tariff-tarif/2026/html/00/ch62-eng.html","Denim/outerwear tariff planning; broker classifies"],
    ["Tariff","CBSA Chapter 61","https://www.cbsa-asfc.gc.ca/trade-commerce/tariff-tarif/2026/html/00/ch61-eng.html","Knit top tariff planning"],
    ["Import","CBSA import guide","https://www.cbsa-asfc.gc.ca/import/guide-3-eng.html","Importer responsibility and GST"],
    ["Import","CBSA CARM","https://www.cbsa-asfc.gc.ca/services/carm-gcra/start-passer-eng.html","BN/RM registration"],
    ["Compliance","Competition Bureau textile labelling","https://competition-bureau.canada.ca/en/labelling-textile-requirements-nutshell","Fibre and dealer identity"],
    ["Safety","Health Canada flammability","https://www.canada.ca/en/health-canada/services/consumer-product-safety/reports-publications/industry-professionals/industry-guide-flammability-textile.html","Canadian textile flammability"],
    ["Verification","Alibaba Verified Supplier","https://seller.alibaba.com/verified-supplier?language=en_US","Assessment report exists; badge not product approval"],
    ["Verification","OEKO-TEX label check","https://www.oeko-tex.com/en/label-check","Verify exact certificate ID/scope"],
    ["Verification","WRAP facility map","https://wrapcompliance.org/en/certification/facility-monitor-list/","Verify exact production unit"],
    ["Verification","Sedex limitations","https://www.sedex.com/fr/quest-ce-quon-fait-chez-sedex/","SMETA is not certification/pass-fail"],
    ["Inspection","QIMA apparel","https://www.qima.com/consumer-products/softlines/apparel","Inspection scope"],
    ["Inspection","QIMA PSI","https://blog.qima.com/quality-control/pre-shipment-inspection-procedure","PSI timing at 80% packed"],
    ["Testing","Intertek denim colourfastness","https://www.intertek.com/textiles-apparel/colorfastness-testing/","Denim test capability"],
    ["Candidate","Dongguan Topshow Alibaba","https://topshowfashion.en.alibaba.com/index.html?from=detail&productId=1600407726200","Self-reported/platform claims"],
    ["Candidate","Dongguan Topshow CNVerify","https://www.cnverify.com/company/Dongguan-City-Topshow-Garment-Co-Ltd","Legal-identity lead; verify original licence"],
    ["Candidate","Dongguan Hangyue listing","https://www.alibaba.com/pla/Wholesale-High-Quality-Heavyweight-Washed-Button_1601445064817.html","Product/listing lead; custom MOQ unproven"],
    ["Candidate","China scarf suppliers","https://www.alibaba.com/supplier/scarf-manufacturers-in-china.html","Hohhot Sona / Hebei Dilly leads"],
    ["Benchmark","MVFA Toronto","https://mvfa.ca/products/manufacturing-cut-make-trim","Public 50/style/colour CMT minimum"],
    ["Benchmark","White Cotton Portugal","https://www.whitecotton.pt/custom-streetwear-manufacturer-portugal","Public 50/style/colour and lead claim"],
    ["Benchmark","Create Fashion Brand FAQ","https://createfashionbrand.com/faq-frequently-asked-questions/","Public custom MOQ 150; blanks differ"],
    ["Benchmark","Hongyu Apparel","https://www.hongyuapparel.com/","Public MOQ 100/style/colour"],
    ["Candidate","Billoomi","https://www.billoomifashion.com/custom-clothing-manufacturer","Public solid/denim MOQ claims; hold"],
    ["Founder report","Bulk/sample mismatch","https://www.reddit.com/r/streetwearstartup/comments/1t3q2ww/real_advice_only_bulk_order_did_not_match_sample/","Anecdotal failure pattern"],
    ["Founder report","Fabric/GSM mismatch","https://www.reddit.com/r/streetwearstartup/comments/1t1enr4/got_my_bulk/","Anecdotal failure pattern"],
    ["Founder report","Do not over-order","https://www.reddit.com/r/streetwearstartup/comments/1lvvagt/built_a_clothing_brand_with_no_industry/","Anecdotal inventory warning"],
    ["Visual","GPT Images / project-generated","Local assets in product/tech-packs/drop-001/assets","Visual intent only; jacket flat/details revised to v0.2 on 2026-08-01"],
    ["Design decision","Founder sleeve-end correction","Conversation direction dated 2026-08-01","No cuff; continuous straight quilted sleeve; 3 cm self-fabric stitched end"],
    ["Brand","Approved VORG-EAVY logo","site/assets/logo_black.png","Exact local asset; not redrawn"]
  ];
  s.getRange(`A5:D${4+sources.length}`).values=sources; header(s,"A5:D5"); grid(s,`A5:D${4+sources.length}`); widths(s,{A:18,B:32,C:92,D:52}); s.freezePanes.freezeRows(5);
}

// Checks
{
  const s=wb.worksheets.add("Checks");
  title(s,"CONTROL CHECKS","This sheet must remain FAIL/BLOCKED until real evidence replaces assumptions.","E");
  s.getRange("A5:E5").values=[["Check","Formula / observation","Result","Required","Interpretation"]]; header(s,"A5:E5");
  s.getRange("A6:E14").values=[
    ["Landed cash","Landed Budget total ≤ cap","","PASS","Cash cap protects survival"],
    ["Supplier score","Any candidate ≥75","","PASS","Desktop evidence is insufficient"],
    ["Bulk status","All hard gates closed","BLOCKED","PASS","No bulk authorization"],
    ["POM","Base fit approved","BLOCKED","PASS","Starting values only"],
    ["Materials","Intended bulk articles approved","BLOCKED","PASS","No nominated materials"],
    ["Tests","Required reports pass","BLOCKED","PASS","No lab evidence"],
    ["Demand","40 overall + 8/product price-revealed","BLOCKED","PASS","No current proof attached"],
    ["Inspection","PSI contract accepted","BLOCKED","PASS","No PO/inspection booked"],
    ["FINAL","All above pass","NO-GO","GO","Founder decision after evidence"]
  ];
  s.getRange("C6").formulas=[["=IF('Landed Budget'!G6<='Landed Budget'!B6,\"PASS\",\"FAIL\")"]];
  s.getRange("C7").formulas=[["=IF(MAX('Supplier Scorecard'!M6:M12)>=75,\"PASS\",\"FAIL\")"]];
  grid(s,"A5:E14");
  s.getRange("C6:C14").conditionalFormats.add("containsText",{text:"PASS",format:{fill:C.green,font:{color:"#274E13",bold:true}}});
  s.getRange("C6:C14").conditionalFormats.add("containsText",{text:"FAIL",format:{fill:C.red,font:{color:"#990000",bold:true}}});
  s.getRange("C6:C14").conditionalFormats.add("containsText",{text:"BLOCKED",format:{fill:C.red,font:{color:"#990000",bold:true}}});
  s.getRange("C6:C14").conditionalFormats.add("containsText",{text:"NO-GO",format:{fill:C.red,font:{color:"#990000",bold:true}}});
  widths(s,{A:25,B:45,C:18,D:18,E:48});
}

for (const sheet of wb.worksheets.items) {
  const used=sheet.getUsedRange();
  if (used) used.format.rowHeight=18;
}

const sheetNames = wb.worksheets.items.map(s=>s.name);
for (const name of sheetNames) {
  const preview = await wb.render({ sheetName:name, autoCrop:"all", scale:0.65, format:"png" });
  const safe=name.replace(/[^a-z0-9]+/gi,"_").toLowerCase();
  await fs.writeFile(path.join(PREVIEWS,`${safe}.png`), new Uint8Array(await preview.arrayBuffer()));
}

const xlsx=await SpreadsheetFile.exportXlsx(wb);
const outFile=path.join(OUT,"VORG-EAVY_Drop-001_Tech-Pack_RFQ_v0.2.xlsx");
await xlsx.save(outFile);

const inspection=await wb.inspect({kind:"sheet,formula",maxChars:8000,tableMaxRows:4,tableMaxCols:8,options:{maxResults:200}});
await fs.writeFile(path.join(OUT,"workbook-inspection.ndjson"),inspection.ndjson,"utf8");
console.log(JSON.stringify({outFile,previews:sheetNames.length,sheets:sheetNames},null,2));
