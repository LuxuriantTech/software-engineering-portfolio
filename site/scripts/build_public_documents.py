"""Build the two public, portfolio-safe career documents.

The generated PDFs deliberately omit a phone number, street address, financial
information, and application-specific identifiers. Both PDFs and the in-page reader use ``src/careerContent.json``.
"""

from __future__ import annotations

from pathlib import Path
from html import escape
import json

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    KeepTogether,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "public" / "documents"
CONTENT = json.loads((ROOT / "src" / "careerContent.json").read_text(encoding="utf-8"))

INK = colors.HexColor("#171713")
PAPER = colors.HexColor("#F7F4EC")
ORANGE = colors.HexColor("#FF5B36")
COBALT = colors.HexColor("#3859FF")
MUTED = colors.HexColor("#5C5A54")
RULE = colors.HexColor("#CFC9BB")


def register_fonts() -> tuple[str, str]:
    """Use Arial when available and portable PDF core fonts otherwise."""

    fonts_dir = Path("C:/Windows/Fonts")
    regular = fonts_dir / "arial.ttf"
    bold = fonts_dir / "arialbd.ttf"
    if regular.exists() and bold.exists():
        pdfmetrics.registerFont(TTFont("PublicSans", str(regular)))
        pdfmetrics.registerFont(TTFont("PublicSans-Bold", str(bold)))
        return "PublicSans", "PublicSans-Bold"
    return "Helvetica", "Helvetica-Bold"


FONT, FONT_BOLD = register_fonts()


def styles():
    base = getSampleStyleSheet()
    return {
        "name": ParagraphStyle(
            "Name",
            parent=base["Normal"],
            fontName=FONT_BOLD,
            fontSize=24,
            leading=25,
            textColor=INK,
            spaceAfter=2 * mm,
        ),
        "role": ParagraphStyle(
            "Role",
            parent=base["Normal"],
            fontName=FONT,
            fontSize=10.2,
            leading=13,
            textColor=INK,
        ),
        "contact": ParagraphStyle(
            "Contact",
            parent=base["Normal"],
            fontName=FONT,
            fontSize=7.8,
            leading=10,
            textColor=MUTED,
            alignment=TA_RIGHT,
        ),
        "section": ParagraphStyle(
            "Section",
            parent=base["Normal"],
            fontName=FONT_BOLD,
            fontSize=8.2,
            leading=10,
            textColor=COBALT,
            spaceBefore=4.3 * mm,
            spaceAfter=1.6 * mm,
            textTransform="uppercase",
        ),
        "body": ParagraphStyle(
            "Body",
            parent=base["Normal"],
            fontName=FONT,
            fontSize=8.55,
            leading=11.7,
            textColor=INK,
            spaceAfter=1.7 * mm,
        ),
        "item_title": ParagraphStyle(
            "ItemTitle",
            parent=base["Normal"],
            fontName=FONT_BOLD,
            fontSize=9.1,
            leading=11.4,
            textColor=INK,
            spaceAfter=0.6 * mm,
        ),
        "item_meta": ParagraphStyle(
            "ItemMeta",
            parent=base["Normal"],
            fontName=FONT,
            fontSize=7.5,
            leading=9.5,
            textColor=MUTED,
            spaceAfter=0.8 * mm,
        ),
        "small": ParagraphStyle(
            "Small",
            parent=base["Normal"],
            fontName=FONT,
            fontSize=7.6,
            leading=10.2,
            textColor=INK,
        ),
        "letter_body": ParagraphStyle(
            "LetterBody",
            parent=base["Normal"],
            fontName=FONT,
            fontSize=10,
            leading=15.2,
            textColor=INK,
            spaceAfter=4.1 * mm,
        ),
        "letter_meta": ParagraphStyle(
            "LetterMeta",
            parent=base["Normal"],
            fontName=FONT,
            fontSize=8.4,
            leading=11,
            textColor=MUTED,
            alignment=TA_RIGHT,
        ),
    }


S = styles()


def p(text: str, style: str = "body") -> Paragraph:
    return Paragraph(text, S[style])


def rule() -> Table:
    table = Table([[""]], colWidths=[174 * mm], rowHeights=[0.35 * mm])
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), INK),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
            ]
        )
    )
    return table


