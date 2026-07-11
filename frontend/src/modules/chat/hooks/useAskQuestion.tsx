import { useMutation } from "@tanstack/react-query"
import { AskRequest, AskResponse, Message } from "../types/chat.types"
import { askQuestion } from "../services/chat.service"

interface UseAskQuestionProps {
    onSuccess?: (message: Message) => void
    onError?: (message: Message) => void
}

export function useAskQuestion({
    onSuccess,
    onError,
}: UseAskQuestionProps = {}) {
    return useMutation({
        mutationFn: (req: AskRequest) => askQuestion(req),
        onSuccess: (data: AskResponse) => {
            onSuccess?.({
                role: "assistant",
                content: data.answer,
                sources: data.sources,
            })
        },
        onError: (error: Error) => {
            onError?.({
                role: "assistant",
                content: `Error: ${error.message}`,
            })
        },
    })
}