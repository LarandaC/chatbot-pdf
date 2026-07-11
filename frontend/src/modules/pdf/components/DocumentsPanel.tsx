"use client"
import { useState } from "react"
import { toast } from "sonner"
import { HugeiconsIcon } from "@hugeicons/react"
import { PdfIcon, Delete01Icon, BubbleChatIcon } from "@hugeicons/core-free-icons"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemGroup,
} from "@/components/ui/item"
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia } from "@/components/ui/empty"
import { pdfBadgeColor } from "../utils/pdf.utils"
import { PdfEntry } from "../types/pdf.types"
import { UploadZone } from "./UploadedZone"
import { useDeleteDocument } from "../hooks/useDeleteDocument"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  pdfs: PdfEntry[]
  onUploaded: (entry: PdfEntry) => void
  onSelect: (pdf: PdfEntry) => void
  onDeleted: (collection: string) => void
}

function metaLine(pdf: PdfEntry): string {
  const parts: string[] = []
  if (pdf.pages) parts.push(`${pdf.pages} página${pdf.pages === 1 ? "" : "s"}`)
  if (pdf.chunksIndexed) parts.push(`${pdf.chunksIndexed} fragmentos`)
  return parts.join(" · ")
}

export function DocumentsPanel({ open, onOpenChange, pdfs, onUploaded, onSelect, onDeleted }: Props) {
  // Confirmación inline (no un dialog anidado): un AlertDialog dentro del
  // Sheet dispara el "cerrar al interactuar afuera" de Radix sobre el Sheet,
  // porque el AlertDialog se monta en su propio portal.
  const [confirming, setConfirming] = useState<string | null>(null)

  const { mutate: remove, isPending: isDeleting } = useDeleteDocument({
    onSuccess: (source) => {
      toast.success("Documento eliminado")
      onDeleted(source)
      setConfirming(null)
    },
    onError: (error) => {
      toast.error("No se pudo eliminar el documento", { description: error.message })
      setConfirming(null)
    },
  })

  function handleOpenChange(next: boolean) {
    if (!next) setConfirming(null)
    onOpenChange(next)
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="gap-0 sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Tus documentos</SheetTitle>
          <SheetDescription>
            Elegí un PDF para chatear, o subí uno o varios a la vez.
          </SheetDescription>
        </SheetHeader>

        <div className="px-6 pb-3">
          <UploadZone onUploaded={onUploaded} />
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto px-6 pb-6">
          {pdfs.length === 0 ? (
            <Empty className="border-0">
              <EmptyMedia variant="icon">
                <HugeiconsIcon icon={PdfIcon} strokeWidth={1.5} className="size-5" />
              </EmptyMedia>
              <EmptyHeader>
                <EmptyTitle>Todavía no subiste PDFs</EmptyTitle>
                <EmptyDescription>
                  Subí uno o varios archivos para empezar a chatear.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <ItemGroup>
              {pdfs.map((pdf) => (
                <Item key={pdf.collection} variant="outline">
                  <ItemMedia variant="icon">
                    <span
                      className={`flex size-8 items-center justify-center rounded-md ${pdfBadgeColor(pdf.name)}`}
                    >
                      <HugeiconsIcon icon={PdfIcon} strokeWidth={1.5} className="size-4" />
                    </span>
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{pdf.name}</ItemTitle>
                    {metaLine(pdf) && <ItemDescription>{metaLine(pdf)}</ItemDescription>}
                  </ItemContent>
                  <ItemActions>
                    {confirming === pdf.collection ? (
                      <>
                        <span className="text-[0.65rem] text-muted-foreground">¿Seguro?</span>
                        <Button size="sm" variant="ghost" onClick={() => setConfirming(null)}>
                          Cancelar
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={isDeleting}
                          onClick={() => remove(pdf.collection)}
                        >
                          Eliminar
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button size="sm" variant="secondary" onClick={() => onSelect(pdf)}>
                          <HugeiconsIcon icon={BubbleChatIcon} strokeWidth={2} />
                          Chatear
                        </Button>
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          onClick={() => setConfirming(pdf.collection)}
                          title="Eliminar documento"
                        >
                          <HugeiconsIcon icon={Delete01Icon} strokeWidth={2} />
                        </Button>
                      </>
                    )}
                  </ItemActions>
                </Item>
              ))}
            </ItemGroup>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
