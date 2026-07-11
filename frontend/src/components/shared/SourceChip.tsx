import { Source } from "@/src/modules/chat/types/chat.types"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { HugeiconsIcon } from "@hugeicons/react"
import { File01Icon } from "@hugeicons/core-free-icons"

export function SourceChip({ source }: { source: Source }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border bg-background text-xs text-muted-foreground hover:border-border/80 hover:text-foreground transition-colors cursor-default">
            <HugeiconsIcon icon={File01Icon} strokeWidth={2} className="size-3 shrink-0" />
            <span>{source.citation} · Pág. {source.page}</span>
            <span className="text-border">·</span>
            <span>{(source.score * 100).toFixed(0)}%</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs text-xs">
          {source.excerpt}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
