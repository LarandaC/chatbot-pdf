from fastapi import APIRouter

from app.repositories.vector_store import list_documents

router = APIRouter()


@router.get("/documents")
async def get_documents():
    """
    Lista los documentos indexados, para que el frontend pueda hidratar
    la biblioteca sin depender únicamente de localStorage.
    """
    return {"documents": list_documents()}
