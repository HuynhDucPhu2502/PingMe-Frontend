import { useState, useEffect, useCallback, useRef } from "react";
import type { MessageResponse } from "@/types/message";
import type { RoomResponse } from "@/types/room";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/errorMessageHandler.ts";
import { getHistoryMessagesApi, sendMessageApi } from "@/services/chatApi.ts";
import { useAppSelector } from "@/features/hooks.ts";
import { EmptyState } from "@/components/custom/EmptyState.tsx";
import { ChatBoxInput } from "./ChatBoxInput.tsx";
import LoadingSpinner from "@/components/custom/LoadingSpinner.tsx";
import SentMessageBubble from "./SentMessageBubble.tsx";
import ReceivedMessageBubble from "./ReceivedMessageBubble.tsx";
import ChatBoxHeader from "./ChatBoxHeader.tsx";

interface ChatBoxProps {
  selectedChat: RoomResponse;
}

export function ChatBox({ selectedChat }: ChatBoxProps) {
  const { userSession } = useAppSelector((state) => state.auth);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [beforeId, setBeforeId] = useState<number | undefined>(undefined);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isCurrentUserMessage = (senderId: number) => {
    if (!userSession) return false;
    const senderParticipant = selectedChat.participants.find(
      (p) => p.userId === senderId
    );
    return senderParticipant?.name === userSession.name;
  };

  const fetchMessages = useCallback(
    async (beforeMessageId?: number, size = 20, append = false) => {
      try {
        if (!append) {
          setIsLoadingMessages(true);
        } else {
          setIsLoadingMore(true);
        }

        const response = await getHistoryMessagesApi(
          selectedChat.roomId,
          beforeMessageId,
          size
        );
        const newMessages = response.data.data;

        const sortedMessages = newMessages.sort((a, b) => a.id - b.id);

        if (append) {
          setMessages((prev) => {
            const existingIds = new Set(prev.map((msg) => msg.id));
            const uniqueNewMessages = sortedMessages.filter(
              (msg) => !existingIds.has(msg.id)
            );
            const updatedMessages = prev.map((existingMsg) => {
              const updatedMsg = sortedMessages.find(
                (newMsg) => newMsg.id === existingMsg.id
              );
              return updatedMsg || existingMsg;
            });
            return [...uniqueNewMessages, ...updatedMessages];
          });
          if (sortedMessages.length > 0) {
            setBeforeId(sortedMessages[0].id);
          }
        } else {
          setMessages(sortedMessages);
          if (sortedMessages.length > 0) {
            setBeforeId(sortedMessages[0].id);
          }
        }

        setHasMoreMessages(sortedMessages.length === size);
      } catch (err) {
        toast.error("Lỗi khi tải tin nhắn");
        console.error("Error fetching messages:", err);
      } finally {
        setIsLoadingMessages(false);
        setIsLoadingMore(false);
      }
    },
    [selectedChat.roomId]
  );

  useEffect(() => {
    if (selectedChat.roomId) {
      setMessages([]);
      setBeforeId(undefined);
      setHasMoreMessages(true);
      setShouldScrollToBottom(true);
      fetchMessages(undefined, 20);
    }
  }, [selectedChat.roomId, fetchMessages]);

  useEffect(() => {
    if (messagesEndRef.current && shouldScrollToBottom && !isLoadingMore) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length, shouldScrollToBottom, isLoadingMore]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop } = e.currentTarget;

    if (scrollTop === 0 && hasMoreMessages && !isLoadingMore) {
      const container = e.currentTarget;
      const currentScrollHeight = container.scrollHeight;
      const currentScrollTop = container.scrollTop;

      setShouldScrollToBottom(false);

      fetchMessages(beforeId, 20, true).then(() => {
        requestAnimationFrame(() => {
          const newScrollHeight = container.scrollHeight;
          const heightDifference = newScrollHeight - currentScrollHeight;
          container.scrollTop = currentScrollTop + heightDifference;
        });
      });
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      try {
        const messageData = {
          content: newMessage.trim(),
          clientMsgId: crypto.randomUUID(),
          type: "TEXT" as const,
          roomId: selectedChat.roomId,
        };

        const response = await sendMessageApi(messageData);
        const sentMessage = response.data.data;

        setMessages((prev) => [...prev, sentMessage]);
        setNewMessage("");
        setShouldScrollToBottom(true);
      } catch (err) {
        toast.error(getErrorMessage(err));
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white rounded-lg shadow-sm overflow-hidden">
      <ChatBoxHeader selectedChat={selectedChat} />

      <div className="flex-1 overflow-hidden relative">
        {isLoadingMessages ? (
          <div className="flex items-center justify-center h-full">
            <LoadingSpinner />
          </div>
        ) : messages.length === 0 ? (
          <EmptyState
            title="Chưa có tin nhắn"
            description="Hãy bắt đầu cuộc trò chuyện bằng cách gửi tin nhắn đầu tiên!"
          />
        ) : (
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
        )}
      </div>

      <ChatBoxInput
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        onSendMessage={handleSendMessage}
        disabled={isLoadingMessages}
      />
    </div>
  );
}
