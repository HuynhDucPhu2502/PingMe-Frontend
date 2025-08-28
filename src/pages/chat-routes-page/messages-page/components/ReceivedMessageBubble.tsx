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
  const getAvatarColor = (name?: string) => {
    if (!name) return "bg-gray-400";

    const colors = [
      "bg-purple-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-red-500",
      "bg-indigo-500",
      "bg-pink-500",
      "bg-teal-500",
    ];

    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="flex items-start mb-4">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 shadow-sm ${
          senderAvatar && senderAvatar !== "/placeholder.svg"
            ? "bg-gray-100"
            : getAvatarColor(senderName)
        }`}
      >
        {senderAvatar && senderAvatar !== "/placeholder.svg" ? (
          <img
            src={senderAvatar || "/placeholder.svg"}
            alt={senderName}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <span className="text-xs font-semibold text-white">
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
