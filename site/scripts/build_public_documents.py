"""Build the public English/French CVs and English motivation letter.

The generated PDFs deliberately omit a phone number, street address, financial
information, and application-specific identifiers. Both PDFs and the in-page reader use ``src/careerContent.json``.
"""

from __future__ import annotations

from pathlib import Path
from html import escape
import json

from reportlab.lib import colors
from reportlab.lib.enums import TA_RIGHT
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
            fontSize=9.2,
            leading=12.6,
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
            fontSize=8.2,
            leading=10.5,
            textColor=MUTED,
            spaceAfter=0.8 * mm,
        ),
        "small": ParagraphStyle(
            "Small",
            parent=base["Normal"],
            fontName=FONT,
            fontSize=8.1,
            leading=11.1,
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


def document(path: Path, title: str, subject: str, story: list, footer: str | None = None) -> None:
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
        if footer:
            canvas.setStrokeColor(RULE)
            canvas.line(18 * mm, 12 * mm, A4[0] - 18 * mm, 12 * mm)
            canvas.setFillColor(MUTED)
            canvas.setFont(FONT, 7)
            canvas.drawString(18 * mm, 8 * mm, footer)
            canvas.drawRightString(A4[0] - 18 * mm, 8 * mm, "Public portfolio edition · 2026")
        canvas.restoreState()

    doc.addPageTemplates([PageTemplate(id="page", frames=[frame], onPage=decorate)])
    doc.build(story)


def header(role="", location="Brussels, Belgium"):
    contact = (escape(location) + '<br/>'
        '<link href="mailto:mehajardian@gmail.com">mehajardian@gmail.com</link><br/>'
        '<link href="https://github.com/LuxuriantTech">github.com/LuxuriantTech</link><br/>'
        '<link href="https://www.linkedin.com/in/ardian-mehaj-572b5a3b0/">LinkedIn / Ardian Mehaj</link><br/>'
        '<link href="https://ardianmehaj.dev/">Portfolio</link>')
    table = Table([[p("ARDIAN MEHAJ", "name"), p(contact, "contact")],
        [p(escape(role), "role"), ""]], colWidths=[112 * mm, 62 * mm])
    table.setStyle(TableStyle([
        ("VALIGN", (0,0),(-1,-1),"TOP"), ("SPAN",(1,0),(1,1)),
        ("LEFTPADDING",(0,0),(-1,-1),0), ("RIGHTPADDING",(0,0),(-1,-1),0),
        ("TOPPADDING",(0,0),(-1,-1),0), ("BOTTOMPADDING",(0,0),(-1,-1),0)]))
    return table


def item(entry):
    title = escape(entry["name"])
    if entry.get("url"):
        title = f'<link href="{escape(entry["url"], quote=True)}">{title}</link>'
    lines = [p(title, "item_title")]
    if entry.get("meta"):
        lines.append(p(escape(entry["meta"]), "item_meta"))
    lines.append(p(escape(entry["detail"])))
    return KeepTogether(lines)


def cv_header(role: str, location: str) -> list:
    contact = (
        escape(location)
        + ' | <link href="mailto:mehajardian@gmail.com">mehajardian@gmail.com</link><br/>'
        + '<link href="https://ardianmehaj.dev/">ardianmehaj.dev</link> | '
        + '<link href="https://github.com/LuxuriantTech">github.com/LuxuriantTech</link> | '
        + '<link href="https://www.linkedin.com/in/ardian-mehaj-572b5a3b0/">LinkedIn</link>'
    )
    return [p("Ardian Mehaj", "name"), p(escape(role), "role"), p(contact, "small")]


def build_cv(language="en") -> Path:
    is_french = language == "fr"
    cv = CONTENT["cv_fr" if is_french else "cv"]
    labels = (
        ("Formation", "Profil", "Compétences techniques", "Projets sélectionnés", "Expérience", "Certificats", "Langues et disponibilité")
        if is_french
        else ("Education", "Profile", "Technical skills", "Selected projects", "Experience", "Certificates", "Languages and availability")
    )
    education, profile, tools, projects, experience, certificates, languages = labels
    story = [*cv_header(cv["role"], cv["location"]), Spacer(1, 3 * mm), rule()]
    story.append(p(education, "section"))
    story.extend(item(entry) for entry in cv["education"])
    story.extend([p(profile, "section"), p(escape(cv["profile"]))])
    story.extend([p(tools, "section"), p(escape(cv["tools"]))])
    story.append(p(projects, "section"))
    story.extend(item(entry) for entry in cv["projects"])
    story.append(p(experience, "section"))
    story.extend(item(entry) for entry in cv["experience"])
    story.append(p(certificates, "section"))
    certificates_by_id = {certificate["id"]: certificate for certificate in CONTENT["certificates"]}
    for credential_id in CONTENT["cvCertificateIds"]:
        certificate = certificates_by_id[credential_id]
        title = escape(certificate["title"])
        url = escape(certificate["url"], quote=True)
        issuer = " · Harvard Business Review / Coursera" if certificate["issuer"] == "Harvard Business Review" else ""
        story.append(p(f'<link href="{url}">{title}</link>{issuer}', "small"))
    availability = "Disponible immédiatement." if is_french else "Available immediately."
    story.extend([p(languages, "section"), p(escape(f'{cv["languages"]} {availability}'), "small")])
    path = OUTPUT_DIR / f"Ardian_Mehaj_Public_CV_{language.upper()}.pdf"
    document(path, "Ardian Mehaj - CV " + language.upper(), "Public portfolio CV", story)
    return path


def build_letter() -> Path:
    letter = CONTENT["letter"]
    story=[header("Junior software developer"), Spacer(1, 5*mm), rule(), Spacer(1,12*mm), p(escape(letter["subject"]),"role"),
        Spacer(1,8*mm), p(escape(letter["salutation"]),"letter_body")]
    story.extend(p(escape(text),"letter_body") for text in letter["paragraphs"])
    story += [Spacer(1,2*mm), p(escape(letter["closing"]),"letter_body"), p("<b>Ardian Mehaj</b>","letter_body")]
    path=OUTPUT_DIR / "Ardian_Mehaj_General_Motivation_Letter_EN.pdf"
    document(path,"Ardian Mehaj - General Motivation Letter","Open application for junior software, backend, and applied AI roles",story,"ARDIAN MEHAJ · MOTIVATION LETTER")
    return path


if __name__ == "__main__":
    for generated_path in (build_cv(), build_cv("fr"), build_letter()):
        print(generated_path)