def document(path: Path, title: str, subject: str, story: list, footer: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    doc = BaseDocTemplate(
        str(path),
        pagesize=A4,
        leftMargin=18 * mm,
        rightMargin=18 * mm,
        topMargin=15 * mm,
        bottomMargin=14 * mm,
        title=title,
        author="Ardian Mehaj",
        subject=subject,
        creator="",
        producer="",
        invariant=1,
    )
    frame = Frame(
        doc.leftMargin,
        doc.bottomMargin,
        doc.width,
        doc.height,
        leftPadding=0,
        rightPadding=0,
        topPadding=0,
        bottomPadding=0,
    )

    def decorate(canvas, _doc):
        canvas.saveState()
        canvas.setFillColor(PAPER)
        canvas.rect(0, 0, A4[0], A4[1], stroke=0, fill=1)
        canvas.setFillColor(ORANGE)
        canvas.rect(0, A4[1] - 5 * mm, 64 * mm, 5 * mm, stroke=0, fill=1)
        canvas.setFillColor(COBALT)
        canvas.rect(64 * mm, A4[1] - 5 * mm, 14 * mm, 5 * mm, stroke=0, fill=1)
        canvas.setStrokeColor(RULE)
        canvas.line(18 * mm, 12 * mm, A4[0] - 18 * mm, 12 * mm)
        canvas.setFillColor(MUTED)
        canvas.setFont(FONT, 7)
        canvas.drawString(18 * mm, 8 * mm, footer)
        canvas.drawRightString(A4[0] - 18 * mm, 8 * mm, "Public portfolio edition · 2026")
        canvas.restoreState()

    doc.addPageTemplates([PageTemplate(id="page", frames=[frame], onPage=decorate)])
    doc.build(story)


def header(role=""):
    contact = ('Brussels, Belgium<br/>'
        '<link href="mailto:mehajardian@gmail.com">mehajardian@gmail.com</link><br/>'
        '<link href="https://github.com/LuxuriantTech">github.com/LuxuriantTech</link><br/>'
        '<link href="https://www.linkedin.com/in/ardian-mehaj-572b5a3b0/">LinkedIn / Ardian Mehaj</link><br/>'
        '<link href="https://ardian-mehaj-portfolio.vercel.app/">Portfolio</link>')
    table = Table([[p("ARDIAN MEHAJ", "name"), p(contact, "contact")],
        [p(escape(role), "role"), ""]], colWidths=[112 * mm, 62 * mm])
    table.setStyle(TableStyle([
        ("VALIGN", (0,0),(-1,-1),"TOP"), ("SPAN",(1,0),(1,1)),
        ("LEFTPADDING",(0,0),(-1,-1),0), ("RIGHTPADDING",(0,0),(-1,-1),0),
        ("TOPPADDING",(0,0),(-1,-1),0), ("BOTTOMPADDING",(0,0),(-1,-1),0)]))
    return table


def item(entry):
    lines = [p(escape(entry["name"]), "item_title")]
    if entry.get("meta"):
        lines.append(p(escape(entry["meta"]), "item_meta"))
    lines.append(p(escape(entry["detail"])))
    return KeepTogether(lines)


def build_cv() -> Path:
    cv = CONTENT["cv"]
    story = [header(cv["role"]), Spacer(1, 5*mm), rule(), p("PROFILE","section"), p(escape(cv["profile"]))]
    for title, entries in [("SELECTED PROJECTS",cv["projects"]),("EXPERIENCE",cv["experience"]),("EDUCATION &amp; CERTIFICATION",cv["education"])]:
        story.append(p(title,"section"))
        story.extend(item(entry) for entry in entries)
    story += [p(escape(cv["certification"]),"small"), p(escape(cv["languages"]),"small"),
        p("TOOLS USED WITH AI ASSISTANCE","section"), p(escape(cv["tools"]),"small")]
    path=OUTPUT_DIR / "Ardian_Mehaj_Public_CV_EN.pdf"
    document(path,"Ardian Mehaj — Public CV","Public portfolio CV",story,"ARDIAN MEHAJ · CV")
    return path


def build_letter() -> Path:
    letter = CONTENT["letter"]
    story=[header(), Spacer(1, 5*mm), rule(), Spacer(1,12*mm), p(escape(letter["subject"]),"role"),
        Spacer(1,8*mm), p(escape(letter["salutation"]),"letter_body")]
    story.extend(p(escape(text),"letter_body") for text in letter["paragraphs"])
    story += [Spacer(1,2*mm), p(escape(letter["closing"]),"letter_body"), p("<b>Ardian Mehaj</b>","letter_body")]
    path=OUTPUT_DIR / "Ardian_Mehaj_General_Motivation_Letter_EN.pdf"
    document(path,"Ardian Mehaj — General Motivation Letter","Open application for junior software, backend, and applied AI roles",story,"ARDIAN MEHAJ · MOTIVATION LETTER")
    return path


if __name__ == "__main__":
    for generated_path in (build_cv(), build_letter()):
        print(generated_path)
