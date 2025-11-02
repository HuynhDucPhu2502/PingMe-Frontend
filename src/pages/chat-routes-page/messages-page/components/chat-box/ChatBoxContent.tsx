import type React from "react";
import { useState, useEffect, useRef } from "react";
import type { MessageResponse } from "@/types/chat/message";
import type { RoomResponse } from "@/types/chat/room";
import { EmptyState } from "@/components/custom/EmptyState.tsx";
import LoadingSpinner from "@/components/custom/LoadingSpinner.tsx";
import SentMessageBubble from "../message-bubbles/SentMessageBubble.tsx";
import ReceivedMessageBubble from "../message-bubbles/ReceivedMessageBubble.tsx";

interface ChatBoxContentProps {
  selectedChat: RoomResponse;
  messages: MessageResponse[];
  isLoadingMessages: boolean;
  isLoadingMore: boolean;
  hasMoreMessages: boolean;
  onLoadMore: (beforeId?: number) => void;
  isCurrentUserMessage: (senderId: number) => boolean;
}

export const ChatBoxContent = ({
  selectedChat,
  messages,
  isLoadingMessages,
  isLoadingMore,
  hasMoreMessages,
  onLoadMore,
  isCurrentUserMessage,
}: ChatBoxContentProps) => {
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current && shouldScrollToBottom && !isLoadingMore) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length, shouldScrollToBottom, isLoadingMore]);

  useEffect(() => {
    setShouldScrollToBottom(true);
  }, [selectedChat.roomId]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop } = e.currentTarget;

    if (scrollTop === 0 && hasMoreMessages && !isLoadingMore) {
      const container = e.currentTarget;
      const currentScrollHeight = container.scrollHeight;
      const currentScrollTop = container.scrollTop;

      setShouldScrollToBottom(false);

      const beforeId = messages.length > 0 ? messages[0].id : undefined;

      onLoadMore(beforeId);

      setTimeout(() => {
        requestAnimationFrame(() => {
          const newScrollHeight = container.scrollHeight;
          const heightDifference = newScrollHeight - currentScrollHeight;
          container.scrollTop = currentScrollTop + heightDifference;
        });
      }, 100);
    }
  };

  if (isLoadingMessages) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <EmptyState
        title="Chưa có tin nhắn"
        description="Hãy bắt đầu cuộc trò chuyện bằng cách gửi tin nhắn đầu tiên!"
      />
    );
  }

  return (
    <div
      ref={messagesContainerRef}
      className="h-full overflow-y-auto p-4 space-y-4"
      onScroll={handleScroll}
    >
      {isLoadingMore && (
        <div className="flex justify-center py-2">
          <LoadingSpinner />
        </div>
      )}

      {messages.map((message) => (
        <div key={message.id}>
          {isCurrentUserMessage(message.senderId) ? (
            <SentMessageBubble message={message} />
          ) : (
            <ReceivedMessageBubble
              message={message}
              senderName={
                selectedChat.participants.find(
                  (p) => p.userId === message.senderId
                )?.name || "Unknown"
              }
              senderAvatar={
                selectedChat.participants.find(
                  (p) => p.userId === message.senderId
                )?.avatarUrl
              }
            />
          )}
        </div>
      ))}

      <div ref={messagesEndRef} />
    </div>
  );
};
