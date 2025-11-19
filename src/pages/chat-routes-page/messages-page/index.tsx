import type React from "react";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAppSelector } from "@/features/hooks.ts";
import { SharedTopBar } from "../components/SharedTopbar.tsx";
import { EmptyState } from "@/components/custom/EmptyState.tsx";
import { ChatBox, type ChatBoxRef } from "./components";
import { ChatCard } from "./components/chat-card";
import LoadingSpinner from "@/components/custom/LoadingSpinner.tsx";
import type { RoomResponse } from "@/types/chat/room";
import { getErrorMessage } from "@/utils/errorMessageHandler.ts";
import { getCurrentUserRoomsApi } from "@/services/chat";
import {
  connectChatWS,
  disconnectChatWS,
  enterRoom,
  leaveRoom,
  type MessageCreatedEventPayload,
  type RoomUpdatedEventPayload,
  type MessageRecalledEventPayload,
} from "@/services/ws/chatSocket";
import type { UserStatusPayload } from "@/types/common/userStatus";
import {
  connectUserStatusSocket,
  disconnectUserStatusSocket,
} from "@/services/ws/userStatusSocket.ts";

export default function MessagesPage() {
  const { userSession } = useAppSelector((state) => state.auth);

  // =======================================================================
  // Lấy danh sách các ChatBoxes
  // =======================================================================
  const [rooms, setRooms] = useState<RoomResponse[]>([]);
  const [isFetchingRooms, setIsFetchingRooms] = useState(false);

  const [roomsPagination, setRoomsPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    hasMore: true,
    isLoadingMore: false,
  });

  const fetchRooms = useCallback(
    async (page: number, size: number, append = false) => {
      try {
        if (!append) setIsFetchingRooms(true);
        else setRoomsPagination((prev) => ({ ...prev, isLoadingMore: true }));

        const res = (await getCurrentUserRoomsApi({ page, size })).data.data;

        setRooms((prev) => {
          if (append) {
            const newRooms = res.content.filter(
              (newRoom: RoomResponse) =>
                !prev.some((r) => r.roomId === newRoom.roomId)
            );
            return [...prev, ...newRooms];
          }
          return res.content;
        });

        setRoomsPagination({
          currentPage: res.page,
          totalPages: res.totalPages,
          hasMore: res.hasMore,
          isLoadingMore: false,
        });
      } catch (err) {
        console.error(getErrorMessage(err));
      } finally {
        setIsFetchingRooms(false);
        setRoomsPagination((prev) => ({ ...prev, isLoadingMore: false }));
      }
    },
    []
  );

  const refetchRooms = () => {
    fetchRooms(1, 20);
  };

  useEffect(() => {
    fetchRooms(1, 20);
  }, [fetchRooms]);

  // =======================================================================
  // Xử lý scroll để load thêm phòng
  // Khi scroll đến 100% chiều cao container sẽ load thêm
  // =======================================================================
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10; // 10px threshold

    if (
      isAtBottom &&
      roomsPagination.hasMore &&
      !roomsPagination.isLoadingMore
    ) {
      fetchRooms(roomsPagination.currentPage + 1, 20, true);
    }
  };

  // =======================================================================
  // Xử lý chọn chat box để hiển thị
  // Xử lý khi thay đổi phòng chat được chọn
  //  - Cập nhật selectedRoomIdRef cho WebSocket tracking
  //  - Enter/leave room để nhận tin nhắn đúng phòng
  // =======================================================================
  const [selectedChat, setSelectedChat] = useState<RoomResponse | null>(null);
  const selectedRoomIdRef = useRef<number | null>(null);

  const handleSetSelectedChat = (room: RoomResponse) => {
    setSelectedChat(room);
  };

  useEffect(() => {
    if (!selectedChat) {
      selectedRoomIdRef.current = null;
      leaveRoom();
      return;
    }

    selectedRoomIdRef.current = selectedChat.roomId;
    enterRoom(selectedChat.roomId);

    return () => {
      leaveRoom();
    };
  }, [selectedChat]);

  // =======================================================================
  // Hàm xử lý sự kiện liên quan đến MESSAGE_CREATED từ WebSocket
  // =======================================================================
  const chatBoxRef = useRef<ChatBoxRef>(null);

  const handleNewMessage = useCallback((event: MessageCreatedEventPayload) => {
    if (
      selectedRoomIdRef.current === event.messageResponse.roomId &&
      chatBoxRef.current
    ) {
      const message = event.messageResponse;
      chatBoxRef.current.handleIncomingMessage(message);
    }
    return;
  }, []);

  // =======================================================================
  // Hàm xử lý sự kiện liên quan đến ROOM_UPDATED từ WebSocket
  // =======================================================================
  const upsertRoom = useCallback((incoming: RoomResponse) => {
    setRooms((prev) => {
      const idx = prev.findIndex((r) => r.roomId === incoming.roomId);
      if (idx === -1) {
        return [incoming, ...prev];
      }

      const updatedRoom = { ...prev[idx], ...incoming };
      const filteredRooms = prev.filter((r) => r.roomId !== incoming.roomId);
      return [updatedRoom, ...filteredRooms];
    });
    setSelectedChat((prev) =>
      prev && prev.roomId === incoming.roomId ? { ...prev, ...incoming } : prev
    );
  }, []);

  // =======================================================================
  // Hàm xử lý sự kiện liên quan đến MESSAGE_RECALLED từ WebSocket
  // =======================================================================
  const handleRecallMessage = useCallback(
    (event: MessageRecalledEventPayload) => {
      if (chatBoxRef.current) {
        chatBoxRef.current.handleRecallMessage(
          event.messageRecalledResponse.id
        );
      }
    },
    []
  );

  // =======================================================================
  // Setup WebSocket connection và event handlers
  // Chạy một lần khi component mount
  // =======================================================================

  // Websocket cho cập nhật tin nhắn, phòng chat
  useEffect(() => {
    connectChatWS({
      baseUrl: `${import.meta.env.VITE_BACKEND_BASE_URL}`,
      onDisconnect: (reason) => {
        console.warn("[ChatWS] disconnected:", reason);
      },
      onMessageCreated: (ev: MessageCreatedEventPayload) => {
        handleNewMessage(ev);
      },
      onRoomUpdated: (ev: RoomUpdatedEventPayload) => {
        upsertRoom(ev.roomResponse);
      },
      onMessageRecalled: (ev: MessageRecalledEventPayload) => {
        handleRecallMessage(ev);
      },
    });

    return () => {
      disconnectChatWS();
    };
  }, [upsertRoom, handleNewMessage, handleRecallMessage]);

  // Websocket cho hiển thị trạng thái trực tuyến người dùng
  const [statusPayload, setStatusPayload] = useState<UserStatusPayload | null>(
    null
  );

  useEffect(() => {
    connectUserStatusSocket({
      baseUrl: `${import.meta.env.VITE_BACKEND_BASE_URL}`,
      onStatus: ({ userId, name, isOnline }) => {
        setStatusPayload({ userId, name, isOnline });
      },
    });

    return () => {
      disconnectUserStatusSocket();
    };
  }, []);

  useEffect(() => {
    if (!statusPayload) return;

    setRooms((prevRooms) =>
      prevRooms.map((room) => ({
        ...room,
        participants: room.participants.map((participant) =>
          participant.userId === Number(statusPayload.userId)
            ? {
                ...participant,
                status: statusPayload.isOnline ? "ONLINE" : "OFFLINE",
              }
            : participant
        ),
      }))
    );
  }, [statusPayload]);

  // =======================================================================

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <SharedTopBar
          onFriendAdded={refetchRooms}
          setSelectedChat={handleSetSelectedChat}
        />

        <div className="flex-1 overflow-y-auto" onScroll={handleScroll}>
          {isFetchingRooms ? (
            <div className="flex items-center justify-center h-full">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              {rooms.map((room) => (
                <ChatCard
                  key={room.roomId}
                  room={room}
                  userSession={userSession}
                  isSelected={selectedChat?.roomId === room.roomId}
                  onClick={() => setSelectedChat(room)}
                />
              ))}
              {roomsPagination.isLoadingMore && (
                <div className="p-4 text-center">
                  <div className="text-sm text-gray-500">Đang tải thêm...</div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {selectedChat ? (
        <ChatBox ref={chatBoxRef} selectedChat={selectedChat} />
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <EmptyState
            title="Chọn một cuộc trò chuyện"
            description="Chọn một cuộc trò chuyện từ danh sách bên trái để bắt đầu nhắn tin"
          />
        </div>
      )}
    </div>
  );
}
