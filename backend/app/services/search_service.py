from app.integrations.embedder import embed_query
from app.repositories.vector_store import collection_exists_and_has_data, search


def search_chunks(query: str, collection: str, n_results: int) -> dict:
    """
    Busca los chunks más relevantes para una pregunta dentro de una colección.
    Lanza ValueError si la colección no existe o todavía no tiene datos.
    """
    if not collection_exists_and_has_data(collection):
        raise ValueError(f"Colección '{collection}' no encontrada. ¿Subiste el PDF primero?")

    query_emb = embed_query(query)
    results = search(collection, query_emb, n_results)

    docs = results["documents"][0]
    metas = results["metadatas"][0]
    distances = results["distances"][0]

    return {
        "query": query,
        "results": [
            {
                "page": m["page"],
                "chunk_index": m["chunk_index"],
                "score": round(1 - d, 4),  # distancia coseno → similitud
                "text": doc,
            }
            for doc, m, d in zip(docs, metas, distances)
        ],
    }
