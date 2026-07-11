"use client"
import { useEffect, useRef, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { BubbleChatIcon } from "@hugeicons/core-free-icons"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Spinner } from "@/components/ui/spinner"
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia } from "@/components/ui/empty"
import { Chat, Message } from "../types/chat.types"
import { useAskQuestion } from "../hooks/useAskQuestion"
import { MessageBubble } from "@/src/components/shared/Message"
import { ChatInput } from "@/src/components/shared/ChatInput"

interface Props {
  chat: Chat
  onMessagesChange: (messages: Message[]) => void
}

export function ChatWindow({ chat, onMessagesChange }: Props) {
  const [input, setInput] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chat.messages])

  const { mutate: ask, isPending } = useAskQuestion({
    onSuccess: (msg) => onMessagesChange([...chat.messages, msg]),
    onError: (msg) => onMessagesChange([...chat.messages, msg]),
  })

  function handleSend() {
    const question = input.trim()
    if (!question || isPending) return
    const userMsg: Message = { role: "user", content: question }
    onMessagesChange([...chat.messages, userMsg])
    setInput("")
    ask({ question, collection: chat.pdfCollection })
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <ScrollArea className="flex-1 px-6 py-4">
        <div className="flex flex-col gap-4 max-w-3xl mx-auto">
          {chat.messages.length === 0 && (
            <Empty className="mt-8">
              <EmptyMedia variant="icon">
                <HugeiconsIcon icon={BubbleChatIcon} strokeWidth={1.5} className="size-5" />
              </EmptyMedia>
              <EmptyHeader>
                <EmptyTitle>Hacé una pregunta</EmptyTitle>
                <EmptyDescription>
                  Consultando <strong>{chat.pdfName}</strong>
                  {chat.messages.length === 0 && " · el contexto es el documento completo"}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
          {chat.messages.map((msg, i) => (
            <MessageBubble key={i} message={msg} />
          ))}
          {isPending && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Spinner className="size-3.5" />
              <span>Pensando...</span>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      <div className="sticky bottom-0 px-6 py-3 bg-background shrink-0">
        <div className="max-w-3xl mx-auto">
          <ChatInput
            value={input}
            onChange={setInput}
            onSend={handleSend}
            disabled={isPending}
            placeholder={`Preguntá sobre "${chat.pdfName}"...`}
          />
        </div>
      </div>
    </div>
  )
}
