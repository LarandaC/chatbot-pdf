from pydantic import BaseModel


class SearchRequest(BaseModel):
    query: str
    collection: str | None = None  # None = buscar en todos los documentos
    n_results: int = 3
