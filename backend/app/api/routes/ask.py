from fastapi import APIRouter, HTTPException

from app.integrations.llm import ask_llm
from app.integrations.embedder import embed_query
from app.schemas.ask import AskRequest
from app.repositories.vector_store import document_exists, search

router = APIRouter()

@router.post("/ask")
async def ask(req: AskRequest):
    if req.collection and not document_exists(req.collection):
        raise HTTPException(
            status_code=404,
            detail=f"Documento '{req.collection}' no encontrado. ¿Subiste el PDF primero?"
        )

    # paso 1, retrieval
    query_emb = embed_query(req.question)
    raw_results = search(query_emb, req.n_results, source=req.collection)

    docs = raw_results["documents"][0]
    metas = raw_results["metadatas"][0]
    distances = raw_results["distances"][0]

    chunks_for_llm =[
        {
            "source":      m["source"],
            "source_name": m["source_name"],
            "page":        m["page"],
            "text":        doc,
            "score":       round(1 - d, 4),
        }
        for doc, m, d in zip(docs, metas, distances)
    ]

    # paso 2, generacion
    llm_result = ask_llm(req.question, chunks_for_llm)

    # paso 3, respuesta con fuentes
    return {
        "question":    req.question,
        "answer":      llm_result["answer"],
        "model":       llm_result["model"],
        "tokens_used": llm_result["tokens_used"],
        "sources": [
            {
                "citation":    f"[{i+1}]",
                "source":      c["source"],
                "source_name": c["source_name"],
                "page":        c["page"],
                "score":       c["score"],
                "excerpt":     c["text"][:200] + "..." if len(c["text"]) > 200 else c["text"],
            }
            for i, c in enumerate(chunks_for_llm)
        ],
    }
