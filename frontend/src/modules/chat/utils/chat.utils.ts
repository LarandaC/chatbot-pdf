import { Chat } from "../types/chat.types"

export function relativeTime(dateStr: string): string {
  const diffDays = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86_400_000)
  if (diffDays === 0) return "hoy"
  if (diffDays === 1) return "ayer"
  if (diffDays < 7) return `hace ${diffDays} días`
  if (diffDays < 30) return `hace ${Math.floor(diffDays / 7)} sem.`
  return `hace ${Math.floor(diffDays / 30)} mes.`
}

export function groupByDate(chats: Chat[]): { label: string; chats: Chat[] }[] {
  const now = Date.now()
  const startOfToday = new Date(new Date().setHours(0, 0, 0, 0)).getTime()

  const buckets: Record<string, Chat[]> = {
    Hoy: [],
    Ayer: [],
    "Esta semana": [],
    "Este mes": [],
    "Más antiguo": [],
  }

  for (const chat of chats) {
    const d = new Date(chat.createdAt).getTime()
    const diffDays = Math.floor((now - d) / 86_400_000)
    if (d >= startOfToday) buckets["Hoy"].push(chat)
    else if (diffDays < 2) buckets["Ayer"].push(chat)
    else if (diffDays < 7) buckets["Esta semana"].push(chat)
    else if (diffDays < 30) buckets["Este mes"].push(chat)
    else buckets["Más antiguo"].push(chat)
  }

  return Object.entries(buckets)
    .filter(([, list]) => list.length > 0)
    .map(([label, list]) => ({ label, chats: list }))
}
