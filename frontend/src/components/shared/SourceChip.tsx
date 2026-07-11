import { Source } from "@/src/modules/chat/types/chat.types"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { HugeiconsIcon } from "@hugeicons/react"
import { File01Icon } from "@hugeicons/core-free-icons"

export function SourceChip({ source }: { source: Source }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border bg-card text-xs text-muted-foreground hover:border-border/80 hover:text-foreground transition-colors cursor-default">
          <HugeiconsIcon icon={File01Icon} strokeWidth={2} className="size-3 shrink-0" />
          <span>
            {source.citation}
            {source.source_name && <> · {source.source_name}</>} · Pág. {source.page}
          </span>
          <span className="text-border">·</span>
          <span>{(source.score * 100).toFixed(0)}%</span>
        </div>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs text-xs">
        {source.excerpt}
      </TooltipContent>
    </Tooltip>
  )
}
