"use client";

import { useAppSelector } from "@/features/hooks";
import type { RoomResponse } from "@/types/chat/room";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatBoxHeaderProps {
  selectedChat: RoomResponse;
  onToggleSidebar: () => void;
}

const ChatBoxHeader = ({
  selectedChat,
  onToggleSidebar,
}: ChatBoxHeaderProps) => {
  const { userSession } = useAppSelector((state) => state.auth);

  const getOtherParticipant = () => {
    if (selectedChat.roomType === "DIRECT" && userSession) {
      return selectedChat.participants.find((p) => p.name !== userSession.name);
    }
    return null;
  };

  const otherParticipant = getOtherParticipant();

  const avatarUrl =
    selectedChat.roomType === "GROUP"
      ? selectedChat.avatarUrl
      : otherParticipant?.avatarUrl;

  const displayName =
    selectedChat.roomType === "DIRECT"
      ? otherParticipant?.name
      : selectedChat.name;

  return (
    <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-purple-50 to-blue-50">
      <div className="flex items-center space-x-3">
        <Avatar className="w-10 h-10 ring-2 ring-purple-200">
          <AvatarImage src={avatarUrl || "/placeholder.svg"} />
          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-purple-600 text-white font-semibold">
            {displayName?.charAt(0) || "?"}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold text-gray-900">{displayName}</h3>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleSidebar}
        className="hover:bg-purple-100"
      >
        <Info className="h-5 w-5 text-purple-600" />
      </Button>
    </div>
  );
};

export default ChatBoxHeader;
