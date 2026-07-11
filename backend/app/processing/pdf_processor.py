import fitz
from dataclasses import dataclass


@dataclass
class PageText:
    page_number: int
    text: str
    table_count: int = 0


def extract_text_by_page(pdf_path: str) -> list[PageText]:
    """
    Extra el texto de cada página de un PDF, separando prosa de tablas.
    Devuelve una lista, una entrada por página (no se descarta páginas vacías)
    """
    doc = fitz.open(pdf_path)
    try:
        pages = []

        for page_num, page in enumerate(doc, start=1):
            table_blocks, table_bboxes = _extract_tables(page)
            prose = _extract_prose(page, table_bboxes)

            text = prose
            if table_blocks:
                text = "\n\n".join([prose] + table_blocks) if prose else "\n\n".join(table_blocks)

            pages.append(PageText(page_number=page_num, text=text, table_count=len(table_blocks)))
        return pages
    finally:
        doc.close()


def _extract_tables(page: "fitz.Page") -> tuple[list[str], list["fitz.Rect"]]:
    """
    Detecta tablas en la página y las convierte a bloques markdown.
    Devuelve (bloques_markdown, bboxes) para poder excluir esas zonas del texto plano.
    Si la detección falla (PDF raro), simplemente no hay tablas.
    """
    try:
        found = page.find_tables()
    except Exception:
        return [], []

    blocks = []
    bboxes = []
    for table in found.tables:
        try:
            markdown = table.to_markdown().strip()
        except Exception:
            continue
        if not markdown:
            continue
        blocks.append(f"[Tabla — página {page.number + 1}]\n{markdown}")
        bboxes.append(fitz.Rect(table.bbox))
    return blocks, bboxes


def _extract_prose(page: "fitz.Page", table_bboxes: list["fitz.Rect"]) -> str:
    """
    Extrae el texto "de prosa" de la página, descartando las palabras que
    caen dentro de una tabla (para no duplicar/mezclar esas celdas con el resto).
    """
    words = page.get_text("words")  # (x0, y0, x1, y1, word, block_no, line_no, word_no)
    kept = [
        w[4]
        for w in words
        if not _in_any_bbox(fitz.Rect(w[:4]), table_bboxes)
    ]
    return _clean_text(" ".join(kept))


def _in_any_bbox(word_rect: "fitz.Rect", bboxes: list["fitz.Rect"]) -> bool:
    center = (word_rect.tl + word_rect.br) / 2
    return any(center in bbox for bbox in bboxes)


def _clean_text(text: str) -> str:
    """
    Limpieza mínima: PYyMuPdf a veces puede rimper el chunking
    """
    lines = [line.strip() for line in text.split("\n")]
    lines = [line for line in lines if line]  # descarta líneas vacías
    return " ".join(lines)
