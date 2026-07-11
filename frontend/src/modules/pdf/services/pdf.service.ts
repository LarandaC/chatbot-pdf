import { API_URL } from "@/lib/config";
import { apiClient } from "@/lib/api-client";
import { DocumentsResponse, UploadResponse } from "../types/pdf.types";


export async function uploadPdf(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  // No usamos apiClient acá porque FormData no lleva Content-Type: application/json
  const res = await fetch(`${API_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res
      .json()
      .catch(() => ({ detail: "Error al subir el PDF" }));
    throw new Error(err.detail);
  }

  return res.json();
}

export async function listDocuments(): Promise<DocumentsResponse> {
  return apiClient<DocumentsResponse>("/documents");
}
