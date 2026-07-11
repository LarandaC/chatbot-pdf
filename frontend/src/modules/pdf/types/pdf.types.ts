export interface PdfEntry {
    name: string,
    collection: string,
    pages?: number,
    chunksIndexed: number,
}

export interface UploadResponse {
  status: "indexed" | "already_indexed";
  collection: string;
  total_pages?: number;
  pages_skipped?: number;
  chunks_indexed?: number;
  message?: string;
}

export interface DocumentEntry {
  source: string;
  source_name: string;
  pages: number;
  chunks: number;
}

export interface DocumentsResponse {
  documents: DocumentEntry[];
}