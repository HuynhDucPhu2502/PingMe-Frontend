import type { MessageResponse } from "@/types/message";

interface SentMessageBubbleProps {
  message: MessageResponse;
}

export default function SentMessageBubble({ message }: SentMessageBubbleProps) {
  return (
    <div className="flex justify-end mb-4">
      <div className="max-w-[80%]">
        <div className="bg-blue-500 text-white rounded-lg px-6 py-2 rounded-br-sm break-all">
          <p className="text-sm break-all">{message.content}</p>
        </div>
        <div className="text-xs text-gray-500 mt-1 text-right">
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
}
