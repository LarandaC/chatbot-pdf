from pydantic import BaseModel


class AskRequest(BaseModel):
    question: str
    collection: str
    n_results: int = 3
