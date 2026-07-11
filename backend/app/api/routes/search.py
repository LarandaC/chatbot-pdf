from fastapi import APIRouter, HTTPException

from app.schemas.search import SearchRequest
from app.services.search_service import search_chunks

router = APIRouter()


@router.post("/search")
async def search_chunks_route(req: SearchRequest):
    """
    Busca chunks relevantes para una pregunta.
    Este es el endpoint de retrieval puro — sin LLM todavía.
    """
    try:
        return search_chunks(req.query, req.collection, req.n_results)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc))
