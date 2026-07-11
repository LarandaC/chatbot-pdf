import { HugeiconsIcon, IconSvgElement } from "@hugeicons/react"

export function WelcomeAction({
  icon,
  title,
  description,
  onClick,
  disabled,
}: {
  icon: IconSvgElement
  title: string
  description: string
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex flex-1 flex-col items-start gap-2 rounded-lg border border-border bg-card p-4 text-left transition-colors hover:border-primary/40 hover:bg-accent disabled:pointer-events-none disabled:opacity-50"
    >
      <span className="flex size-8 items-center justify-center rounded-md bg-accent text-accent-foreground">
        <HugeiconsIcon icon={icon} strokeWidth={1.5} className="size-4" />
      </span>
      <span className="text-sm font-medium text-foreground">{title}</span>
      <span className="text-xs text-muted-foreground">{description}</span>
    </button>
  )
}
