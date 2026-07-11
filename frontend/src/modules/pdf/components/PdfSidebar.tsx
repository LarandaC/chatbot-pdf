"use client"
import { HugeiconsIcon } from "@hugeicons/react"
import { PlusSignIcon, Layers01Icon, FolderLibraryIcon } from "@hugeicons/core-free-icons"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/shared/ThemeToggle"
import { groupByDate } from "../../chat/utils/chat.utils"
import { ChatSidebarItem } from "../../chat/components/ChatSidebarItem"
import { Chat } from "../../chat/types/chat.types"
import { PdfEntry } from "../types/pdf.types"

interface Props {
  pdfs: PdfEntry[]
  chats: Chat[]
  activeChatId: string | null
  onNewConversation: () => void
  onNewAllDocsChat: () => void
  onOpenDocuments: () => void
  onSelectChat: (chat: Chat) => void
  onDeleteChat: (chatId: string) => void
}

export function PdfSidebar({
  pdfs,
  chats,
  activeChatId,
  onNewConversation,
  onNewAllDocsChat,
  onOpenDocuments,
  onSelectChat,
  onDeleteChat,
}: Props) {
  const groups = groupByDate(chats)
  const hasPdfs = pdfs.length > 0

  return (
    <Sidebar>
      <SidebarHeader className="gap-2 pb-3">
        <div className="flex items-center justify-between px-1 pb-1">
          <p className="text-sm font-semibold text-sidebar-foreground">Chat PDF</p>
          <ThemeToggle className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" />
        </div>
        <Button
          variant="outline"
          className="w-full justify-start gap-2 border-sidebar-border bg-sidebar-accent/50 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          onClick={onNewConversation}
        >
          <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
          Nueva conversación
        </Button>

        <div className="flex flex-col gap-1.5">
          <Button
            variant="secondary"
            className="h-auto w-full items-start justify-start gap-2 py-2 text-left whitespace-normal bg-sidebar-accent text-sidebar-accent-foreground hover:bg-[color-mix(in_oklch,var(--sidebar-accent),var(--sidebar-foreground)_8%)]"
            onClick={onNewAllDocsChat}
            disabled={!hasPdfs}
            title={hasPdfs ? undefined : "Subí un PDF primero"}
          >
            <HugeiconsIcon icon={Layers01Icon} strokeWidth={1.5} className="mt-0.5 shrink-0" />
            <span>Chatear con todos los documentos</span>
          </Button>
          <Button
            variant="secondary"
            className="h-auto w-full items-start justify-start gap-2 py-2 text-left whitespace-normal bg-sidebar-accent text-sidebar-accent-foreground hover:bg-[color-mix(in_oklch,var(--sidebar-accent),var(--sidebar-foreground)_8%)]"
            onClick={onOpenDocuments}
          >
            <HugeiconsIcon icon={FolderLibraryIcon} strokeWidth={1.5} className="mt-0.5 shrink-0" />
            <span>Nueva conversación a partir de un documento</span>
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {groups.map(({ label, chats: group }) => (
          <SidebarGroup key={label}>
            <SidebarGroupLabel>{label}</SidebarGroupLabel>
            <SidebarMenu>
              {group.map((chat) => (
                <ChatSidebarItem
                  key={chat.id}
                  chat={chat}
                  isActive={chat.id === activeChatId}
                  onSelect={() => onSelectChat(chat)}
                  onDelete={() => onDeleteChat(chat.id)}
                />
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-0">
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel>Biblioteca</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={onOpenDocuments} className="cursor-pointer">
                <HugeiconsIcon icon={FolderLibraryIcon} strokeWidth={1.5} className="shrink-0" />
                <span className="truncate">Gestionar documentos</span>
                <span className="ml-auto text-sidebar-foreground/40 shrink-0 tabular-nums">
                  {pdfs.length}
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  )
}
