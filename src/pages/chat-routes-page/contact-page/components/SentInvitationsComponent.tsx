import {
  useState,
  useEffect,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Send, X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { EmptyState } from "@/components/custom/EmptyState.tsx";
import LoadingSpinner from "@/components/custom/LoadingSpinner.tsx";
import {
  cancelInvitationApi,
  getSentHistoryInvitationsApi,
} from "@/services/friendshipApi";
import type { UserSummaryResponse } from "@/types/userSummary.d.ts";
import type { HistoryFriendshipResponse } from "@/types/friendship";
import { getUserInitials } from "@/utils/authFieldHandler";

interface SentInvitationsComponentRef {
  handleInvitationUpdate: (user: UserSummaryResponse) => void;
}

export const SentInvitationsComponent = forwardRef<SentInvitationsComponentRef>(
  (_, ref) => {
    // State quản lý danh sách lời mời đã gửi và infinite scroll
    const [sentInvitations, setSentInvitations] = useState<
      UserSummaryResponse[]
    >([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMoreInvitations, setHasMoreInvitations] = useState(true);

    // Refs cho infinite scroll
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const isLoadingRef = useRef(false);

    // Fetch danh sách lời mời đã gửi với pagination
    const fetchSentInvitations = useCallback(
      async (beforeId?: number, isLoadMore = false) => {
        if (isLoadingRef.current) return;

        isLoadingRef.current = true;
        if (!isLoadMore) setIsLoading(true);

        try {
          console.log(
            "[SentInvitationsComponent] Fetching sent invitations, beforeId:",
            beforeId
          );

          const response = (await getSentHistoryInvitationsApi(beforeId, 20))
            .data.data as HistoryFriendshipResponse;

          console.log(
            "[SentInvitationsComponent] Fetched sent invitations:",
            response
          );

          if (isLoadMore) {
            // Append thêm lời mời vào cuối danh sách
            setSentInvitations((prev) => {
              const newInvitations = response.userSummaryResponses.filter(
                (newInvitation) =>
                  !prev.some((existing) => existing.id === newInvitation.id)
              );
              return [...prev, ...newInvitations];
            });
          } else {
            // Load lại từ đầu
            setSentInvitations(response.userSummaryResponses);
          }

          // Kiểm tra còn lời mời để load không
          const currentTotal = isLoadMore
            ? sentInvitations.length + response.userSummaryResponses.length
            : response.userSummaryResponses.length;
          setHasMoreInvitations(currentTotal < response.total);
        } catch (error) {
          console.error(
            "[SentInvitationsComponent] Error fetching sent invitations:",
            error
          );
        } finally {
          setIsLoading(false);
          isLoadingRef.current = false;
        }
      },
      [sentInvitations.length]
    );

    // Xử lý infinite scroll
    const handleScroll = useCallback(() => {
      const container = scrollContainerRef.current;
      if (!container || isLoadingRef.current || !hasMoreInvitations) return;

      const { scrollTop, scrollHeight, clientHeight } = container;
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

      // Load thêm khi scroll đến 80% cuối trang
      if (scrollPercentage > 0.8) {
        const beforeId =
          sentInvitations.length > 0
            ? sentInvitations[sentInvitations.length - 1].id
            : undefined;
        console.log(
          "[SentInvitationsComponent] Loading more sent invitations, beforeId:",
          beforeId
        );
        fetchSentInvitations(beforeId, true);
      }
    }, [sentInvitations, hasMoreInvitations, fetchSentInvitations]);

    // Xử lý hủy lời mời kết bạn
    const handleCancelInvitation = useCallback(async (friendshipId: number) => {
      try {
        console.log(
          "[SentInvitationsComponent] Canceling invitation for friendship:",
          friendshipId
        );
        await cancelInvitationApi(friendshipId);

        // Xóa lời mời khỏi danh sách local
        setSentInvitations((prev) =>
          prev.filter(
            (invitation) => invitation.friendshipSummary.id !== friendshipId
          )
        );
        console.log(
          "[SentInvitationsComponent] Invitation canceled successfully"
        );
      } catch (error) {
        console.error(
          "[SentInvitationsComponent] Error canceling invitation:",
          error
        );
      }
    }, []);

    // Expose methods cho parent component qua ref
    useImperativeHandle(
      ref,
      () => ({
        handleInvitationUpdate: (user: UserSummaryResponse) => {
          setSentInvitations((prev) => {
            return prev.filter((invitation) => invitation.id !== user.id);
          });
        },
      }),
      []
    );

    useEffect(() => {
      setSentInvitations([]);
      setHasMoreInvitations(true);
      fetchSentInvitations();
    }, []);

    // Attach scroll event listener
    useEffect(() => {
      const container = scrollContainerRef.current;
      if (!container) return;

      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    return (
      <div className="flex flex-col h-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Lời mời đã gửi
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {sentInvitations.length} lời mời
              </p>
            </div>
          </div>
        </div>

        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
          {isLoading && sentInvitations.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex items-center space-x-3 text-purple-600">
                <LoadingSpinner className="w-8 h-8" />
                <span className="text-lg font-medium">
                  Đang tải danh sách lời mời...
                </span>
              </div>
            </div>
          ) : sentInvitations.length === 0 ? (
            <div className="h-64">
              <EmptyState
                icon={Send}
                title="Chưa gửi lời mời nào"
                description="Hãy gửi lời mời kết bạn để bắt đầu kết nối!"
              />
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {sentInvitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage
                        src={invitation.avatarUrl || "/placeholder.svg"}
                        alt={invitation.name}
                      />
                      <AvatarFallback className="bg-purple-100 text-purple-600">
                        {getUserInitials(invitation.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {invitation.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {invitation.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Badge
                      variant="outline"
                      className="text-orange-600 border-orange-200 bg-orange-50"
                    >
                      <Clock className="w-3 h-3 mr-1" />
                      Đang chờ
                    </Badge>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleCancelInvitation(invitation.friendshipSummary.id)
                      }
                      className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Hủy
                    </Button>
                  </div>
                </div>
              ))}

              {isLoadingRef.current && hasMoreInvitations && (
                <div className="flex justify-center py-4">
                  <div className="flex items-center space-x-2 text-purple-600">
                    <LoadingSpinner className="w-5 h-5" />
                    <span>Đang tải thêm...</span>
                  </div>
                </div>
              )}

              {!hasMoreInvitations && sentInvitations.length > 0 && (
                <div className="text-center py-4 text-gray-500">
                  <p>Đã hiển thị tất cả lời mời</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
);

SentInvitationsComponent.displayName = "SentInvitationsComponent";
