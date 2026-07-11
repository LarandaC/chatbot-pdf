from fastapi import APIRouter, File, HTTPException, UploadFile

from app.services.pdf_service import index_pdf

router = APIRouter()


@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    """
    Sube un PDF, lo procesa y guarda los embeddings en ChromaDB.
    Si el PDF ya fue indexado antes, devuelve el estado sin re-procesar.
    """
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="El archivo debe ser un PDF")

    try:
        return index_pdf(file)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))
