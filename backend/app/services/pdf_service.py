import shutil
import tempfile
from pathlib import Path

from fastapi import UploadFile

from app.integrations.embedder import embed_texts
from app.processing.chunker import chunks_pages
from app.processing.pdf_processor import extract_text_by_page
from app.repositories.vector_store import add_chunks, collection_exists_and_has_data
from app.utils.naming import filename_to_collection


def _save_temp_pdf(file: UploadFile) -> Path:
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
    try:
        shutil.copyfileobj(file.file, tmp)
    finally:
        tmp.close()
    return Path(tmp.name)


def _extract_and_chunk(pdf_path: Path):
    pages = extract_text_by_page(str(pdf_path))
    chunks, skipped = chunks_pages(pages)
    return pages, chunks, skipped


def index_pdf(file: UploadFile) -> dict:
    """
    Procesa un PDF (extracción -> chunking -> embeddings -> ChromaDB)
    y lo indexa. Si ya fue indexado antes, no lo vuelve a procesar.
    Lanza ValueError si no se pudo extraer texto del PDF.
    """
    collection_name = filename_to_collection(file.filename)

    if collection_exists_and_has_data(collection_name):
        return {
            "status": "already_indexed",
            "collection": collection_name,
            "message": "Este pdf ya fue indexado",
        }

    tmp_path = _save_temp_pdf(file)
    try:
        pages, chunks, skipped = _extract_and_chunk(tmp_path)

        if not chunks:
            raise ValueError("No se pudo extraer texto del PDF.")

        print(f"[pdf_service] Generando embeddings para {len(chunks)} chunks...")
        embeddings = embed_texts([c.text for c in chunks])
        saved = add_chunks(collection_name, chunks, embeddings)
    finally:
        tmp_path.unlink(missing_ok=True)

    return {
        "status": "indexed",
        "collection": collection_name,
        "total_pages": len(pages),
        "pages_skipped": len(skipped),
        "chunks_indexed": saved,
    }


def preview_chunks(file: UploadFile) -> dict:
    """
    Extrae y chunkea un PDF sin generar embeddings ni guardar en ChromaDB.
    Pensado para depurar el chunking (endpoint /debug/chunk-pdf).
    """
    tmp_path = _save_temp_pdf(file)
    try:
        pages, chunks, skipped = _extract_and_chunk(tmp_path)
    finally:
        tmp_path.unlink(missing_ok=True)

    return {
        "filename": file.filename,
        "total_pages": len(pages),
        "total_chunks": len(chunks),
        "pages_skipped": len(skipped),
        "skipped_detail": skipped,
        "chunks": [
            {
                "page": c.page_number,
                "chunk_index": c.chunk_index,
                "word_count": len(c.text.split()),
                "preview": c.text[:150] + "..." if len(c.text) > 150 else c.text,
            }
            for c in chunks
        ],
    }
