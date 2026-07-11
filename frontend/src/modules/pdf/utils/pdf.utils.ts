const BADGE_COLORS = [
  "bg-blue-500/25 text-blue-300",
  "bg-purple-500/25 text-purple-300",
  "bg-emerald-500/25 text-emerald-300",
  "bg-amber-500/25 text-amber-300",
  "bg-pink-500/25 text-pink-300",
  "bg-cyan-500/25 text-cyan-300",
]

export function pdfBadgeColor(name: string): string {
  const hash = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return BADGE_COLORS[hash % BADGE_COLORS.length]
}
