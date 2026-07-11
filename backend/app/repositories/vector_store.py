import chromadb
from chromadb.config import Settings as ChromaSettings

from app.core.config import get_settings

_client: chromadb.api.ClientAPI | None = None


def get_client() -> chromadb.api.ClientAPI:
    global _client
    if _client is None:
        settings = get_settings()
        _client = chromadb.PersistentClient(
            path=settings.chroma_path,
            settings=ChromaSettings(anonymized_telemetry=False),
        )
    return _client


def _get_collection() -> chromadb.Collection:
    """
    Todos los documentos comparten una única colección de Chroma, distinguidos
    por el campo "source" en la metadata. Esto habilita buscar en todos los
    PDFs a la vez sin tener que lanzar una query por colección.
    """
    client = get_client()
    name = get_settings().chroma_collection
    return client.get_or_create_collection(
        name=name,
        metadata={"hnsw:space": "cosine"},  # distancia coseno, consistente con la normalización
    )


def add_chunks(source: str, source_name: str, chunks, embeddings: list[list[float]]) -> int:
    """
    Guarda los chunks de un documento con sus embeddings y metadata en ChromaDB.
    Devuelve la cantidad de chunks guardados.
    """
    collection = _get_collection()

    # Los IDs deben ser únicos en toda la colección compartida, no solo dentro
    # de un documento, por eso llevan el "source" como prefijo.
    ids = [f"{source}_p{c.page_number}_c{c.chunk_index}" for c in chunks]

    collection.add(
        ids=ids,
        documents=[c.text for c in chunks],
        embeddings=embeddings,
        metadatas=[
            {
                "source": source,
                "source_name": source_name,
                "page": c.page_number,
                "chunk_index": c.chunk_index,
                "word_count": len(c.text.split()),
            }
            for c in chunks
        ],
    )
    return len(chunks)


def search(
    query_embedding: list[float],
    n_results: int = 3,
    source: str | None = None,
) -> dict:
    """
    Busca los n_results chunks más similares al query_embedding.
    Si se pasa "source", restringe la búsqueda a ese documento; si no,
    busca en todos los documentos indexados.
    Devuelve el resultado crudo de ChromaDB.
    """
    collection = _get_collection()
    return collection.query(
        query_embeddings=[query_embedding],
        n_results=n_results,
        where={"source": source} if source else None,
        include=["documents", "metadatas", "distances"],
    )


def document_exists(source: str) -> bool:
    """
    Chequea si ya indexamos este documento antes.
    Útil para no re-indexar si el archivo ya fue procesado.
    """
    try:
        collection = _get_collection()
        result = collection.get(where={"source": source}, limit=1, include=[])
        return len(result["ids"]) > 0
    except Exception:
        return False


def delete_document(source: str) -> None:
    """
    Elimina todos los chunks de un documento de la colección compartida.
    """
    collection = _get_collection()
    collection.delete(where={"source": source})


def list_documents() -> list[dict]:
    """
    Lista los documentos indexados con su cantidad de páginas y chunks,
    agrupando la metadata de todos los chunks por "source".
    """
    collection = _get_collection()
    result = collection.get(include=["metadatas"])

    by_source: dict[str, dict] = {}
    for meta in result["metadatas"]:
        source = meta["source"]
        entry = by_source.setdefault(
            source,
            {"source": source, "source_name": meta["source_name"], "pages": set(), "chunks": 0},
        )
        entry["pages"].add(meta["page"])
        entry["chunks"] += 1

    return [
        {
            "source": entry["source"],
            "source_name": entry["source_name"],
            "pages": len(entry["pages"]),
            "chunks": entry["chunks"],
        }
        for entry in by_source.values()
    ]
