"use client"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { useAppState } from "../modules/welcome/hooks/useAppState"
import { AppHeader } from "../modules/welcome/components/AppHeader"
import { WelcomeScreen } from "../modules/welcome/components/WelcomeScreen"
import { PdfSidebar } from "../modules/pdf/components/PdfSidebar"
import { DocumentsPanel } from "../modules/pdf/components/DocumentsPanel"
import { ChatWindow } from "../modules/chat/components/ChatWindow"

export default function Home() {
  const {
    pdfs,
    chats,
    activeChat,
    activeChatId,
    documentsOpen,
    setActiveChatId,
    setDocumentsOpen,
    handleUploaded,
    createAllDocsChat,
    handleDeleteChat,
    handleDocumentDeleted,
    handleSelectFromPanel,
    handleMessagesChange,
  } = useAppState()

  return (
    <SidebarProvider>
      <PdfSidebar
        pdfs={pdfs}
        chats={chats}
        activeChatId={activeChatId}
        onNewConversation={() => setActiveChatId(null)}
        onNewAllDocsChat={createAllDocsChat}
        onOpenDocuments={() => setDocumentsOpen(true)}
        onSelectChat={(chat) => setActiveChatId(chat.id)}
        onDeleteChat={handleDeleteChat}
      />
      <DocumentsPanel
        open={documentsOpen}
        onOpenChange={setDocumentsOpen}
        pdfs={pdfs}
        onUploaded={handleUploaded}
        onSelect={handleSelectFromPanel}
        onDeleted={handleDocumentDeleted}
      />
      <SidebarInset className="flex flex-col overflow-hidden h-svh">
        <AppHeader activeChat={activeChat} />
        {activeChat ? (
          <ChatWindow
            key={activeChat.id}
            chat={activeChat}
            onMessagesChange={(messages) => handleMessagesChange(activeChat.id, messages)}
          />
        ) : (
          <WelcomeScreen
            hasPdfs={pdfs.length > 0}
            onCreateAllDocsChat={createAllDocsChat}
            onOpenDocuments={() => setDocumentsOpen(true)}
          />
        )}
      </SidebarInset>
    </SidebarProvider>
  )
}
