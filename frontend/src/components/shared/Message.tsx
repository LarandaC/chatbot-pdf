import { HugeiconsIcon } from "@hugeicons/react"
import { BotIcon, UserIcon } from "@hugeicons/core-free-icons"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Message, MessageAvatar, MessageContent, MessageFooter } from "@/components/ui/message"
import { Message as MessageType } from "@/src/modules/chat/types/chat.types"
import { SourceChip } from "./SourceChip"

function renderWithCitations(text: string): React.ReactNode {
  const parts = text.split(/(\[\d+\])/g)
  return parts.map((part, i) => {
    const match = part.match(/^\[(\d+)\]$/)
    if (match) {
      return (
        <span
          key={i}
          className="inline-flex items-center justify-center w-3 h-3 rounded-full bg-primary/12 text-primary text-[0.55rem] font-bold mx-0.5 align-middle leading-none"
        >
          {match[1]}
        </span>
      )
    }
    return <span key={i}>{part}</span>
  })
}

export function MessageBubble({ message }: { message: MessageType }) {
  if (message.role === "user") {
    return (
      <Message align="end">
        <MessageAvatar className="self-start">
          <Avatar size="sm">
            <AvatarFallback className="bg-primary text-primary-foreground">
              <HugeiconsIcon icon={UserIcon} strokeWidth={1.5} className="size-3.5" />
            </AvatarFallback>
          </Avatar>
        </MessageAvatar>
        <MessageContent>
          <Bubble variant="default" align="end">
            <BubbleContent className="text-sm px-4 py-3">{message.content}</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
    )
  }

  return (
    <Message align="start">
      <MessageAvatar className="self-start group-has-data-[slot=message-footer]/message:translate-y-0">
        <Avatar size="sm">
          <AvatarFallback className="bg-muted text-primary">
            <HugeiconsIcon icon={BotIcon} strokeWidth={1.5} className="size-3.5" />
          </AvatarFallback>
        </Avatar>
      </MessageAvatar>
      <MessageContent>
        <Bubble variant="outline">
          <BubbleContent className="whitespace-pre-wrap text-sm px-4 py-3">
            {renderWithCitations(message.content)}
          </BubbleContent>
        </Bubble>
        {message.sources && message.sources.length > 0 && (
          <MessageFooter className="flex-wrap gap-1.5 px-0">
            {message.sources.map((s) => (
              <SourceChip key={s.citation} source={s} />
            ))}
          </MessageFooter>
        )}
      </MessageContent>
    </Message>
  )
}
