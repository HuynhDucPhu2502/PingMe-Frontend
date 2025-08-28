import { useState, useEffect } from "react";
import { useAppSelector } from "@/features/hooks";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SharedTopBar } from "../components/SharedTopbar";
import { EmptyState } from "@/components/custom/EmptyState";
import { ChatBox } from "./components/ChatBox";
import LoadingSpinner from "@/components/custom/LoadingSpinner";
import type { RoomResponse } from "@/types/room";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/errorMessageHandler";
import { getCurrentUserRooms } from "@/services/chatApi";

export default function MessagesPage() {
  const { userSession } = useAppSelector((state) => state.auth);

  const [rooms, setRooms] = useState<RoomResponse[]>([]);
  const [isFetchingRooms, setIsFetchingRooms] = useState(false);
  const [roomsPagination, setRoomsPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    hasMore: true,
    isLoadingMore: false,
  });

  const fetchRooms = async (page: number, size: number, append = false) => {
    try {
      if (!append) {
        setIsFetchingRooms(true);
      } else {
        setRoomsPagination((prev) => ({ ...prev, isLoadingMore: true }));
      }

      const res = (await getCurrentUserRooms({ page, size })).data.data;

      if (append) {
        setRooms((prev) => [...prev, ...res.content]);
      } else {
        setRooms(res.content);
      }

      setRoomsPagination({
        currentPage: res.page,
        totalPages: res.totalPages,
        hasMore: res.page < res.totalPages - 1,
        isLoadingMore: false,
      });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsFetchingRooms(false);
      setRoomsPagination((prev) => ({ ...prev, isLoadingMore: false }));
    }
  };

  const refetchRooms = () => {
    fetchRooms(0, 20);
  };

  useEffect(() => {
    fetchRooms(0, 20);
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

    if (
      scrollPercentage > 0.8 &&
      roomsPagination.hasMore &&
      !roomsPagination.isLoadingMore
    ) {
      fetchRooms(roomsPagination.currentPage + 1, 20, true);
    }
  };

  const [selectedChat, setSelectedChat] = useState<RoomResponse | null>(null);

  const handleSetSelectedChat = (room: RoomResponse) => {
    setSelectedChat(room);
  };

  const getRoomDisplayName = (room: RoomResponse) => {
    if (room.name) return room.name;

    if (room.roomType === "DIRECT" && userSession) {
      // For direct rooms, show the other participant's name
      const otherParticipant = room.participants.find(
        (p) => p.name !== userSession.name
      );
      return otherParticipant?.name || "Unknown";
    }

    return room.participants[0]?.name || "Unknown";
  };

  const getRoomAvatar = (room: RoomResponse) => {
    if (room.roomType === "DIRECT" && userSession) {
      // For direct rooms, show the other participant's avatar
      const otherParticipant = room.participants.find(
        (p) => p.name !== userSession.name
      );
      return otherParticipant?.avatarUrl;
    }

    return room.participants[0]?.avatarUrl;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Top Bar */}
        <SharedTopBar
          onFriendAdded={refetchRooms}
          setSelectedChat={handleSetSelectedChat}
        />

        {/* Chat Categories */}
        <div className="px-4 py-2 border-b border-gray-200">
          <div className="flex space-x-4">
            <button className="text-sm font-medium text-purple-600 border-b-2 border-purple-600 pb-2">
              Tất cả
            </button>
            <button className="text-sm font-medium text-gray-500 hover:text-gray-700 pb-2">
              Chưa đọc
            </button>
            <button className="text-sm font-medium text-gray-500 hover:text-gray-700 pb-2">
              Nhóm
            </button>
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto" onScroll={handleScroll}>
          {isFetchingRooms ? (
            <div className="flex items-center justify-center h-full">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              {rooms.map((room) => (
                <div
                  key={room.roomId}
                  onClick={() => setSelectedChat(room)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                    selectedChat?.roomId === room.roomId
                      ? "bg-purple-50 border-l-4 border-l-purple-600"
                      : ""
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        <AvatarImage
                          src={getRoomAvatar(room) || "/placeholder.svg"}
                        />
                        <AvatarFallback className="bg-purple-100 text-purple-600">
                          {getRoomDisplayName(room).charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {getRoomDisplayName(room)}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {room.lastMessage
                            ? new Date(
                                room.lastMessage.createdAt
                              ).toLocaleTimeString("vi-VN", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : ""}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-sm text-gray-600 truncate">
                          {room.lastMessage?.preview || "Chưa có tin nhắn"}
                        </p>
                        {room.unreadCount > 0 && (
                          <Badge className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                            {room.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
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

      {/* Right Content Area */}
      {selectedChat ? (
        <ChatBox selectedChat={selectedChat} />
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
