import {
  useState,
  useEffect,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Users, UserMinus } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";
import { EmptyState } from "@/components/custom/EmptyState.tsx";
import LoadingSpinner from "@/components/custom/LoadingSpinner.tsx";
import {
  getAcceptedFriendshipHistoryListApi,
  deleteFriendshipApi,
} from "@/services/friendshipApi.ts";
import type { UserSummaryResponse } from "@/types/userSummary.d.ts";
import type { HistoryFriendshipResponse } from "@/types/friendship";
import { getUserInitials } from "@/utils/authFieldHandler";

interface FriendListComponentRef {
  handleNewFriend: (user: UserSummaryResponse) => void;
  removeFriend: (user: UserSummaryResponse) => void;
}

export const FriendsListComponent = forwardRef<FriendListComponentRef>(
  (_, ref) => {
    // State quản lý danh sách bạn bè và infinite scroll
    const [friends, setFriends] = useState<UserSummaryResponse[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMoreFriends, setHasMoreFriends] = useState(true);

    // Refs cho infinite scroll
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const isLoadingRef = useRef(false);

    // Fetch danh sách bạn bè với pagination
    const fetchFriends = useCallback(
      async (beforeId?: number, isLoadMore = false) => {
        if (isLoadingRef.current) return;

        isLoadingRef.current = true;
        if (!isLoadMore) setIsLoading(true);

        try {
          console.log(
            "[FriendsListComponent] Fetching friends, beforeId:",
            beforeId
          );

          const response: HistoryFriendshipResponse = (
            await getAcceptedFriendshipHistoryListApi(beforeId, 20)
          ).data.data;
          const friendsList = response.userSummaryResponses;
          const total = response.total;

          console.log("[FriendsListComponent] Fetched friends:", friendsList);

          if (isLoadMore) {
            // Append thêm bạn bè vào cuối danh sách
            setFriends((prev) => {
              const newFriends = friendsList.filter(
                (newFriend) =>
                  !prev.some(
                    (existingFriend) => existingFriend.id === newFriend.id
                  )
              );
              const updatedList = [...prev, ...newFriends];
              setHasMoreFriends(updatedList.length < total);
              return updatedList;
            });
          } else {
            // Load lại từ đầu
            setFriends(friendsList);
            setHasMoreFriends(friendsList.length < total);
          }
        } catch (error) {
          console.error(
            "[FriendsListComponent] Error fetching friends:",
            error
          );
        } finally {
          setIsLoading(false);
          isLoadingRef.current = false;
        }
      },
      [] // Removed friends.length dependency to prevent infinite loop
    );

    // Xử lý infinite scroll
    const handleScroll = useCallback(() => {
      const container = scrollContainerRef.current;
      if (!container || isLoadingRef.current || !hasMoreFriends) return;

      const { scrollTop, scrollHeight, clientHeight } = container;
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

      // Load thêm khi scroll đến 80% cuối trang
      if (scrollPercentage > 0.8) {
        const beforeId =
          friends.length > 0 ? friends[friends.length - 1].id : undefined;
        console.log(
          "[FriendsListComponent] Loading more friends, beforeId:",
          beforeId
        );
        fetchFriends(beforeId, true);
      }
    }, [friends, hasMoreFriends, fetchFriends]);

    // Xử lý xóa bạn bè
    const handleRemoveFriend = useCallback(async (friendshipId: number) => {
      try {
        console.log(
          "[FriendsListComponent] Removing friendship:",
          friendshipId
        );
        await deleteFriendshipApi(friendshipId);

        // Xóa bạn bè khỏi danh sách local
        setFriends((prev) =>
          prev.filter((friend) => friend.friendshipSummary.id !== friendshipId)
        );
        console.log("[FriendsListComponent] Friend removed successfully");
      } catch (error) {
        console.error("[FriendsListComponent] Error removing friend:", error);
      }
    }, []);

    // Expose methods cho parent component qua ref
    useImperativeHandle(
      ref,
      () => ({
        handleNewFriend: (user: UserSummaryResponse) => {
          console.log(
            "[FriendsListComponent] Adding new friend via WebSocket:",
            user
          );

          // Kiểm tra bạn bè đã tồn tại chưa để tránh duplicate
          setFriends((prev) => {
            const friendExists = prev.some((friend) => friend.id === user.id);
            if (friendExists) {
              console.log(
                "[FriendsListComponent] Friend already exists, skipping:",
                user.id
              );
              return prev;
            }
            // Thêm bạn bè mới vào đầu danh sách
            return [user, ...prev];
          });
        },
        removeFriend: (user: UserSummaryResponse) => {
          console.log(
            "[FriendsListComponent] Removing friend via WebSocket:",
            user.id
          );
          setFriends((prev) => prev.filter((friend) => friend.id !== user.id));
        },
      }),
      []
    );

    // Load danh sách bạn bè khi component mount
    useEffect(() => {
      setFriends([]);
      setHasMoreFriends(true);
      fetchFriends();
    }, [fetchFriends]);

    // Attach scroll event listener
    useEffect(() => {
      const container = scrollContainerRef.current;
      if (!container) return;

      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    return (
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Danh sách bạn bè
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {friends.length} bạn bè
              </p>
            </div>
          </div>
        </div>

        {/* Danh sách bạn bè */}
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
          {isLoading && friends.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex items-center space-x-3 text-purple-600">
                <LoadingSpinner className="w-8 h-8" />
                <span className="text-lg font-medium">
                  Đang tải danh sách bạn bè...
                </span>
              </div>
            </div>
          ) : friends.length === 0 ? (
            <div className="h-64">
              <EmptyState
                icon={Users}
                title="Chưa có bạn bè"
                description="Hãy gửi lời mời kết bạn để bắt đầu kết nối!"
              />
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {friends.map((friend) => (
                <div
                  key={friend.id}
                  className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage
                        src={friend.avatarUrl || "/placeholder.svg"}
                        alt={friend.name}
                      />
                      <AvatarFallback className="bg-purple-100 text-purple-600">
                        {getUserInitials(friend.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {friend.name}
                      </h3>
                      <p className="text-sm text-gray-500">{friend.email}</p>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleRemoveFriend(friend.friendshipSummary.id)
                    }
                    className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                  >
                    <UserMinus className="w-4 h-4 mr-2" />
                    Xóa bạn
                  </Button>
                </div>
              ))}

              {/* Loading indicator khi load thêm */}
              {isLoadingRef.current && hasMoreFriends && (
                <div className="flex justify-center py-4">
                  <div className="flex items-center space-x-2 text-purple-600">
                    <LoadingSpinner className="w-5 h-5" />
                    <span>Đang tải thêm...</span>
                  </div>
                </div>
              )}

              {/* Thông báo hết dữ liệu */}
              {!hasMoreFriends && friends.length > 0 && (
                <div className="text-center py-4 text-gray-500">
                  <p>Đã hiển thị tất cả bạn bè</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
);

FriendsListComponent.displayName = "FriendsListComponent";
