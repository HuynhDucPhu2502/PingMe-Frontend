import type { MessageResponse } from "@/types/message";

interface ReceivedMessageBubbleProps {
  message: MessageResponse;
  senderName?: string;
  senderAvatar?: string;
}

export default function ReceivedMessageBubble({
  message,
  senderName,
  senderAvatar,
}: ReceivedMessageBubbleProps) {
  return (
    <div className="flex mb-4">
      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center mr-3 flex-shrink-0">
        {senderAvatar && senderAvatar !== "/placeholder.svg" ? (
          <img
            src={senderAvatar || "/placeholder.svg"}
            alt={senderName}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <span className="text-xs font-medium text-gray-600">
            {senderName?.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      <div className="max-w-[80%]">
        <div className="bg-gray-100 text-gray-900 rounded-lg px-6 py-2 rounded-bl-sm break-all">
          <p className="text-sm break-all">{message.content}</p>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
}
