import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal, Phone, Video, Info } from "lucide-react";
import type { MessageResponse } from "@/types/message";
import type { RoomResponse } from "@/types/room";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/errorMessageHandler";
import { getHistoryMessagesApi, sendMessageApi } from "@/services/chatApi";
import { useAppSelector } from "@/features/hooks";
import SentMessageBubble from "./SentMessageBubble";
import ReceivedMessageBubble from "./ReceivedMessageBubble";

interface ChatBoxProps {
  selectedChat: RoomResponse;
}

export function ChatBox({ selectedChat }: ChatBoxProps) {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [beforeId, setBeforeId] = useState<number | undefined>(undefined);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { userSession } = useAppSelector((state) => state.auth);

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

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop } = e.currentTarget;

    if (scrollTop === 0 && hasMoreMessages && !isLoadingMore) {
      const container = messagesContainerRef.current;
      if (!container) return;

      const currentScrollHeight = container.scrollHeight;
      const currentScrollTop = container.scrollTop;

      setShouldScrollToBottom(false);

      fetchMessages(beforeId, 20, true).then(() => {
        requestAnimationFrame(() => {
          if (container) {
            const newScrollHeight = container.scrollHeight;
            const heightDifference = newScrollHeight - currentScrollHeight;
            container.scrollTop = currentScrollTop + heightDifference;
          }
        });
      });
    }
  };

  useEffect(() => {
    if (messagesEndRef.current && shouldScrollToBottom && !isLoadingMore) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length, shouldScrollToBottom, isLoadingMore]);

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

  const getOtherParticipantName = () => {
    if (selectedChat.roomType === "DIRECT" && userSession) {
      const otherParticipant = selectedChat.participants.find(
        (p) => p.name !== userSession.name
      );
      return otherParticipant?.name || "Unknown";
    }
    return selectedChat.name || "Unknown";
  };

  const getOtherParticipantAvatar = () => {
    if (selectedChat.roomType === "DIRECT" && userSession) {
      const otherParticipant = selectedChat.participants.find(
        (p) => p.name !== userSession.name
      );
      return otherParticipant?.avatarUrl || "/placeholder.svg";
    }
    return "/placeholder.svg";
  };

  const getAvatarFallback = () => {
    const displayName = getOtherParticipantName();
    return displayName.charAt(0).toUpperCase();
  };

  const getSenderInfo = (senderId: number) => {
    const participant = selectedChat.participants.find(
      (p) => p.userId === senderId
    );
    return {
      name: participant?.name || "Unknown",
      avatar: participant?.avatarUrl,
    };
  };

  const isCurrentUserMessage = (senderId: number) => {
    if (!userSession) return false;
    return senderId === userSession.id;
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage
                src={getOtherParticipantAvatar() || "/placeholder.svg"}
              />
              <AvatarFallback className="bg-purple-100 text-purple-600">
                {getAvatarFallback()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {getOtherParticipantName()}
              </h2>
              <p className="text-sm text-gray-500">
                {selectedChat.roomType === "DIRECT"
                  ? "Trò chuyện riêng"
                  : "Nhóm chat"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-purple-600"
            >
              <Phone className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-purple-600"
            >
              <Video className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-purple-600"
            >
              <Info className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-purple-600"
            >
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
        onScroll={handleScroll}
      >
        {isLoadingMore && (
          <div className="text-center py-2">
            <div className="text-sm text-gray-500">Đang tải tin nhắn cũ...</div>
          </div>
        )}

        {isLoadingMessages ? (
          <div className="text-center py-8">
            <div className="text-sm text-gray-500">Đang tải tin nhắn...</div>
          </div>
        ) : (
          <>
            {messages.map((message) => {
              const isOwnMessage = isCurrentUserMessage(message.senderId);

              if (isOwnMessage) {
                return <SentMessageBubble key={message.id} message={message} />;
              } else {
                const senderInfo = getSenderInfo(message.senderId);
                return (
                  <ReceivedMessageBubble
                    key={message.id}
                    message={message}
                    senderName={senderInfo.name}
                    senderAvatar={senderInfo.avatar}
                  />
                );
              }
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Nhập tin nhắn..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Gửi
          </Button>
        </div>
      </div>
    </div>
  );
}
