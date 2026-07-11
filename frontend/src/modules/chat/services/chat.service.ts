import { apiClient } from "@/lib/api-client";
import { AskRequest, AskResponse } from "../types/chat.types";

export async function askQuestion(req: AskRequest): Promise<AskResponse> {
  return apiClient<AskResponse>("/ask", {
    method: "POST",
    body: JSON.stringify({ ...req, n_results: req.n_results ?? 3 }),
  });
}
