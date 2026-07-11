import { HugeiconsIcon } from "@hugeicons/react"
import { AiChat01Icon, Layers01Icon, FolderLibraryIcon, Upload01Icon } from "@hugeicons/core-free-icons"
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia, EmptyContent } from "@/components/ui/empty"
import { WelcomeAction } from "./WelcomeAction"

interface Props {
  hasPdfs: boolean
  onCreateAllDocsChat: () => void
  onOpenDocuments: () => void
}

export function WelcomeScreen({ hasPdfs, onCreateAllDocsChat, onOpenDocuments }: Props) {
  return (
    <Empty className="flex-1">
      <EmptyMedia variant="icon">
        <HugeiconsIcon icon={AiChat01Icon} strokeWidth={1.5} className="size-6" />
      </EmptyMedia>
      <EmptyHeader>
        <EmptyTitle className="text-xl">Bienvenido a Chat PDF</EmptyTitle>
        <EmptyDescription>
          Convertí tus documentos en conversaciones. Elegí cómo querés empezar.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="max-w-2xl sm:flex-row">
        <WelcomeAction
          icon={Layers01Icon}
          title="Chat general"
          description="Preguntá sobre todos tus documentos a la vez"
          onClick={onCreateAllDocsChat}
          disabled={!hasPdfs}
        />
        <WelcomeAction
          icon={FolderLibraryIcon}
          title="Nuevo chat desde un PDF"
          description="Elegí un documento puntual de tu biblioteca"
          onClick={onOpenDocuments}
        />
        <WelcomeAction
          icon={Upload01Icon}
          title="Subir un PDF"
          description="Agregá uno o varios documentos nuevos"
          onClick={onOpenDocuments}
        />
      </EmptyContent>
    </Empty>
  )
}
