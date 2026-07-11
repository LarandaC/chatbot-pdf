import { SidebarTrigger } from "@/components/ui/sidebar"
import { Chat } from "../../chat/types/chat.types"

interface Props {
  activeChat: Chat | null
}

export function AppHeader({ activeChat }: Props) {
  return (
    <header className="flex items-center gap-3 px-4 h-16 border-b shrink-0">
      <SidebarTrigger />
      {activeChat && (
        <div className="flex flex-col min-w-0">
          <p className="text-lg font-semibold truncate text-foreground leading-tight">
            {activeChat.title || "Nueva conversación"}
          </p>
          <p className="text-xs text-muted-foreground truncate leading-tight">
            {activeChat.pdfName}
          </p>
        </div>
      )}
    </header>
  )
}
