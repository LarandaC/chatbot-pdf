"use client"
import { HugeiconsIcon } from "@hugeicons/react"
import { Delete01Icon, PdfIcon } from "@hugeicons/core-free-icons"
import { SidebarMenuAction, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { relativeTime } from "../utils/chat.utils"
import { pdfBadgeColor } from "../../pdf/utils/pdf.utils"
import { Chat } from "../types/chat.types"

interface Props {
  chat: Chat
  isActive: boolean
  onSelect: () => void
  onDelete: () => void
}

export function ChatSidebarItem({ chat, isActive, onSelect, onDelete }: Props) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={isActive}
        onClick={onSelect}
        className="h-auto min-h-8 py-2 overflow-visible items-start cursor-pointer"
      >
        <div className="flex flex-col gap-1 w-full min-w-0">
          <span className="truncate text-xs font-medium leading-tight">
            {chat.title || "Nueva conversación"}
          </span>
          <div className="flex items-center gap-1.5 w-full">
            <span
              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[0.6rem] font-medium leading-none ${pdfBadgeColor(chat.pdfName)}`}
            >
              <HugeiconsIcon icon={PdfIcon} strokeWidth={2} className="size-2.5" />
              {chat.pdfName.slice(0, 14)}
            </span>
            <span className="text-[0.6rem] text-sidebar-foreground/40">
              · {relativeTime(chat.createdAt)}
            </span>
          </div>
        </div>
      </SidebarMenuButton>
      <SidebarMenuAction
        showOnHover
        onClick={(e) => { e.stopPropagation(); onDelete() }}
        title="Eliminar conversación"
      >
        <HugeiconsIcon icon={Delete01Icon} strokeWidth={2} />
      </SidebarMenuAction>
    </SidebarMenuItem>
  )
}

