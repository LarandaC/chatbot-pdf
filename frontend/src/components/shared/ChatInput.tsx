"use client"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowUp01Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  disabled?: boolean
  placeholder?: string
  className?: string
}

export function ChatInput({
  value,
  onChange,
  onSend,
  disabled = false,
  placeholder = "Escribí tu mensaje...",
  className,
}: ChatInputProps) {
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  return (
    <div className={cn("shrink-0 border-t border-border bg-background px-6 py-3", className)}>
      <div className="relative">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="min-h-20 max-h-60 pr-12 pb-10 resize-none bg-card border border-border focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        />
        <Button
          size="icon-sm"
          onClick={onSend}
          disabled={!value.trim() || disabled}
          className="absolute right-2 bottom-2"
        >
          <HugeiconsIcon icon={ArrowUp01Icon} strokeWidth={2} />
        </Button>
      </div>
    </div>
  )
}
