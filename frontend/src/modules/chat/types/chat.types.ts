export interface Source {
  citation: string;
  source?: string;
  source_name?: string;
  page: number;
  score: number;
  excerpt: string;
}

export interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
}

export interface AskResponse {
  question: string;
  answer: string;
  model: string;
  tokens_used: number;
  sources: Source[];
}

export interface AskRequest {
  question: string;
  collection?: string | null;
  n_results?: number;
}

export interface Chat {
  id: string;
  // null = chat sobre todos los documentos cargados
  pdfCollection: string | null;
  pdfName: string;
  title: string;
  messages: Message[];
  createdAt: string;
}
