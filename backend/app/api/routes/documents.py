from fastapi import APIRouter, HTTPException

from app.repositories.vector_store import delete_document, document_exists, list_documents

router = APIRouter()


@router.get("/documents")
async def get_documents():
    """
    Lista los documentos indexados, para que el frontend pueda hidratar
    la biblioteca sin depender únicamente de localStorage.
    """
    return {"documents": list_documents()}


@router.delete("/documents/{source}")
async def delete_document_route(source: str):
    """
    Elimina un documento indexado (y todos sus chunks) de la biblioteca.
    """
    if not document_exists(source):
        raise HTTPException(status_code=404, detail=f"Documento '{source}' no encontrado.")

    delete_document(source)
    return {"status": "deleted", "source": source}
