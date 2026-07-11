from sentence_transformers import SentenceTransformer
import numpy as np

from app.core.config import get_settings

# Singleton: cargamos el modelo una sola vez cuando arranca el servidor.
# Cargarlo en cada request tomaría 3-5 segundos por llamada.
_model: SentenceTransformer | None = None


def get_model() -> SentenceTransformer:
    global _model
    if _model is None:
        settings = get_settings()
        print(f"[embedder] Cargando modelo {settings.embedding_model}...")
        _model = SentenceTransformer(settings.embedding_model)
        print("[embedder] Modelo listo.")
    return _model


def embed_texts(texts: list[str]) -> list[list[float]]:
    """
    Convierte una lista de textos a una lista de vectores.
    Procesa en batch para aprovechar la vectorización del modelo.
    Devuelve listas de float (no numpy arrays) porque ChromaDB y
    JSON los manejan mejor así.
    """
    model = get_model()
    embeddings: np.ndarray = model.encode(
        texts,
        batch_size=32,  # procesar de a 32 chunks a la vez
        show_progress_bar=True,
        convert_to_numpy=True,
        normalize_embeddings=True,  # normalizar para que cosine similarity = dot product
    )
    return embeddings.tolist()


def embed_query(query: str) -> list[float]:
    """
    Convierte una sola pregunta a vector.
    Función separada para dejar claro en el código cuándo
    estamos embeddiendo contenido vs una consulta del usuario.
    """
    model = get_model()
    embedding: np.ndarray = model.encode(
        query,
        normalize_embeddings=True,
        convert_to_numpy=True,
    )
    return embedding.tolist()
