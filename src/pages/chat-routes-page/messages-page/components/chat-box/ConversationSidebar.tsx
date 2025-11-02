import { useAppSelector } from "@/features/hooks";
import type { RoomResponse } from "@/types/chat/room";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { X, ImageIcon, Video, FileText, ChevronRight } from "lucide-react";

interface ConversationSidebarProps {
  selectedChat: RoomResponse;
  isOpen: boolean;
  onClose: () => void;
}

const ConversationSidebar = ({
  selectedChat,
  isOpen,
  onClose,
}: ConversationSidebarProps) => {
  const { userSession } = useAppSelector((state) => state.auth);

  const getOtherParticipant = () => {
    if (selectedChat.roomType === "DIRECT" && userSession) {
      return selectedChat.participants.find((p) => p.name !== userSession.name);
    }
    return null;
  };

  const otherParticipant = getOtherParticipant();

  if (!isOpen) return null;

  return (
    <div className="w-80 border-l bg-white flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Thông tin hội thoại</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* User/Room Info */}
        <div className="p-6 border-b flex flex-col items-center">
          <Avatar className="w-20 h-20 mb-3">
            <AvatarImage
              src={otherParticipant?.avatarUrl || "/placeholder.svg"}
              alt={
                selectedChat.roomType === "DIRECT"
                  ? otherParticipant?.name
                  : selectedChat.name || ""
              }
            />
            <AvatarFallback className="bg-purple-100 text-purple-700 text-2xl font-semibold">
              {selectedChat.roomType === "DIRECT"
                ? otherParticipant?.name?.charAt(0).toUpperCase()
                : selectedChat.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <h4 className="font-semibold text-lg text-gray-900">
            {selectedChat.roomType === "DIRECT"
              ? otherParticipant?.name
              : selectedChat.name}
          </h4>
          {selectedChat.roomType === "DIRECT" && otherParticipant?.status && (
            <p className="text-sm text-gray-500 mt-1">
              {otherParticipant.status === "ONLINE"
                ? "Đang hoạt động"
                : "Không hoạt động"}
            </p>
          )}
        </div>

        {/* Images & Videos Section */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-purple-600" />
              <h5 className="font-medium text-gray-900">Ảnh & Video</h5>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-purple-600 hover:text-purple-700"
            >
              Xem tất cả
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {/* Mock image/video thumbnails */}
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
              >
                {item % 3 === 0 ? (
                  <Video className="h-6 w-6 text-purple-600" />
                ) : (
                  <ImageIcon className="h-6 w-6 text-purple-600" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Files Section */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-600" />
              <h5 className="font-medium text-gray-900">File</h5>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-purple-600 hover:text-purple-700"
            >
              Xem tất cả
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <div className="space-y-2">
            {/* Mock file items */}
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
              >
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    document_{item}.pdf
                  </p>
                  <p className="text-xs text-gray-500">2.5 MB</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationSidebar;
