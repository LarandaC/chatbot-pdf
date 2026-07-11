"use client"
import { useRef, useState } from "react"
import { toast } from "sonner"
import { HugeiconsIcon } from "@hugeicons/react"
import { Upload01Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import { Spinner } from "@/components/ui/spinner"
import { PdfEntry } from "../types/pdf.types"
import { useUploadPdf } from "../hooks/useUpload"

interface Props {
  onUploaded: (entry: PdfEntry) => void
}

export function UploadZone({ onUploaded }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)

  const { mutate: upload, isPending } = useUploadPdf({
    onSuccess: (entry) => {
      toast.success(`"${entry.name}" indexado`, {
        description: entry.chunksIndexed
          ? `${entry.chunksIndexed} fragmentos guardados`
          : "El PDF ya estaba indexado",
      })
      onUploaded(entry)
    },
    onError: (error) => {
      toast.error("Error al subir el PDF", { description: error.message })
    },
  })

  function handleFile(file: File) {
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      toast.error("Solo se aceptan archivos PDF")
      return
    }
    upload(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <button
      type="button"
      onClick={() => !isPending && inputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
      onDragLeave={() => setDragOver(false)}
      disabled={isPending}
      className={cn(
        "flex w-full items-center gap-2 px-2 py-1.5 rounded-md text-xs text-sidebar-foreground/50",
        "hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sidebar-ring",
        dragOver && "bg-sidebar-accent text-sidebar-foreground",
        isPending && "pointer-events-none"
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
      {isPending ? (
        <Spinner className="size-3.5" />
      ) : (
        <HugeiconsIcon icon={Upload01Icon} strokeWidth={1.5} className="size-3.5 shrink-0" />
      )}
      <span>{isPending ? "Indexando..." : "Subir PDF"}</span>
    </button>
  )
}
