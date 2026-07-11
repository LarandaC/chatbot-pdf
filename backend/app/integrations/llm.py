from groq import Groq

from app.core.config import get_settings

_client: Groq | None = None

def get_client() -> Groq:
    global _client
    if _client is None:
        api_key = get_settings().groq_api_key
        if not api_key:
            raise RuntimeError("GROQ_API_KEY no está definida en el .env")
        _client = Groq(api_key=api_key)
    return _client

def build_propmt(question: str, chunks: list[dict]) -> str:
    context_parts= []
    for i, chunk in enumerate (chunks, start=1):
        source_name = chunk.get("source_name")
        label = f"{source_name}, página {chunk['page']}" if source_name else f"página {chunk['page']}"
        context_parts.append(f"[{i}] ({label}):\n{chunk['text']}")
    
    context = "\n\n".join(context_parts)
    
    return f"""Eres un asistente que responde preguntas basándose exclusivamente en el contexto proporcionado.

Reglas:
- Respondé solo con información presente en el contexto.
- Citá las fuentes usando [1], [2], [3] al final de cada afirmación relevante.
- Si el contexto no contiene suficiente información para responder, decilo explícitamente.
- Respondé en el mismo idioma que la pregunta.

Contexto:
{context}

Pregunta: {question}

Respuesta:"""

def ask_llm(question: str, chunks: list[dict]) -> dict:
    client = get_client()
    prompt = build_propmt(question, chunks)
    
    response = client.chat.completions.create(
        model=get_settings().groq_model,
        messages=[{"role": "user", "content": prompt}],
        temperature = 0.2,
        max_tokens = 1024,
    )
    
    return {
        "answer": response.choices[0].message.content,
        "model": response.model,
        "tokens_used": response.usage.total_tokens
    }