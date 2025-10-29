import type { MessageResponse } from "@/types/chat/message";
import MessageImage from "./MessageImage";
import MessageVideo from "./MessageVideo";
import MessageFile from "./MessageFile";

interface SentMessageBubbleProps {
  message: MessageResponse;
}

export default function SentMessageBubble({ message }: SentMessageBubbleProps) {
  const renderMessageContent = () => {
    switch (message.type) {
      case "IMAGE":
        return <MessageImage src={message.content} alt="Sent image" />;
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
    <div className="flex justify-end mb-4 group">
      <div className="max-w-[80%]">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl rounded-br-md px-4 py-3 shadow-md hover:shadow-lg transition-all duration-200">
          {renderMessageContent()}
        </div>
        <div className="text-xs text-muted-foreground mt-1.5 text-right opacity-70">
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
}
