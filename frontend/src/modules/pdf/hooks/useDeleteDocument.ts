import { useMutation } from "@tanstack/react-query";
import { deleteDocument } from "../services/pdf.service";

interface UseDeleteDocumentProps {
  onSuccess?: (source: string) => void;
  onError?: (error: Error, source: string) => void;
}

export function useDeleteDocument({ onSuccess, onError }: UseDeleteDocumentProps = {}) {
  return useMutation({
    mutationFn: deleteDocument,
    onSuccess: (_data, source) => {
      onSuccess?.(source);
    },
    onError: (error: Error, source) => {
      onError?.(error, source);
    },
  });
}
