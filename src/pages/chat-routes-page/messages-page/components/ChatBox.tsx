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
  onRegisterMessageHandler?: (
    handler: (message: MessageResponse) => void
  ) => void;
}

export function ChatBox({
  selectedChat,
  onRegisterMessageHandler,
}: ChatBoxProps) {
  const { userSession } = useAppSelector((state) => state.auth);

  // Hàm check xem tin nhắn được gửi có phải là từ
  // người dùng hiện tại không
  const isCurrentUserMessage = useCallback(
    (senderId: number) => {
      if (!userSession) return false;
      const senderParticipant = selectedChat.participants.find(
        (p) => p.userId === senderId
      );
      return senderParticipant?.name === userSession.name;
    },
    [selectedChat.participants, userSession]
  );

  // Settings cho cuộn chat box
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  // =======================================================================
  // Lấy lịch sử tin nhắn phòng chat
  // =======================================================================
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<MessageResponse[]>([]);

  const [beforeId, setBeforeId] = useState<number | undefined>(undefined); // ID tin nhắn cũ nhất để load thêm
  const [hasMoreMessages, setHasMoreMessages] = useState(true);

  const [isLoadingMessages, setIsLoadingMessages] = useState(false); // Fetch lần đầu tiên
  const [isLoadingMore, setIsLoadingMore] = useState(false); // Fetch theo dạng scroll

  const fetchMessages = useCallback(
    async (beforeMessageId?: number, size = 20, append = false) => {
      try {
        if (!append) setIsLoadingMessages(true);
        else setIsLoadingMore(true);

        const response = await getHistoryMessagesApi(
          selectedChat.roomId,
          beforeMessageId,
          size
        );

        const newMessages = response.data.data;
        const sortedMessages = newMessages.sort((a, b) => a.id - b.id);

        if (append) {
          setMessages((prev) => {
            // Lấy danh sách Ids đã có sẵn
            const existingIds = new Set(prev.map((msg) => msg.id));

            // Lọc các ids message có sẵn từ danh sách mới fetch
            const uniqueNewMessages = sortedMessages.filter(
              (msg) => !existingIds.has(msg.id)
            );

            // Cập nhật tin nhắn cũ mới nhất nếu có chỉnh
            // sửa
            const updatedMessages = prev.map((existingMsg) => {
              const updatedMsg = sortedMessages.find(
                (newMsg) => newMsg.id === existingMsg.id
              );
              return updatedMsg || existingMsg;
            });

            return [...uniqueNewMessages, ...updatedMessages];
          });

          if (sortedMessages.length > 0) setBeforeId(sortedMessages[0].id);
        } else {
          setMessages(sortedMessages);
          if (sortedMessages.length > 0) setBeforeId(sortedMessages[0].id);
        }

        setHasMoreMessages(sortedMessages.length === size);
      } catch (err) {
        toast.error(getErrorMessage(err, "Không thể lấy lịch sử tin nhắn"));
      } finally {
        setIsLoadingMessages(false);
        setIsLoadingMore(false);
      }
    },
    [selectedChat.roomId]
  );

  /**
   * Load tin nhắn khi chuyển phòng chat
   * Reset tất cả state và load tin nhắn mới
   */
  useEffect(() => {
    if (selectedChat.roomId) {
      setMessages([]);
      setBeforeId(undefined);
      setHasMoreMessages(true);
      setShouldScrollToBottom(true);
      fetchMessages(undefined, 20);
    }
  }, [selectedChat.roomId, fetchMessages]);

  // =======================================================================
  // Xử lý scroll để load thêm tin nhắn
  // =======================================================================
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /**
   * Auto scroll xuống cuối khi có tin nhắn mới
   * Chỉ scroll khi shouldScrollToBottom = true và không đang load more
   */
  useEffect(() => {
    if (messagesEndRef.current && shouldScrollToBottom && !isLoadingMore) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length, shouldScrollToBottom, isLoadingMore]);

  /**
   * Xử lý scroll để load tin nhắn cũ hơn (infinite scroll)
   * Khi scroll lên đầu sẽ load thêm tin nhắn và giữ nguyên vị trí scroll
   */
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

  /**
   * Xử lý gửi tin nhắn mới
   * Gửi API và thêm tin nhắn vào danh sách ngay lập tức (optimistic update)
   */
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

  // =======================================================================
  // Xử lý các sự kiện nhận tin nhắn từ Websocket
  // =======================================================================

  /**
   * Xử lý tin nhắn mới từ WebSocket
   * Validate và thêm tin nhắn vào danh sách, tránh duplicate
   */
  const handleIncomingMessage = useCallback(
    (message: MessageResponse) => {
      if (message.roomId !== selectedChat.roomId) {
        console.warn(
          "[ChatBox] Phòng tin nhắn không hợp lệ:",
          message.roomId,
          "vs",
          selectedChat.roomId
        );
        return;
      }

      const senderExists = selectedChat.participants.some(
        (p) => p.userId === message.senderId
      );
      if (!senderExists) {
        console.warn(
          "[ChatBox] Người gửi tin nhắn không tồn tại trong phòng này:",
          message.senderId
        );
        return;
      }

      if (userSession && isCurrentUserMessage(message.senderId)) return;

      setMessages((prev) => {
        const messageExists = prev.some((msg) => msg.id === message.id);
        if (messageExists) return prev;

        setShouldScrollToBottom(true);
        return [...prev, message];
      });
    },
    [
      isCurrentUserMessage,
      selectedChat.participants,
      selectedChat.roomId,
      userSession,
    ]
  );

  /**
   * Đăng ký handler với parent component để nhận tin nhắn từ WebSocket
   */
  useEffect(() => {
    if (onRegisterMessageHandler) {
      onRegisterMessageHandler(handleIncomingMessage);
    }
  }, [onRegisterMessageHandler, handleIncomingMessage]);

  // =======================================================================

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
