import { SourceChip } from "@/src/components/shared/SourceChip";
import { Message } from "@/src/modules/chat/types/chat.types";

export function MessageBubble({ message }: { message: Message }) {
    if (message.role === "user") {
        return (
            <div className="flex justify-end">
                <div className="bg-slate-100 text-slate-800 px-4 py-2.5 rounded-2xl rounded-br-sm max-w-[75%] text-sm leading-relaxed">
                    {message.content}
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-2 max-w-[85%]">
            <div className="bg-white border border-slate-100 px-4 py-2.5 rounded-2xl rounded-bl-sm text-sm leading-relaxed text-slate-800 whitespace-pre-wrap">
                {message.content}
            </div>
            {message.sources && message.sources.length > 0 && (
                <div className="flex flex-wrap gap-1.5 px-1">
                    {message.sources.map((s) => (
                        <SourceChip key={s.citation} source={s} />
                    ))}
                </div>
            )}
        </div>
    )
}