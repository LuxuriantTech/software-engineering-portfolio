"""Build the two public, portfolio-safe career documents.

The generated PDFs deliberately omit a phone number, street address, financial
information, and application-specific identifiers. Keep the matching web copy
in ``src/documentData.js`` aligned when changing the wording here.
"""

from __future__ import annotations

from pathlib import Path

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


def build_cv() -> Path:
    contact = (
        "Brussels, Belgium<br/>"
        '<link href="mailto:mehajardian@gmail.com" color="#5C5A54">mehajardian@gmail.com</link><br/>'
        '<link href="https://github.com/LuxuriantTech" color="#5C5A54">github.com/LuxuriantTech</link><br/>'
        '<link href="https://www.linkedin.com/in/ardian-mehaj-572b5a3b0/" color="#5C5A54">LinkedIn / Ardian Mehaj</link>'
    )
    header = Table(
        [[p("ARDIAN MEHAJ", "name"), p(contact, "contact")],
         [p("AI-assisted builder · Junior software candidate", "role"), ""]],
        colWidths=[112 * mm, 62 * mm],
        hAlign="LEFT",
    )
    header.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("SPAN", (1, 0), (1, 1)),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
            ]
        )
    )

    story = [header, Spacer(1, 5 * mm), rule()]
    story += [
        p("PROFILE", "section"),
        p(
            "Junior software candidate based in Brussels, moving from business studies into software and applied AI. "
            "I use coding assistants to turn a clear brief into working prototypes, then inspect the result, run tests, "
            "reproduce failures and document the limits. I understand the code I deliver while continuing to strengthen "
            "my independent coding and computer-science foundations. I am looking for a first professional team where I "
            "can contribute and learn through review."
        ),
        p("SELECTED PROJECTS", "section"),
        KeepTogether(
            [
                p("API Contract Guard", "item_title"),
                p("TypeScript · Node.js · OpenAPI · 102 local tests", "item_meta"),
                p(
                    "A bounded command-line tool for comparing a defined OpenAPI subset. I set the supported change "
                    "categories, expected reports and failure boundaries, then reviewed the AI-assisted implementation "
                    "and test cases. It covers five documented breaking-change categories and fails closed outside scope."
                ),
            ]
        ),
        KeepTogether(
            [
                p("EvidenceDesk", "item_title"),
                p("React · FastAPI · PostgreSQL · Redis · Synthetic data", "item_meta"),
                p(
                    "A document-review prototype that links answers to supporting pages and can abstain when evidence is "
                    "missing. Recall@5 reached 100% on 25 of 25 answerable synthetic cases; the wider answer evaluation "
                    "did not pass (36% accuracy and 45.67% extraction F1), so the limit remains visible."
                ),
            ]
        ),
        KeepTogether(
            [
                p("PostgreSQL Migration Rehearsal", "item_title"),
                p("PostgreSQL · Docker · Python · Local synthetic rehearsal", "item_meta"),
                p(
                    "A local practice project for migration planning, rollback checks and data-integrity checks. It uses "
                    "synthetic data and is presented as a rehearsal, not as proof of production experience."
                ),
            ]
        ),
    ]

    experience = [
        [p("Volunteer tutor", "item_title"), p("Brussels · 2020–present", "item_meta")],
        [p("Mathematics, science and business. I break unfamiliar topics into clear steps and adapt explanations to the learner.", "small"), ""],
        [p("Student retail assistant · Delhaize", "item_title"), p("Brussels · 2020–2022", "item_meta")],
        [p("Worked reliably with customers, procedures and a team during busy shifts while studying.", "small"), ""],
    ]
    experience_table = Table(experience, colWidths=[121 * mm, 53 * mm], hAlign="LEFT")
    experience_table.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("ALIGN", (1, 0), (1, -1), "RIGHT"),
                ("SPAN", (0, 1), (1, 1)),
                ("SPAN", (0, 3), (1, 3)),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 1.2 * mm),
            ]
        )
    )
    story += [p("EXPERIENCE", "section"), experience_table]

    left = (
        "<b>OPIT · BSc (Hons) Computer Science</b><br/>"
        "Admitted for the September 2026 intake; enrolment pending. Online study planned alongside full-time work.<br/><br/>"
        "<b>ICHEC Brussels · Business Management</b><br/>"
        "Completed part of first year in 2025–2026 before changing direction toward software."
    )
    right = (
        "<b>Google AI Professional Certificate</b><br/>Coursera · May 2026<br/><br/>"
        "<b>Languages</b><br/>French native · Albanian native/bilingual · English B2 (self-assessed)"
    )
    education = Table([[p(left, "small"), p(right, "small")]], colWidths=[106 * mm, 68 * mm])
    education.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (0, 0), 7 * mm),
                ("RIGHTPADDING", (1, 0), (1, 0), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
            ]
        )
    )
    story += [
        p("EDUCATION & CERTIFICATION", "section"),
        education,
        p("WORKING WITH", "section"),
        p(
            "Python · JavaScript · TypeScript · SQL · HTML/CSS · FastAPI · React · REST/OpenAPI · PostgreSQL · Redis · "
            "pytest · Vitest · Playwright · Ruff · mypy · Git/GitHub Actions · Docker · Linux · debugging · documentation",
            "small",
        ),
    ]
    path = OUTPUT_DIR / "Ardian_Mehaj_Public_CV_EN.pdf"
    document(path, "Ardian Mehaj — Public CV", "Public portfolio CV", story, "ARDIAN MEHAJ · CV")
    return path


