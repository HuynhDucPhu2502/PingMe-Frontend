import type { MessageResponse } from "@/types/chat/message";
import MessageImage from "./MessageImage";
import MessageVideo from "./MessageVideo";
import MessageFile from "./MessageFile";
import { formatMessageTime } from "../../utils/formatMessageTime";
import { RotateCcw } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { UserAvatarFallback } from "@/components/custom/UserAvatarFallback";
import type { ChatTheme } from "../../utils/chatThemes";

interface ReceivedMessageBubbleProps {
  message: MessageResponse;
  senderName?: string;
  senderAvatar?: string;
  roomType?: "DIRECT" | "GROUP";
  theme: ChatTheme;
}

export default function ReceivedMessageBubble({
  message,
  senderName,
  senderAvatar,
  roomType,
  theme,
}: ReceivedMessageBubbleProps) {
  const isMediaMessage =
    message.type === "IMAGE" ||
    message.type === "VIDEO" ||
    message.type === "FILE";

  const renderMessageContent = () => {
    if (!message.isActive) {
      return (
        <div className="flex items-center gap-2 text-gray-700">
          <RotateCcw className="h-4 w-4 text-gray-500" />
          <p className="text-sm italic">Tin nhắn đã được thu hồi</p>
        </div>
      );
    }

    switch (message.type) {
      case "IMAGE":
        return <MessageImage src={message.content} alt="Received image" />;
      case "VIDEO":
        return <MessageVideo src={message.content} />;
      case "FILE": {
        const fileName = message.content.split("/").pop() || "file";
        return (
          <MessageFile
            src={message.content}
            fileName={fileName}
            isSent={false}
          />
        );
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
      <Avatar
        className={`w-10 h-10 mr-3 flex-shrink-0 ring-2 ${theme.messages.avatarRing}`}
      >
        <AvatarImage
          src={senderAvatar || "/placeholder.svg"}
          alt={senderName}
        />
        <UserAvatarFallback name={senderName} size="md" />
      </Avatar>

      <div className="max-w-[80%]">
        {roomType === "GROUP" && senderName && (
          <div className="text-xs font-medium text-gray-600 mb-1 ml-1">
            {senderName}
          </div>
        )}

        {isMediaMessage ? (
          <div>{renderMessageContent()}</div>
        ) : (
          <div
            className={`${theme.messages.receivedBubbleBg} ${theme.messages.receivedBubbleText} rounded-2xl rounded-bl-md px-4 py-3 shadow-sm hover:shadow-md transition-all duration-200 border ${theme.messages.receivedBubbleBorder}`}
          >
            {renderMessageContent()}
          </div>
        )}
        <div className="text-xs text-muted-foreground mt-1.5 opacity-70">
          {formatMessageTime(message.createdAt)}
        </div>
      </div>
    </div>
  );
}
