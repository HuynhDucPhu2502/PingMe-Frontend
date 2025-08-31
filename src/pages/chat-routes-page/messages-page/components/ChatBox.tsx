"use client";

import { useState, useEffect, useCallback } from "react";
import type { MessageResponse, HistoryMessageResponse } from "@/types/message";
import type { RoomResponse } from "@/types/room";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/errorMessageHandler.ts";
import { getHistoryMessagesApi, sendMessageApi } from "@/services/chatApi.ts";
import { useAppSelector } from "@/features/hooks.ts";
import { ChatBoxInput } from "./ChatBoxInput.tsx";
import { ChatBoxContent } from "./ChatBoxContent.tsx";
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

  // =======================================================================
  // Lấy lịch sử tin nhắn phòng chat
  // =======================================================================
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<MessageResponse[]>([]);

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

        const historyResponse: HistoryMessageResponse = response.data.data;
        const newMessages = historyResponse.messageResponses;
        const total = historyResponse.total;

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

            const newMessageList = [...uniqueNewMessages, ...updatedMessages];

            setHasMoreMessages(newMessageList.length < total);

            return newMessageList;
          });
        } else {
          setMessages(sortedMessages);
          setHasMoreMessages(sortedMessages.length < total);
        }
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
      setHasMoreMessages(true);
      fetchMessages(undefined, 20);
    }
  }, [selectedChat.roomId, fetchMessages]);

  const handleLoadMore = useCallback(
    (beforeMessageId?: number) => {
      fetchMessages(beforeMessageId, 20, true);
    },
    [fetchMessages]
  );

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
        <ChatBoxContent
          selectedChat={selectedChat}
          messages={messages}
          isLoadingMessages={isLoadingMessages}
          isLoadingMore={isLoadingMore}
          hasMoreMessages={hasMoreMessages}
          onLoadMore={handleLoadMore}
          isCurrentUserMessage={isCurrentUserMessage}
        />
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
