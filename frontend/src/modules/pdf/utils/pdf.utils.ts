const BADGE_COLORS = [
  "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
  "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
  "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
  "bg-pink-100 text-pink-700 dark:bg-pink-500/20 dark:text-pink-300",
  "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-300",
]

export function pdfBadgeColor(name: string): string {
  const hash = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return BADGE_COLORS[hash % BADGE_COLORS.length]
}
