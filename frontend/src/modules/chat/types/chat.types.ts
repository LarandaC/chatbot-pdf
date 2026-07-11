export interface Source {
  citation: string;
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
  collection: string;
  n_results?: number;
}

export interface Chat {
  id: string;
  pdfCollection: string;
  pdfName: string;
  title: string;
  messages: Message[];
  createdAt: string;
}
