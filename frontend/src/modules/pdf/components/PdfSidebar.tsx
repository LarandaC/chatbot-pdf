"use client"
import { HugeiconsIcon } from "@hugeicons/react"
import { PdfIcon, PlusSignIcon, Layers01Icon } from "@hugeicons/core-free-icons"
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
import { groupByDate } from "../../chat/utils/chat.utils"
import { ChatSidebarItem } from "../../chat/components/ChatSidebarItem"
import { Chat } from "../../chat/types/chat.types"
import { PdfEntry } from "../types/pdf.types"
import { UploadZone } from "./UploadedZone"

interface Props {
  pdfs: PdfEntry[]
  chats: Chat[]
  activeChatId: string | null
  onNewConversation: () => void
  onNewChat: (pdf: PdfEntry) => void
  onNewAllDocsChat: () => void
  onSelectChat: (chat: Chat) => void
  onDeleteChat: (chatId: string) => void
  onUploaded: (entry: PdfEntry) => void
}

export function PdfSidebar({
  pdfs,
  chats,
  activeChatId,
  onNewConversation,
  onNewChat,
  onNewAllDocsChat,
  onSelectChat,
  onDeleteChat,
  onUploaded,
}: Props) {
  const groups = groupByDate(chats)

  return (
    <Sidebar>
      <SidebarHeader className="gap-2 pb-3">
        <p className="px-2 text-[0.625rem] font-semibold text-sidebar-foreground/40 uppercase tracking-widest">
          Chat PDF
        </p>
        <Button
          variant="outline"
          className="w-full justify-start gap-2 border-sidebar-border bg-transparent text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          onClick={onNewConversation}
        >
          <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
          Nueva conversación
        </Button>
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
          <SidebarGroupLabel>PDFs cargados</SidebarGroupLabel>
          {pdfs.length > 0 && (
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={onNewAllDocsChat} className="cursor-pointer">
                  <HugeiconsIcon icon={Layers01Icon} strokeWidth={1.5} className="shrink-0" />
                  <span className="truncate">Chatear con todos los documentos</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {pdfs.map((pdf) => (
                <SidebarMenuItem key={pdf.collection}>
                  <SidebarMenuButton onClick={() => onNewChat(pdf)} className="cursor-pointer">
                    <HugeiconsIcon icon={PdfIcon} strokeWidth={1.5} className="shrink-0" />
                    <span className="truncate">{pdf.name}</span>
                    {pdf.pages && (
                      <span className="ml-auto text-sidebar-foreground/40 shrink-0 tabular-nums">
                        {pdf.pages}p
                      </span>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          )}
          <div className="px-2 mt-1 pb-2">
            <UploadZone onUploaded={onUploaded} />
          </div>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  )
}
