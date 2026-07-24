from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate,
    Flowable,
    Frame,
    KeepTogether,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "checklist-cadrage-ia-locale.pdf"

NAVY = colors.HexColor("#020817")
BLUE = colors.HexColor("#087CFF")
PALE_BLUE = colors.HexColor("#EAF4FF")
TEXT = colors.HexColor("#071A3D")
MUTED = colors.HexColor("#60708C")
BORDER = colors.HexColor("#D9E4F0")
WHITE = colors.white


CHECKLIST = [
    (
        "01",
        "Objectif et résultat métier",
        "Définir pourquoi le système doit exister et comment sa valeur sera vérifiée.",
        [
            "Le problème actuel et ses conséquences sont décrits.",
            "Les utilisateurs et le moment précis d'utilisation sont identifiés.",
            "Le résultat attendu possède au moins un indicateur mesurable.",
            "Les situations où l'IA n'est pas nécessaire sont explicitées.",
        ],
    ),
    (
        "02",
        "Processus et responsabilités",
        "Inscrire l'IA dans un flux de travail réel avec une responsabilité humaine claire.",
        [
            "Le processus avant et après l'intervention de l'IA est cartographié.",
            "La personne qui valide, corrige ou refuse le résultat est identifiée.",
            "Les conséquences d'une erreur sont classées.",
            "Une procédure manuelle ou un mode dégradé est prévu.",
        ],
    ),
    (
        "03",
        "Données et conformité",
        "Savoir quelles données peuvent être utilisées, où et par qui.",
        [
            "Les données sont inventoriées, classées et rattachées à un propriétaire.",
            "Les données personnelles, sensibles ou protégées sont identifiées.",
            "Les durées de conservation et les destinataires sont définis.",
            "Les flux autorisés vers un service externe sont documentés.",
        ],
    ),
    (
        "04",
        "Architecture de déploiement",
        "Comparer local, cloud et hybride selon le risque plutôt que par principe.",
        [
            "Les traitements devant rester locaux sont distingués des autres.",
            "Les dépendances réseau et les besoins hors ligne sont connus.",
            "Les interfaces entre composants privés et externes sont documentées.",
            "La réversibilité et la solution de repli sont prévues.",
        ],
    ),
    (
        "05",
        "Modèle, RAG et outils",
        "Choisir les composants à partir du cas d'usage et des licences.",
        [
            "Plusieurs modèles candidats sont comparés sur les mêmes exemples.",
            "La langue, la licence, la précision et le contexte sont vérifiés.",
            "Le RAG n'est retenu que si des sources maintenues existent.",
            "Les actions accessibles au modèle sont limitées et contrôlées.",
        ],
    ),
    (
        "06",
        "Évaluation de la qualité",
        "Décider avec un corpus représentatif, des réponses attendues et des cas d'échec.",
        [
            "Un jeu de questions réelles et de réponses attendues est constitué.",
            "Les erreurs critiques et les refus attendus sont inclus.",
            "La recherche est évaluée séparément de la génération.",
            "Les seuils de go, no-go et régression sont définis.",
        ],
    ),
    (
        "07",
        "Charge et infrastructure",
        "Dimensionner la plateforme selon la charge réelle et le niveau de service.",
        [
            "Le modèle, la précision et le contexte sont fixés pour le test.",
            "La concurrence, la latence et le débit attendus sont estimés.",
            "Mémoire, stockage, réseau, énergie et refroidissement sont intégrés.",
            "Le matériel est validé par une charge représentative avant achat.",
        ],
    ),
    (
        "08",
        "Sécurité et accès",
        "Traiter l'IA comme un système complet et non comme un simple modèle.",
        [
            "Les accès aux données, modèles, interfaces et outils sont authentifiés.",
            "Les secrets et comptes de service sont isolés.",
            "Les injections de consignes et documents malveillants sont testées.",
            "Les journaux utiles à l'audit sont définis et protégés.",
        ],
    ),
    (
        "09",
        "Exploitation et continuité",
        "Prévoir la vie du système après la démonstration.",
        [
            "Un responsable du service et une procédure d'escalade sont nommés.",
            "Les mises à jour suivent un processus de validation.",
            "La supervision, la sauvegarde et le retour arrière sont prévus.",
            "Les pannes, saturations et indisponibilités sont testées.",
        ],
    ),
    (
        "10",
        "Coût complet et décision",
        "Comparer les options sur une période et un niveau de service communs.",
        [
            "Le coût inclut matériel ou API, intégration, énergie et exploitation.",
            "Les hypothèses de charge et d'amortissement sont visibles.",
            "Les risques, dépendances et compétences sont chiffrés ou qualifiés.",
            "La décision, ses limites et sa date de réévaluation sont documentées.",
        ],
    ),
]


