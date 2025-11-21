import { useAppSelector } from "@/features/hooks.ts";
import type { RoomResponse } from "@/types/chat/room";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  X,
  Users,
  FileImage,
  Palette,
  UserCog,
  User,
  Phone,
  Video,
  Pencil,
  Check,
} from "lucide-react";
import { useState } from "react";
import MemberList from "./member-list";
import { renameGroup } from "@/services/chat";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

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
  const [currentView, setCurrentView] = useState<"main" | "members">("main");
  const [isEditingName, setIsEditingName] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");

  const getOtherParticipant = () => {
    if (selectedChat.roomType === "DIRECT" && userSession) {
      return selectedChat.participants.find((p) => p.name !== userSession.name);
    }
    return null;
  };

  const otherParticipant = getOtherParticipant();

  const handleRenameGroup = async () => {
    if (!newGroupName.trim()) {
      toast.error("Tên nhóm không được để trống");
      return;
    }

    try {
      await renameGroup(selectedChat.roomId, newGroupName.trim());
      toast.success("Đổi tên nhóm thành công");
      setIsEditingName(false);
    } catch (error) {
      toast.error("Đổi tên nhóm thất bại");
      console.error("Error renaming group:", error);
    }
  };

  const startEditingName = () => {
    setNewGroupName(selectedChat.name || "");
    setIsEditingName(true);
  };

  const cancelEditingName = () => {
    setIsEditingName(false);
    setNewGroupName("");
  };

  if (!isOpen) return null;

  if (currentView === "members") {
    return (
      <div className="w-80 border-l bg-white flex flex-col h-full">
        <MemberList
          participants={selectedChat.participants}
          roomType={selectedChat.roomType}
          roomId={selectedChat.roomId}
          onBack={() => setCurrentView("main")}
        />
      </div>
    );
  }

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

          {selectedChat.roomType === "GROUP" ? (
            isEditingName ? (
              <div className="flex items-center gap-2 w-full max-w-xs">
                <Input
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="h-9 text-center"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleRenameGroup();
                    if (e.key === "Escape") cancelEditingName();
                  }}
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-9 w-9 text-green-600 hover:bg-green-50"
                  onClick={handleRenameGroup}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-9 w-9 text-red-600 hover:bg-red-50"
                  onClick={cancelEditingName}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="relative w-full max-w-xs group">
                <h4 className="font-semibold text-lg text-gray-900 text-center truncate px-10">
                  {selectedChat.name}
                </h4>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={startEditingName}
                >
                  <Pencil className="h-4 w-4 text-purple-600" />
                </Button>
              </div>
            )
          ) : (
            <h4 className="font-semibold text-lg text-gray-900">
              {otherParticipant?.name}
            </h4>
          )}

          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex flex-col items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-full border-purple-200 hover:bg-purple-50 hover:border-purple-300 bg-transparent"
                title="Trang cá nhân"
              >
                <User className="h-5 w-5 text-purple-600" />
              </Button>
              <span className="text-xs text-gray-600">Trang cá nhân</span>
            </div>

            <div className="flex flex-col items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-full border-purple-200 hover:bg-purple-50 hover:border-purple-300 bg-transparent"
                title="Gọi thoại"
              >
                <Phone className="h-5 w-5 text-purple-600" />
              </Button>
              <span className="text-xs text-gray-600">Gọi thoại</span>
            </div>

            <div className="flex flex-col items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-full border-purple-200 hover:bg-purple-50 hover:border-purple-300 bg-transparent"
                title="Gọi video"
              >
                <Video className="h-5 w-5 text-purple-600" />
              </Button>
              <span className="text-xs text-gray-600">Gọi video</span>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start gap-3 h-14 border-purple-200 hover:bg-purple-50 hover:border-purple-300 bg-transparent"
            onClick={() => setCurrentView("members")}
          >
            <Users className="h-5 w-5 text-purple-600" />
            <span className="font-medium text-gray-900">
              Thành viên phòng chat
            </span>
          </Button>

          {/* Media & Files Button */}
          <Button
            variant="outline"
            className="w-full justify-start gap-3 h-14 border-purple-200 hover:bg-purple-50 hover:border-purple-300 bg-transparent"
          >
            <FileImage className="h-5 w-5 text-purple-600" />
            <span className="font-medium text-gray-900">
              File phương tiện & File
            </span>
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start gap-3 h-14 border-purple-200 hover:bg-purple-50 hover:border-purple-300 bg-transparent"
          >
            <Palette className="h-5 w-5 text-purple-600" />
            <span className="font-medium text-gray-900">Chủ đề</span>
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start gap-3 h-14 border-purple-200 hover:bg-purple-50 hover:border-purple-300 bg-transparent"
          >
            <UserCog className="h-5 w-5 text-purple-600" />
            <span className="font-medium text-gray-900">Biệt danh</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConversationSidebar;
