"use client"
import { useEffect, useState } from "react"

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue)
  const [hydrated, setHydrated] = useState(false)

  // Lee de localStorage una sola vez después del mount (client-side)
  useEffect(() => {
    try {
      const item = localStorage.getItem(key)
      if (item !== null) setValue(JSON.parse(item) as T)
    } catch {}
    setHydrated(true)
  }, [key])

  // Escribe en localStorage solo después de haber leído (hydrated=true)
  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {}
  }, [key, value, hydrated])

  return [value, setValue] as const
}
