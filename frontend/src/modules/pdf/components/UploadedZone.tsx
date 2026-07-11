"use client"
import { useRef, useState } from "react"
import { toast } from "sonner"
import { HugeiconsIcon } from "@hugeicons/react"
import { Upload01Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import { Spinner } from "@/components/ui/spinner"
import { PdfEntry } from "../types/pdf.types"
import { useUploadPdf } from "../hooks/useUpload"
import { Button } from "@/src/components/ui/button"

interface Props {
  onUploaded: (entry: PdfEntry) => void
}

export function UploadZone({ onUploaded }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const [pendingCount, setPendingCount] = useState(0)

  const { mutate: upload } = useUploadPdf({
    onSuccess: (entry) => {
      setPendingCount((c) => c - 1)
      toast.success(`"${entry.name}" indexado`, {
        description: entry.chunksIndexed
          ? `${entry.chunksIndexed} fragmentos guardados`
          : "El PDF ya estaba indexado",
      })
      onUploaded(entry)
    },
    onError: (error) => {
      setPendingCount((c) => c - 1)
      toast.error("Error al subir el PDF", { description: error.message })
    },
  })

  const isPending = pendingCount > 0

  function handleFiles(fileList: FileList | File[]) {
    const files = Array.from(fileList).filter((f) => f.name.toLowerCase().endsWith(".pdf"))
    const rejected = fileList.length - files.length

    if (rejected > 0) {
      toast.error(rejected === 1 ? "Un archivo no es PDF y fue omitido" : `${rejected} archivos no son PDF y fueron omitidos`)
    }
    if (files.length === 0) return

    setPendingCount((c) => c + files.length)
    files.forEach((file) => upload(file))
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files)
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => !isPending && inputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
      onDragLeave={() => setDragOver(false)}
      disabled={isPending}
      className={cn(
        "cursor-pointer flex w-full items-center justify-center gap-2 px-4 py-3",
        dragOver && "bg-sidebar-accent text-sidebar-foreground",
        isPending && "pointer-events-none"
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && e.target.files.length > 0 && handleFiles(e.target.files)}
      />
      {isPending ? (
        <Spinner className="size-3.5" />
      ) : (
        <HugeiconsIcon icon={Upload01Icon} strokeWidth={1.5} className="size-3.5 shrink-0" />
      )}
      <span>{isPending ? `Indexando ${pendingCount}...` : "Subir PDF (podés elegir varios)"}</span>
    </Button>
  )
}
