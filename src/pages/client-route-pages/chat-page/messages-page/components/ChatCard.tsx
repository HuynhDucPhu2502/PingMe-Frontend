import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { RoomResponse } from "@/types/room";
import type { UserSessionResponse } from "@/types/userAccount";

interface ChatCardProps {
  room: RoomResponse;
  userSession: UserSessionResponse | null;
  isSelected: boolean;
  onClick: () => void;
}

export function ChatCard({
  room,
  userSession,
  isSelected,
  onClick,
}: ChatCardProps) {
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

  const getLastMessagePreview = (room: RoomResponse) => {
    if (!room.lastMessage) return "Chưa có tin nhắn";

    const senderParticipant = room.participants.find(
      (p) => p.userId === room.lastMessage?.senderId
    );
    const senderName = senderParticipant?.name || "Unknown";

    if (userSession && senderName === userSession.name) {
      return `Bạn: ${room.lastMessage.preview}`;
    } else {
      return `${senderName}: ${room.lastMessage.preview}`;
    }
  };

  return (
    <div
      onClick={onClick}
      className={`p-4 border-b border-gray-100 cursor-pointer transition-all duration-200 ${
        isSelected
          ? "bg-gradient-to-r from-purple-50 to-purple-100 border-l-4 border-l-purple-600 shadow-md transform scale-[1.02]"
          : "hover:bg-gray-50 hover:shadow-sm"
      }`}
    >
      <div className="flex items-center space-x-3">
        <div className="relative">
          <Avatar
            className={`w-12 h-12 transition-all duration-200 ${
              isSelected ? "ring-2 ring-purple-300 ring-offset-2" : ""
            }`}
          >
            <AvatarImage src={getRoomAvatar(room) || "/placeholder.svg"} />
            <AvatarFallback
              className={`${
                isSelected
                  ? "bg-purple-200 text-purple-700"
                  : "bg-purple-100 text-purple-600"
              }`}
            >
              {getRoomDisplayName(room).charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div
            className={`absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full transition-all duration-200 ${
              isSelected ? "shadow-lg shadow-green-400/50" : ""
            }`}
          ></div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3
              className={`text-sm font-medium truncate transition-colors duration-200 ${
                isSelected ? "text-purple-900" : "text-gray-900"
              }`}
            >
              {getRoomDisplayName(room)}
            </h3>
            <span
              className={`text-xs transition-colors duration-200 ${
                isSelected ? "text-purple-600" : "text-gray-500"
              }`}
            >
              {room.lastMessage
                ? new Date(room.lastMessage.createdAt).toLocaleTimeString(
                    "vi-VN",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )
                : ""}
            </span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <p
              className={`text-sm truncate max-w-[200px] transition-colors duration-200 ${
                isSelected ? "text-purple-700" : "text-gray-600"
              }`}
            >
              {getLastMessagePreview(room)}
            </p>
            {room.unreadCount > 0 && (
              <Badge
                className={`text-white text-xs px-2 py-1 rounded-full transition-all duration-200 ${
                  isSelected
                    ? "bg-purple-700 shadow-lg animate-pulse"
                    : "bg-purple-600"
                }`}
              >
                {room.unreadCount}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