def register_fonts():
    regular = Path("C:/Windows/Fonts/arial.ttf")
    bold = Path("C:/Windows/Fonts/arialbd.ttf")
    if regular.exists() and bold.exists():
        pdfmetrics.registerFont(TTFont("NovekiaSans", str(regular)))
        pdfmetrics.registerFont(TTFont("NovekiaSans-Bold", str(bold)))
        return "NovekiaSans", "NovekiaSans-Bold"
    return "Helvetica", "Helvetica-Bold"


FONT, FONT_BOLD = register_fonts()


class ChecklistItem(Flowable):
    def __init__(self, text, style, width):
        super().__init__()
        self.paragraph = Paragraph(text, style)
        self.available_width = width
        self.box = 4.2 * mm
        self.gap = 3 * mm

    def wrap(self, avail_width, avail_height):
        paragraph_width = min(self.available_width, avail_width) - self.box - self.gap
        _, height = self.paragraph.wrap(paragraph_width, avail_height)
        self.width = avail_width
        self.height = max(self.box, height) + 2.5 * mm
        return self.width, self.height

    def draw(self):
        self.canv.setStrokeColor(BLUE)
        self.canv.setLineWidth(0.8)
        self.canv.rect(0, self.height - self.box - 1, self.box, self.box)
        paragraph_width = self.width - self.box - self.gap
        self.paragraph.wrapOn(self.canv, paragraph_width, self.height)
        self.paragraph.drawOn(self.canv, self.box + self.gap, 1.5 * mm)


def page_header_footer(canvas, doc):
    canvas.saveState()
    width, height = A4
    canvas.setFillColor(NAVY)
    canvas.rect(0, height - 17 * mm, width, 17 * mm, fill=1, stroke=0)
    canvas.setFillColor(WHITE)
    canvas.setFont(FONT_BOLD, 12)
    canvas.drawString(18 * mm, height - 10.8 * mm, "Novekia")
    canvas.setFillColor(colors.HexColor("#9EB0CA"))
    canvas.setFont(FONT, 7)
    canvas.drawRightString(
        width - 18 * mm,
        height - 10.4 * mm,
        "CHECKLIST DE CADRAGE - IA LOCALE",
    )
    canvas.setStrokeColor(BORDER)
    canvas.line(18 * mm, 13 * mm, width - 18 * mm, 13 * mm)
    canvas.setFillColor(MUTED)
    canvas.setFont(FONT, 7)
    canvas.drawString(18 * mm, 8.5 * mm, "novekia.fr - Version du 24 juillet 2026")
    canvas.drawRightString(width - 18 * mm, 8.5 * mm, f"{doc.page}")
    canvas.restoreState()


