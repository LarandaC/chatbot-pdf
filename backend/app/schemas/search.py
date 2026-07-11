from pydantic import BaseModel


class SearchRequest(BaseModel):
    query: str
    collection: str
    n_results: int = 3
