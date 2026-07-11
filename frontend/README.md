# PDF Metaheurísticas

Proyecto personal desarrollado para agilizar la búsqueda y consulta de información en archivos PDF relacionados con mi trabajo de grado.

## ¿Qué hace?

Permite subir documentos PDF y hacerles preguntas en lenguaje natural. El sistema extrae el texto, lo indexa mediante embeddings semánticos y usa un modelo de lenguaje (LLM) para responder con citas de las páginas fuente.

## Stack

**Backend**
- FastAPI (Python)
- ChromaDB — base de datos vectorial local
- Sentence Transformers — embeddings multilingües (`paraphrase-multilingual-MiniLM-L12-v2`)
- Groq API — inferencia LLM (`llama-3.3-70b-versatile`)

**Frontend**
- Next.js 16 + TypeScript
- Tailwind CSS + shadcn/ui
- TanStack Query

## Cómo correr el proyecto

**Backend**

```bash
cd backend
python -m venv venv
venv\Scripts\activate       # Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

Disponible en `http://localhost:8000` · Docs en `http://localhost:8000/docs`

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

Disponible en `http://localhost:3000`

## Variables de entorno

`backend/.env`
```
GROQ_API_KEY=tu_api_key
```

`frontend/.env.local`
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```
