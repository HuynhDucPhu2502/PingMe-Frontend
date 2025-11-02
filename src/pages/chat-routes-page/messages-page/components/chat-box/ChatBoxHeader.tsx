import { useAppSelector } from "@/features/hooks";
import type { RoomResponse } from "@/types/chat/room";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
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

  return (
    <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-purple-50 to-blue-50">
      <div className="flex items-center space-x-3">
        <Avatar className="w-10 h-10 rounded-full ring-2 ring-purple-200 flex items-center justify-center">
          <AvatarImage
            src={otherParticipant?.avatarUrl || "/placeholder.svg"}
            className="rounded-full w-full h-full object-cover"
          />
          <AvatarFallback className="bg-purple-100 text-purple-700 font-semibold rounded-full flex items-center justify-center w-full h-full">
            {otherParticipant?.name?.charAt(0).toUpperCase() ||
              selectedChat.name?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold text-gray-900">
            {selectedChat.roomType === "DIRECT"
              ? otherParticipant?.name
              : selectedChat.name}
          </h3>
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
