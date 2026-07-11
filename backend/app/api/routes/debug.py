from fastapi import APIRouter, File, HTTPException, UploadFile

from app.services.pdf_service import preview_chunks

router = APIRouter()


@router.post("/debug/chunk-pdf")
async def debug_chunk_pdf(file: UploadFile = File(...)):
    """
    Endpoint temporal: sube un pdf y devuelve los chunks generados. sin chroma ni embeddings
    """
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="El archivo debe ser un PDF")

    return preview_chunks(file)
