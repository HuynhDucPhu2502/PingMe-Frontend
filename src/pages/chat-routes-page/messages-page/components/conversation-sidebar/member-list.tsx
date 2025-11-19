import type { RoomParticipantResponse } from "@/types/chat/room";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { ArrowLeft, UserPlus, Search } from "lucide-react";
import { useState } from "react";
import { GroupMemberModal } from "@/pages/chat-routes-page/components/GroupMemberModal.tsx";

interface MemberListProps {
  participants: RoomParticipantResponse[];
  roomType: "DIRECT" | "GROUP";
  roomId: number;
  onBack: () => void;
  onMembersAdded?: () => void;
}

const MemberList = ({
  participants,
  roomType,
  roomId,
  onBack,
  onMembersAdded,
}: MemberListProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Sort participants: OWNER first, then ADMIN, then MEMBER
  const sortedParticipants = [...participants].sort((a, b) => {
    const roleOrder = { OWNER: 0, ADMIN: 1, MEMBER: 2 };
    return roleOrder[a.role] - roleOrder[b.role];
  });

  // Filter participants based on search query
  const filteredParticipants = sortedParticipants.filter((participant) =>
    participant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleDescription = (role: "OWNER" | "ADMIN" | "MEMBER") => {
    if (role === "OWNER") return "Trưởng nhóm";
    if (role === "ADMIN") return "Phó nhóm";
    return null;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h3 className="font-semibold text-gray-900">Thành viên</h3>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {roomType === "GROUP" && (
            <GroupMemberModal
              mode="add"
              currentMembers={participants}
              roomId={roomId}
              onMembersAdded={onMembersAdded}
              triggerButton={
                <Button className="w-full justify-start gap-2 bg-purple-600 hover:bg-purple-700 text-white">
                  <UserPlus className="h-4 w-4" />
                  Thêm thành viên
                </Button>
              }
            />
          )}

          {/* Title with member count */}
          <div>
            <h4 className="font-medium text-sm text-gray-900">
              Danh sách thành viên ({participants.length})
            </h4>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Tìm kiếm thành viên..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Members list */}
          <div className="space-y-1">
            {filteredParticipants.map((participant) => {
              const roleDescription = getRoleDescription(participant.role);

              return (
                <div
                  key={participant.userId}
                  className="flex items-center gap-3 p-3 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
                >
                  <Avatar className="w-12 h-12">
                    <AvatarImage
                      src={participant.avatarUrl || "/placeholder.svg"}
                      alt={participant.name}
                    />
                    <AvatarFallback className="bg-purple-100 text-purple-700 font-semibold">
                      {participant.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900 truncate">
                      {participant.name}
                    </p>
                    {roleDescription && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        {roleDescription}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberList;
