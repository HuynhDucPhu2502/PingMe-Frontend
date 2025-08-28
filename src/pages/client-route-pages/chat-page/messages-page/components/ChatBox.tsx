import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal, Phone, Video, Info } from "lucide-react";
import type { MessageResponse } from "@/types/message";
import type { RoomResponse } from "@/types/room";
import type { PageResponse } from "@/types/apiResponse";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/errorMessageHandler";
import { useAppSelector } from "@/features/hooks";

interface ChatBoxProps {
  selectedChat: RoomResponse;
}

const generateMockMessagesPage = (
  roomId: number,
  page: number,
  size: number
): PageResponse<MessageResponse> => {
  const mockMessages: MessageResponse[] = [];
  const startIndex = page * size;
  const totalElements = 200; // Mock total messages

  for (let i = 0; i < size; i++) {
    const messageIndex = startIndex + i;
    if (messageIndex >= totalElements) break;

    const isCurrentUser = Math.random() > 0.5;

    mockMessages.push({
      id: roomId * 1000 + messageIndex,
      content: `Tin nhắn số ${messageIndex + 1} trong phòng ${roomId}. ${
        isCurrentUser ? "Tôi gửi" : "Người khác gửi"
      } tin nhắn này.`,
      senderId: isCurrentUser ? 0 : Math.floor(Math.random() * 5) + 1,
      roomId: roomId,
      type: "TEXT",
      createdAt: new Date(Date.now() - messageIndex * 60000).toISOString(),
      clientMsgId: `client_msg_${roomId}_${messageIndex}`,
    });
  }

  return {
    content: mockMessages.reverse(), // Newest first for pagination
    page: page,
    size: size,
    totalElements: totalElements,
    totalPages: Math.ceil(totalElements / size),
  };
};

export function ChatBox({ selectedChat }: ChatBoxProps) {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [messagesPagination, setMessagesPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    hasMore: true,
    isLoadingMore: false,
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { userSession } = useAppSelector((state) => state.auth);

  const fetchMessages = async (page: number, size = 20, append = false) => {
    try {
      if (!append) {
        setIsLoadingMessages(true);
      } else {
        setMessagesPagination((prev) => ({ ...prev, isLoadingMore: true }));
      }

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const pageResponse = generateMockMessagesPage(
        selectedChat.roomId,
        page,
        size
      );
      const hasMore = page < pageResponse.totalPages - 1;

      if (append) {
        // For messages, we prepend older messages to the beginning
        setMessages((prev) => [...pageResponse.content, ...prev]);
      } else {
        setMessages(pageResponse.content.reverse()); // Reverse to show newest at bottom
      }

      setMessagesPagination({
        currentPage: pageResponse.page,
        totalPages: pageResponse.totalPages,
        totalElements: pageResponse.totalElements,
        hasMore: hasMore,
        isLoadingMore: false,
      });
    } catch (err) {
      toast.error("Lỗi khi tải tin nhắn");
    } finally {
      setIsLoadingMessages(false);
      setMessagesPagination((prev) => ({ ...prev, isLoadingMore: false }));
    }
  };

  useEffect(() => {
    if (selectedChat.roomId) {
      setMessages([]);
      setMessagesPagination({
        currentPage: 0,
        totalPages: 0,
        totalElements: 0,
        hasMore: true,
        isLoadingMore: false,
      });
      fetchMessages(0, 20);
    }
  }, [selectedChat.roomId]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop } = e.currentTarget;

    // Load more when scrolled to top and there are more messages
    if (
      scrollTop === 0 &&
      messagesPagination.hasMore &&
      !messagesPagination.isLoadingMore
    ) {
      const currentScrollHeight =
        messagesContainerRef.current?.scrollHeight || 0;
      fetchMessages(messagesPagination.currentPage + 1, 20, true).then(() => {
        // Maintain scroll position after loading older messages
        if (messagesContainerRef.current) {
          const newScrollHeight = messagesContainerRef.current.scrollHeight;
          messagesContainerRef.current.scrollTop =
            newScrollHeight - currentScrollHeight;
        }
      });
    }
  };

  useEffect(() => {
    if (messagesEndRef.current && !messagesPagination.isLoadingMore) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      try {
        const messageData = {
          content: newMessage.trim(),
          clientMsgId: `msg_${Date.now()}_${Math.random()}`,
          type: "TEXT" as const,
          roomId: selectedChat.roomId,
        };

        // Add message locally first for immediate feedback
        const newMockMessage: MessageResponse = {
          id: Date.now(),
          content: newMessage.trim(),
          senderId: 0, // Current user
          roomId: selectedChat.roomId,
          type: "TEXT",
          createdAt: new Date().toISOString(),
          clientMsgId: messageData.clientMsgId,
        };

        setMessages((prev) => [...prev, newMockMessage]);
        setNewMessage("");
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

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat Header */}
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

      {/* Messages Area */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
        onScroll={handleScroll}
      >
        {messagesPagination.isLoadingMore && (
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
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.senderId === 0 ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${
                    message.senderId === 0
                      ? "flex-row-reverse space-x-reverse"
                      : ""
                  }`}
                >
                  {message.senderId !== 0 && (
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">
                        U
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`px-4 py-2 rounded-lg ${
                      message.senderId === 0
                        ? "bg-purple-600 text-white"
                        : "bg-gray-200 text-gray-900"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.senderId === 0
                          ? "text-purple-200"
                          : "text-gray-500"
                      }`}
                    >
                      {new Date(message.createdAt).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
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
