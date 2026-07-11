import { useEffect, useState } from "react"
import { useLocalStorage } from "@/src/hooks/use-local-storage"
import { PdfEntry } from "../../pdf/types/pdf.types"
import { Chat, Message } from "../../chat/types/chat.types"
import { listDocuments } from "../../pdf/services/pdf.service"

export function useAppState() {
  const [pdfs, setPdfs] = useLocalStorage<PdfEntry[]>("chat-pdf:pdfs", [])
  const [chats, setChats] = useLocalStorage<Chat[]>("chat-pdf:chats", [])
  const [activeChatId, setActiveChatId] = useLocalStorage<string | null>("chat-pdf:active-chat", null)
  const [documentsOpen, setDocumentsOpen] = useState(false)

  const activeChat = chats.find((c) => c.id === activeChatId) ?? null

  useEffect(() => {
    listDocuments()
      .then(({ documents }) => {
        setPdfs((prev) => {
          const known = new Set(prev.map((p) => p.collection))
          const missing = documents
            .filter((d) => !known.has(d.source))
            .map((d) => ({
              name: d.source_name.replace(/\.pdf$/i, ""),
              collection: d.source,
              pages: d.pages,
              chunksIndexed: d.chunks,
            }))
          return missing.length > 0 ? [...prev, ...missing] : prev
        })
      })
      .catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleUploaded(entry: PdfEntry) {
    setPdfs((prev) => {
      const exists = prev.find((p) => p.collection === entry.collection)
      return exists ? prev : [...prev, entry]
    })
  }

  function createChat(pdf: PdfEntry) {
    const newChat: Chat = {
      id: crypto.randomUUID(),
      pdfCollection: pdf.collection,
      pdfName: pdf.name,
      title: "",
      messages: [],
      createdAt: new Date().toISOString(),
    }
    setChats((prev) => [newChat, ...prev])
    setActiveChatId(newChat.id)
  }

  function createAllDocsChat() {
    const newChat: Chat = {
      id: crypto.randomUUID(),
      pdfCollection: null,
      pdfName: "Todos los documentos",
      title: "",
      messages: [],
      createdAt: new Date().toISOString(),
    }
    setChats((prev) => [newChat, ...prev])
    setActiveChatId(newChat.id)
  }

  function handleDeleteChat(chatId: string) {
    setChats((prev) => prev.filter((c) => c.id !== chatId))
    if (activeChatId === chatId) setActiveChatId(null)
  }

  function handleDocumentDeleted(collection: string) {
    setPdfs((prev) => prev.filter((p) => p.collection !== collection))
  }

  function handleSelectFromPanel(pdf: PdfEntry) {
    createChat(pdf)
    setDocumentsOpen(false)
  }

  function handleMessagesChange(chatId: string, messages: Message[]) {
    setChats((prev) =>
      prev.map((c) => {
        if (c.id !== chatId) return c
        const firstUserMsg = messages.find((m) => m.role === "user")
        return {
          ...c,
          messages,
          title: c.title || firstUserMsg?.content.slice(0, 60) || "",
        }
      })
    )
  }

  return {
    pdfs,
    chats,
    activeChat,
    activeChatId,
    documentsOpen,
    setActiveChatId,
    setDocumentsOpen,
    handleUploaded,
    createChat,
    createAllDocsChat,
    handleDeleteChat,
    handleDocumentDeleted,
    handleSelectFromPanel,
    handleMessagesChange,
  }
}
