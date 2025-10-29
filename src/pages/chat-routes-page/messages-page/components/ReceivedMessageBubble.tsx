import type { MessageResponse } from "@/types/chat/message";
import MessageImage from "./MessageImage";
import MessageVideo from "./MessageVideo";
import MessageFile from "./MessageFile";

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

  const renderMessageContent = () => {
    switch (message.type) {
      case "IMAGE":
        return <MessageImage src={message.content} alt="Received image" />;
      case "VIDEO":
        return <MessageVideo src={message.content} />;
      case "FILE": {
        const fileName = message.content.split("/").pop() || "file";
        return <MessageFile src={message.content} fileName={fileName} />;
      }
      case "TEXT":
      default:
        return (
          <p className="text-sm leading-relaxed break-words">
            {message.content}
          </p>
        );
    }
  };

  return (
    <div className="flex items-start mb-4 group">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0 shadow-sm ring-2 ring-purple-100 ${
          senderAvatar && senderAvatar !== "/placeholder.svg"
            ? "bg-white"
            : getAvatarColor(senderName)
        }`}
      >
        {senderAvatar && senderAvatar !== "/placeholder.svg" ? (
          <img
            src={senderAvatar || "/placeholder.svg"}
            alt={senderName}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <span className="text-sm font-semibold text-white">
            {senderName?.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      <div className="max-w-[80%]">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 text-foreground rounded-2xl rounded-bl-md px-4 py-3 shadow-sm hover:shadow-md transition-all duration-200 border border-purple-100/50">
          {renderMessageContent()}
        </div>
        <div className="text-xs text-muted-foreground mt-1.5 opacity-70">
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
}
