import { useMutation } from "@tanstack/react-query";
import { PdfEntry, UploadResponse } from "../types/pdf.types";
import { uploadPdf } from "../services/pdf.service";

interface UseUploadPdfProps {
  onSuccess?: (entry: PdfEntry) => void;
  onError?: (error: Error) => void;
}

export function useUploadPdf({ onSuccess, onError }: UseUploadPdfProps = {}) {
  return useMutation({
    mutationFn: uploadPdf,
    onSuccess: (data: UploadResponse, file: File) => {
      const entry: PdfEntry = {
        name: file.name.replace(/\.pdf$/i, ""),
        collection: data.collection,
        pages: data.total_pages,
        chunksIndexed: data.chunks_indexed ?? 0,
      };
      onSuccess?.(entry);
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });
}