def make_styles():
    styles = getSampleStyleSheet()
    return {
        "hero_label": ParagraphStyle(
            "HeroLabel",
            parent=styles["Normal"],
            fontName=FONT_BOLD,
            fontSize=8,
            leading=10,
            textColor=BLUE,
            spaceAfter=5 * mm,
            tracking=1.6,
        ),
        "hero_title": ParagraphStyle(
            "HeroTitle",
            parent=styles["Title"],
            fontName=FONT_BOLD,
            fontSize=30,
            leading=33,
            textColor=TEXT,
            alignment=TA_LEFT,
            spaceAfter=6 * mm,
        ),
        "lead": ParagraphStyle(
            "Lead",
            parent=styles["BodyText"],
            fontName=FONT,
            fontSize=11,
            leading=17,
            textColor=MUTED,
            spaceAfter=6 * mm,
        ),
        "section_number": ParagraphStyle(
            "SectionNumber",
            parent=styles["Normal"],
            fontName=FONT_BOLD,
            fontSize=8,
            leading=10,
            textColor=BLUE,
            spaceAfter=2 * mm,
            tracking=1.2,
        ),
        "section_title": ParagraphStyle(
            "SectionTitle",
            parent=styles["Heading2"],
            fontName=FONT_BOLD,
            fontSize=17,
            leading=20,
            textColor=TEXT,
            spaceAfter=2.5 * mm,
        ),
        "objective": ParagraphStyle(
            "Objective",
            parent=styles["BodyText"],
            fontName=FONT,
            fontSize=8.5,
            leading=12,
            textColor=MUTED,
            spaceAfter=4 * mm,
        ),
        "item": ParagraphStyle(
            "Item",
            parent=styles["BodyText"],
            fontName=FONT,
            fontSize=9,
            leading=12,
            textColor=TEXT,
        ),
        "note": ParagraphStyle(
            "Note",
            parent=styles["BodyText"],
            fontName=FONT,
            fontSize=9,
            leading=14,
            textColor=MUTED,
            borderColor=BORDER,
            borderWidth=0.8,
            borderPadding=4 * mm,
            backColor=PALE_BLUE,
        ),
    }


def build_pdf():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    width, height = A4
    frame = Frame(
        18 * mm,
        18 * mm,
        width - 36 * mm,
        height - 40 * mm,
        id="content",
        leftPadding=0,
        rightPadding=0,
        topPadding=5 * mm,
        bottomPadding=0,
    )
    document = BaseDocTemplate(
        str(OUTPUT),
        pagesize=A4,
        leftMargin=18 * mm,
        rightMargin=18 * mm,
        topMargin=22 * mm,
        bottomMargin=18 * mm,
        title="Checklist de cadrage d'un projet d'IA locale",
        author="Andy Legrand - Novekia",
        subject="Cadrage d'un projet d'intelligence artificielle locale",
    )
    document.addPageTemplates(
        [PageTemplate(id="novekia", frames=[frame], onPage=page_header_footer)]
    )
    styles = make_styles()
    story = [
        Spacer(1, 7 * mm),
        Paragraph("OUTIL DE DECISION - NOVEKIA", styles["hero_label"]),
        Paragraph(
            "Checklist de cadrage<br/>d'un projet d'IA locale",
            styles["hero_title"],
        ),
        Paragraph(
            "40 points de contrôle pour transformer une idée en décision documentée, "
            "avant de choisir un modèle, un RAG ou une machine.",
            styles["lead"],
        ),
        Paragraph(
            "<b>Mode d'emploi.</b> Cochez uniquement les points vérifiés. Une case "
            "inconnue devient une question à résoudre, avec un responsable et une "
            "méthode. Cette checklist ne remplace ni une analyse juridique ni un "
            "audit de sécurité.",
            styles["note"],
        ),
        PageBreak(),
    ]

    content_width = width - 36 * mm
    for index, (number, title, objective, items) in enumerate(CHECKLIST):
        block = [
            Paragraph(f"{number} / CADRAGE", styles["section_number"]),
            Paragraph(title, styles["section_title"]),
            Paragraph(objective, styles["objective"]),
        ]
        block.extend(
            ChecklistItem(item, styles["item"], content_width) for item in items
        )
        story.append(KeepTogether(block))
        if index % 2 == 0:
            story.append(Spacer(1, 8 * mm))
        elif index < len(CHECKLIST) - 1:
            story.append(PageBreak())

    story.extend(
        [
            Spacer(1, 8 * mm),
            Paragraph(
                "<b>Décision finale.</b> Le cadrage est terminé lorsque les inconnues "
                "critiques ont un responsable, une méthode de résolution et une date "
                "de revue. Documentez le go, le no-go ou le prototype limité, ainsi "
                "que les conditions qui pourraient faire changer la décision.",
                styles["note"],
            ),
        ]
    )
    document.build(story)
    print(OUTPUT)


if __name__ == "__main__":
    build_pdf()
