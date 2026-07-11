import chromadb
from chromadb.config import Settings as ChromaSettings

from app.core.config import get_settings

_client: chromadb.PersistentClient | None = None


def get_client() -> chromadb.PersistentClient:
    global _client
    if _client is None:
        settings = get_settings()
        _client = chromadb.PersistentClient(
            path=settings.chroma_path,
            settings=ChromaSettings(anonymized_telemetry=False),
        )
    return _client


def get_or_create_collection(name: str) -> chromadb.Collection:
    """
    Obtiene una colección existente o la crea si no existe.
    Cada PDF va a tener su propia colección, identificada por
    un nombre derivado del filename.
    """
    client = get_client()
    return client.get_or_create_collection(
        name=name,
        metadata={"hnsw:space": "cosine"},  # distancia coseno, consistente con la normalización
    )


def add_chunks(collection_name: str, chunks, embeddings: list[list[float]]) -> int:
    """
    Guarda los chunks con sus embeddings y metadata en ChromaDB.
    Devuelve la cantidad de chunks guardados.
    """
    collection = get_or_create_collection(collection_name)

    # ChromaDB requiere IDs únicos por documento dentro de una colección.
    # Usamos página + chunk_index para garantizar unicidad y trazabilidad.
    ids = [f"p{c.page_number}_c{c.chunk_index}" for c in chunks]

    collection.add(
        ids=ids,
        documents=[c.text for c in chunks],
        embeddings=embeddings,
        metadatas=[
            {
                "page": c.page_number,
                "chunk_index": c.chunk_index,
                "word_count": len(c.text.split()),
            }
            for c in chunks
        ],
    )
    return len(chunks)


def search(
    collection_name: str,
    query_embedding: list[float],
    n_results: int = 3,
) -> dict:
    """
    Busca los n_results chunks más similares al query_embedding.
    Devuelve el resultado crudo de ChromaDB.
    """
    collection = get_or_create_collection(collection_name)
    return collection.query(
        query_embeddings=[query_embedding],
        n_results=n_results,
        include=["documents", "metadatas", "distances"],
    )


def collection_exists_and_has_data(collection_name: str) -> bool:
    """
    Chequea si ya indexamos este PDF antes.
    Útil para no re-indexar si el archivo ya fue procesado.
    """
    try:
        client = get_client()
        collection = client.get_collection(name=collection_name)
        return collection.count() > 0
    except Exception:
        return False
