import {
  useState,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import type {
  MessageResponse,
  HistoryMessageResponse,
} from "@/types/chat/message";
import type { RoomResponse } from "@/types/chat/room";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/errorMessageHandler.ts";
import {
  getHistoryMessagesApi,
  sendMessageApi,
  sendFileMessageApi,
} from "@/services/chat";
import { useAppSelector } from "@/features/hooks.ts";
import { ChatBoxInput } from "./ChatBoxInput.tsx";
import { ChatBoxContent } from "./ChatBoxContent.tsx";
import ChatBoxHeader from "./ChatBoxHeader.tsx";
import ConversationSidebar from "./ConversationSidebar.tsx";

interface ChatBoxProps {
  selectedChat: RoomResponse;
}

export interface ChatBoxRef {
  handleIncomingMessage: (message: MessageResponse) => void;
}

export const ChatBox = forwardRef<ChatBoxRef, ChatBoxProps>(
  ({ selectedChat }, ref) => {
    const { userSession } = useAppSelector((state) => state.auth);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

    const [newMessage, setNewMessage] = useState("");
    const [messages, setMessages] = useState<MessageResponse[]>([]);

    const [hasMoreMessages, setHasMoreMessages] = useState(true);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

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

    const handleSendFile = async (
      file: File,
      type: "IMAGE" | "VIDEO" | "FILE"
    ) => {
      try {
        const formData = new FormData();

        const messageRequest = {
          content: type.toLowerCase(),
          clientMsgId: crypto.randomUUID(),
          type: type,
          roomId: selectedChat.roomId,
        };

        formData.append(
          "message",
          new Blob([JSON.stringify(messageRequest)], {
            type: "application/json",
          })
        );
        formData.append("file", file);

        const response = await sendFileMessageApi(formData);
        const sentMessage = response.data.data;

        setMessages((prev) => [...prev, sentMessage]);
      } catch (err) {
        toast.error(getErrorMessage(err, "Không thể gửi file"));
      }
    };

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

    useImperativeHandle(
      ref,
      () => ({
        handleIncomingMessage,
      }),
      [handleIncomingMessage]
    );

    return (
      <div className="flex-1 flex bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="flex-1 flex flex-col">
          <ChatBoxHeader
            selectedChat={selectedChat}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />

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
            onSendFile={handleSendFile}
            disabled={isLoadingMessages}
          />
        </div>
        <ConversationSidebar
          selectedChat={selectedChat}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>
    );
  }
);

ChatBox.displayName = "ChatBox";