def build_letter() -> Path:
    contact = (
        "Brussels, Belgium<br/>"
        '<link href="mailto:mehajardian@gmail.com" color="#5C5A54">mehajardian@gmail.com</link><br/>'
        '<link href="https://github.com/LuxuriantTech" color="#5C5A54">github.com/LuxuriantTech</link>'
    )
    header = Table(
        [[p("ARDIAN MEHAJ", "name"), p(contact, "letter_meta")]],
        colWidths=[112 * mm, 62 * mm],
        hAlign="LEFT",
    )
    header.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
            ]
        )
    )
    story = [
        header,
        Spacer(1, 5 * mm),
        rule(),
        Spacer(1, 12 * mm),
        p("Open application · Junior software / backend / applied AI", "role"),
        Spacer(1, 8 * mm),
        p("Dear Hiring Team,", "letter_body"),
        p(
            "I am looking for my first professional opportunity in software, backend development or applied AI. My route "
            "into the field is not traditional: I began in business studies and learned software by turning real ideas "
            "into small, testable projects. That route has made me comfortable admitting what I do not know, asking precise "
            "questions and improving from evidence.",
            "letter_body",
        ),
        p(
            "AI coding assistants are an important part of how I work, and I do not hide that. I define the objective and "
            "constraints, direct the work, inspect the resulting code, run the product, reproduce failures and keep limits "
            "visible. I am still strengthening my independent coding and computer-science foundations, but I can already "
            "help turn an unclear brief into a reviewable working path.",
            "letter_body",
        ),
        p(
            "My public projects show that process. API Contract Guard is a deliberately bounded TypeScript tool backed by "
            "102 local tests. EvidenceDesk links answers to supporting passages and also publishes the evaluation that did "
            "not pass. PostgreSQL Migration Rehearsal lets me practise migrations, rollback and integrity checks locally on "
            "synthetic data. These are learning projects, not substitutes for professional experience, but they show how I "
            "approach responsibility and verification.",
            "letter_body",
        ),
        p(
            "I have been admitted to OPIT's online BSc (Hons) in Computer Science for the September 2026 intake; enrolment is "
            "still pending. I plan to study alongside full-time work so that formal foundations and practical experience can "
            "grow together. I would value a team where code review is normal, expectations are clear and a junior is trusted "
            "to learn while contributing.",
            "letter_body",
        ),
        p(
            "If that matches how your team works, I would be glad to discuss a real problem, complete a fair practical "
            "assessment and explain exactly how I reached my answer.",
            "letter_body",
        ),
        Spacer(1, 2 * mm),
        p("Thank you for your time,", "letter_body"),
        p("<b>Ardian Mehaj</b>", "letter_body"),
    ]
    path = OUTPUT_DIR / "Ardian_Mehaj_General_Motivation_Letter_EN.pdf"
    document(
        path,
        "Ardian Mehaj — General Motivation Letter",
        "Open application for junior software, backend, and applied AI roles",
        story,
        "ARDIAN MEHAJ · MOTIVATION LETTER",
    )
    return path


if __name__ == "__main__":
    for generated_path in (build_cv(), build_letter()):
        print(generated_path)
