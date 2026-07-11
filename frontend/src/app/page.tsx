"use client"
import { useLocalStorage } from "@/src/hooks/use-local-storage"
import { HugeiconsIcon } from "@hugeicons/react"
import { AiChat01Icon } from "@hugeicons/core-free-icons"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia } from "@/components/ui/empty"
import { PdfEntry } from "../modules/pdf/types/pdf.types"
import { Chat, Message } from "../modules/chat/types/chat.types"
import { PdfSidebar } from "../modules/pdf/components/PdfSidebar"
import { ChatWindow } from "../modules/chat/components/ChatWindow"

export default function Home() {
  const [pdfs, setPdfs] = useLocalStorage<PdfEntry[]>("chat-pdf:pdfs", [])
  const [chats, setChats] = useLocalStorage<Chat[]>("chat-pdf:chats", [])
  const [activeChatId, setActiveChatId] = useLocalStorage<string | null>("chat-pdf:active-chat", null)

  const activeChat = chats.find((c) => c.id === activeChatId) ?? null

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

  function handleDeleteChat(chatId: string) {
    setChats((prev) => prev.filter((c) => c.id !== chatId))
    if (activeChatId === chatId) setActiveChatId(null)
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

  return (
    <SidebarProvider>
      <PdfSidebar
        pdfs={pdfs}
        chats={chats}
        activeChatId={activeChatId}
        onNewConversation={() => setActiveChatId(null)}
        onNewChat={createChat}
        onSelectChat={(chat) => setActiveChatId(chat.id)}
        onDeleteChat={handleDeleteChat}
        onUploaded={handleUploaded}
      />
      <SidebarInset className="flex flex-col overflow-hidden">
        <header className="flex items-center gap-2 px-4 h-12 border-b shrink-0">
          <SidebarTrigger />
          {activeChat && (
            <div className="flex flex-col min-w-0">
              <p className="text-xs font-medium truncate text-foreground leading-tight">
                {activeChat.title || "Nueva conversación"}
              </p>
              <p className="text-[0.625rem] text-muted-foreground truncate leading-tight">
                {activeChat.pdfName}
              </p>
            </div>
          )}
        </header>

        {activeChat ? (
          <ChatWindow
            key={activeChat.id}
            chat={activeChat}
            onMessagesChange={(messages) => handleMessagesChange(activeChat.id, messages)}
          />
        ) : (
          <Empty className="flex-1">
            <EmptyMedia variant="icon">
              <HugeiconsIcon icon={AiChat01Icon} strokeWidth={1.5} className="size-5" />
            </EmptyMedia>
            <EmptyHeader>
              <EmptyTitle>Empezá una conversación</EmptyTitle>
              <EmptyDescription>
                Subí un PDF o hacé clic en un documento de la barra lateral para chatear
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </SidebarInset>
    </SidebarProvider>
  )
}
