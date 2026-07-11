from app.integrations.embedder import embed_query
from app.repositories.vector_store import document_exists, search


def search_chunks(query: str, collection: str | None, n_results: int) -> dict:
    """
    Busca los chunks más relevantes para una pregunta.
    Si "collection" viene, busca solo en ese documento; si no, busca en
    todos los documentos indexados.
    Lanza ValueError si se pide un documento puntual que no existe.
    """
    if collection and not document_exists(collection):
        raise ValueError(f"Documento '{collection}' no encontrado. ¿Subiste el PDF primero?")

    query_emb = embed_query(query)
    results = search(query_emb, n_results, source=collection)

    docs = results["documents"][0]
    metas = results["metadatas"][0]
    distances = results["distances"][0]

    return {
        "query": query,
        "results": [
            {
                "source": m["source"],
                "source_name": m["source_name"],
                "page": m["page"],
                "chunk_index": m["chunk_index"],
                "score": round(1 - d, 4),  # distancia coseno → similitud
                "text": doc,
            }
            for doc, m, d in zip(docs, metas, distances)
        ],
    }
