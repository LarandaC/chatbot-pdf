from dataclasses import dataclass

from app.processing.page_filter import is_relevant_page


@dataclass
class Chunk:
    text: str
    page_number: int
    chunk_index: int  # posición dentro de esa página


def chunk_text(
    text: str,
    page_number: int,
    chunk_size: int = 500,
    overlap: int = 50,
) -> list[Chunk]:
    """
    Corta el texto en chunks "de chunks_size" palabras, con "overlap" palabras compartidas entre chunks consecutivos
    chunks_size y overlap están en PALABRAS, mo caracteres
    """
    words = text.split()

    if len(words) <= chunk_size:
        return [Chunk(text=text, page_number=page_number, chunk_index=0)]

    chunks = []
    start = 0
    index = 0
    step = chunk_size - overlap

    while start < len(words):
        end = min(start + chunk_size, len(words))
        chunks_words = words[start:end]
        chunks.append(Chunk(
            text=" ".join(chunks_words),
            page_number=page_number,
            chunk_index=index,
        ))

        if end == len(words):
            break

        start += step
        index += 1

    return chunks


def chunks_pages(pages, chunk_size: int = 500, overlap: int = 50) -> list[Chunk]:
    """
    Aplica el chunking a todas las páginas de un PDF y devuelve una sola lista plana de chunks listas para embeddings
    """
    all_chunks = []
    skipped = []

    for page in pages:
        if not page.text.strip():
            continue  # paginas en blanco o solo con imagenes

        filter_result = is_relevant_page(page.text)
        if not filter_result.is_relevant:
            skipped.append({"page": page.page_number, "reason": filter_result.reason})
            continue

        page_chunks = chunk_text(page.text, page.page_number, chunk_size, overlap)
        all_chunks.extend(page_chunks)
    return all_chunks, skipped
