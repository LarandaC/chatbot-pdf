"use client"
import { useTheme } from "next-themes"
import { HugeiconsIcon } from "@hugeicons/react"
import { Sun03Icon, Moon02Icon } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      className={className}
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      title="Cambiar tema"
    >
      <HugeiconsIcon icon={Sun03Icon} strokeWidth={1.5} className="hidden dark:block" />
      <HugeiconsIcon icon={Moon02Icon} strokeWidth={1.5} className="block dark:hidden" />
      <span className="sr-only">Cambiar tema</span>
    </Button>
  )
}
