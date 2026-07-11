from pydantic import BaseModel


class AskRequest(BaseModel):
    question: str
    collection: str | None = None  # None = buscar en todos los documentos
    n_results: int = 3
