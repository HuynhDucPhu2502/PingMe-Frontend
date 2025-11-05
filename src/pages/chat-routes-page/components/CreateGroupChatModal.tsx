import { useState, useCallback, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, X, Users, UserX } from "lucide-react";
import { getAcceptedFriendshipHistoryListApi } from "@/services/friendship";
import { createGroupRoomApi } from "@/services/chat";
import type { UserSummaryResponse } from "@/types/common/userSummary";
import type { RoomResponse } from "@/types/chat/room";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/errorMessageHandler";
import { EmptyState } from "@/components/custom/EmptyState";
import LoadingSpinner from "@/components/custom/LoadingSpinner";

interface CreateGroupChatModalProps {
  onGroupCreated?: (room: RoomResponse) => void;
}

export function CreateGroupChatModal({
  onGroupCreated,
}: CreateGroupChatModalProps) {
  const [open, setOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [friends, setFriends] = useState<UserSummaryResponse[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<UserSummaryResponse[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchFriends = useCallback(
    async (beforeId?: number) => {
      if (isLoading || !hasMore) return;

      setIsLoading(true);
      try {
        const response = await getAcceptedFriendshipHistoryListApi(
          beforeId,
          20
        );
        const newFriends = response.data.data.userSummaryResponses;

        setFriends((prev) =>
          beforeId ? [...prev, ...newFriends] : newFriends
        );
        setHasMore(newFriends.length === 20);
      } catch (error) {
        toast.error(getErrorMessage(error, "Không thể tải danh sách bạn bè"));
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, hasMore]
  );

  useEffect(() => {
    if (open) {
      setFriends([]);
      setHasMore(true);
      fetchFriends();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current || isLoading || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    if (scrollHeight - scrollTop <= clientHeight + 100) {
      const lastFriend = friends[friends.length - 1];
      if (lastFriend) {
        fetchFriends(lastFriend.id);
      }
    }
  }, [friends, isLoading, hasMore, fetchFriends]);

  const handleAddMember = (friend: UserSummaryResponse) => {
    if (!selectedMembers.find((m) => m.id === friend.id)) {
      setSelectedMembers([...selectedMembers, friend]);
    }
  };

  const handleRemoveMember = (memberId: number) => {
    setSelectedMembers(selectedMembers.filter((m) => m.id !== memberId));
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      toast.error("Vui lòng nhập tên nhóm");
      return;
    }

    if (selectedMembers.length < 2) {
      toast.error("Nhóm chat cần ít nhất 2 thành viên");
      return;
    }

    setIsCreating(true);
    try {
      const response = await createGroupRoomApi({
        name: groupName,
        memberIds: selectedMembers.map((m) => m.id),
      });

      toast.success("Tạo nhóm chat thành công");
      onGroupCreated?.(response.data.data);
      setOpen(false);
      setGroupName("");
      setSelectedMembers([]);
    } catch (error) {
      toast.error(getErrorMessage(error, "Không thể tạo nhóm chat"));
    } finally {
      setIsCreating(false);
    }
  };

  const filteredFriends = friends.filter(
    (friend) =>
      friend.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !selectedMembers.find((m) => m.id === friend.id)
  );

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setGroupName("");
      setSearchQuery("");
      setSelectedMembers([]);
      setFriends([]);
      setHasMore(true);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 text-gray-500 hover:text-purple-600 hover:bg-purple-50"
        onClick={() => setOpen(true)}
      >
        <Users className="w-4 h-4" />
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="!h-11/12 !w-full !max-w-none lg:!w-2/3">
          <DialogHeader>
            <DialogTitle>Tạo nhóm chat</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="group-name">
                Tên nhóm <span className="text-red-500">*</span>
              </Label>
              <Input
                id="group-name"
                placeholder="Nhập tên nhóm..."
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full focus-visible:ring-purple-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 h-[400px]">
              <div className="border border-purple-200 rounded-lg flex flex-col">
                <div className="p-3 border-b border-purple-100 bg-purple-50/30">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                    <Input
                      placeholder="Tìm kiếm bạn bè..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 focus-visible:ring-purple-500"
                    />
                  </div>
                </div>

                <div
                  ref={scrollRef}
                  onScroll={handleScroll}
                  className="flex-1 overflow-y-auto p-2 space-y-1"
                >
                  {filteredFriends.map((friend) => (
                    <button
                      key={friend.id}
                      onClick={() => handleAddMember(friend)}
                      className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-purple-50 transition-colors"
                    >
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={friend.avatarUrl || undefined} />
                        <AvatarFallback>
                          {friend.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="flex-1 text-left text-sm font-medium">
                        {friend.name}
                      </span>
                    </button>
                  ))}

                  {isLoading && (
                    <div className="flex justify-center py-4">
                      <LoadingSpinner className="w-6 h-6 text-purple-600" />
                    </div>
                  )}

                  {!isLoading && filteredFriends.length === 0 && (
                    <EmptyState
                      icon={UserX}
                      title="Không tìm thấy bạn bè"
                      description={
                        searchQuery
                          ? "Thử tìm kiếm với từ khóa khác"
                          : "Bạn chưa có bạn bè nào"
                      }
                    />
                  )}
                </div>
              </div>

              <div className="border border-purple-200 rounded-lg flex flex-col">
                <div className="p-3 border-b border-purple-100 bg-purple-50/30">
                  <h3 className="text-sm font-medium text-purple-900">
                    Thành viên đã chọn ({selectedMembers.length})
                  </h3>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                  {selectedMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 p-2 rounded-lg bg-purple-50 border border-purple-100"
                    >
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={member.avatarUrl || undefined} />
                        <AvatarFallback>
                          {member.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="flex-1 text-sm font-medium">
                        {member.name}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                        onClick={() => handleRemoveMember(member.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}

                  {selectedMembers.length === 0 && (
                    <EmptyState
                      icon={Users}
                      title="Chưa có thành viên"
                      description="Chọn bạn bè từ danh sách bên trái để thêm vào nhóm"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button
              onClick={handleCreateGroup}
              disabled={
                isCreating || !groupName.trim() || selectedMembers.length < 2
              }
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isCreating ? "Đang tạo..." : "Tạo nhóm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
