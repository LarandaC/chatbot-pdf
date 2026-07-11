import fitz
from dataclasses import dataclass


@dataclass
class PageText:
    page_number: int
    text: str


def extract_text_by_page(pdf_path: str) -> list[PageText]:
    """
    Extra el texto de cada página de un PDF.
    Devuelve una lista, una entrada por página (no se descarta páginas vacías)
    """
    doc = fitz.open(pdf_path)
    try:
        pages = []

        for page_num, page in enumerate(doc, start=1):
            raw_text = page.get_text()
            cleaned = _clean_text(raw_text)
            pages.append(PageText(page_number=page_num, text=cleaned))
        return pages
    finally:
        doc.close()


def _clean_text(text: str) -> str:
    """
    Limpieza mínima: PYyMuPdf a veces puede rimper el chunking
    """
    lines = [line.strip() for line in text.split("\n")]
    lines = [line for line in lines if line]  # descarta líneas vacías
    return " ".join(lines)
