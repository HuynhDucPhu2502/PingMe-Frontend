import {
  useState,
  useEffect,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Inbox, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EmptyState } from "@/components/custom/EmptyState";
import LoadingSpinner from "@/components/custom/LoadingSpinner";
import {
  acceptInvitationApi,
  getReceivedHistoryInvitationsApi,
  rejectInvitationApi,
} from "@/services/friendshipApi";
import type { UserSummaryResponse } from "@/types/userSummary";
import type { HistoryFriendshipResponse } from "@/types/friendship";
import { getUserInitials } from "@/utils/authFieldHandler";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/errorMessageHandler";

interface ReceivedInvitationsComponentRef {
  handleNewInvitation: (user: UserSummaryResponse) => void;
  removeInvitation: (user: UserSummaryResponse) => void;
}

export const ReceivedInvitationsComponent =
  forwardRef<ReceivedInvitationsComponentRef>((_, ref) => {
    // State quản lý danh sách lời mời nhận được và infinite scroll
    const [receivedInvitations, setReceivedInvitations] = useState<
      UserSummaryResponse[]
    >([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMoreInvitations, setHasMoreInvitations] = useState(true);
    const [processingInvitations, setProcessingInvitations] = useState<
      Set<number>
    >(new Set());

    // Refs cho infinite scroll
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const isLoadingRef = useRef(false);

    // Fetch danh sách lời mời nhận được với pagination
    const fetchReceivedInvitations = useCallback(
      async (beforeId?: number, isLoadMore = false) => {
        if (isLoadingRef.current) return;

        isLoadingRef.current = true;
        if (!isLoadMore) setIsLoading(true);

        try {
          const response = (
            await getReceivedHistoryInvitationsApi(beforeId, 20)
          ).data.data as HistoryFriendshipResponse;

          if (isLoadMore) {
            // Append thêm lời mời vào cuối danh sách
            setReceivedInvitations((prev) => {
              const newInvitations = response.userSummaryResponses.filter(
                (newInvitation) =>
                  !prev.some((existing) => existing.id === newInvitation.id)
              );
              const currentTotal = prev.length + newInvitations.length;
              setHasMoreInvitations(currentTotal < response.total);
              return [...prev, ...newInvitations];
            });
          } else {
            // Load lại từ đầu
            setReceivedInvitations(response.userSummaryResponses);
            setHasMoreInvitations(
              response.userSummaryResponses.length < response.total
            );
          }
        } catch (error) {
          toast.error(getErrorMessage(error));
        } finally {
          setIsLoading(false);
          isLoadingRef.current = false;
        }
      },
      []
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
          receivedInvitations.length > 0
            ? receivedInvitations[receivedInvitations.length - 1].id
            : undefined;
        fetchReceivedInvitations(beforeId, true);
      }
    }, [receivedInvitations, hasMoreInvitations, fetchReceivedInvitations]);

    const handleAcceptInvitation = useCallback(
      async (friendshipId: number) => {
        if (processingInvitations.has(friendshipId)) return;

        try {
          setProcessingInvitations((prev) => new Set(prev).add(friendshipId));

          await acceptInvitationApi(friendshipId);

          // Xóa lời mời khỏi danh sách local
          setReceivedInvitations((prev) =>
            prev.filter(
              (invitation) => invitation.friendshipSummary.id !== friendshipId
            )
          );
        } catch (error) {
          toast.error(getErrorMessage(error, "Không thể chấp nhận kết bạn"));
        } finally {
          setProcessingInvitations((prev) => {
            const newSet = new Set(prev);
            newSet.delete(friendshipId);
            return newSet;
          });
        }
      },
      [processingInvitations]
    );

    const handleRejectInvitation = useCallback(
      async (friendshipId: number) => {
        if (processingInvitations.has(friendshipId)) return;

        try {
          setProcessingInvitations((prev) => new Set(prev).add(friendshipId));

          await rejectInvitationApi(friendshipId);

          // Xóa lời mời khỏi danh sách local
          setReceivedInvitations((prev) =>
            prev.filter(
              (invitation) => invitation.friendshipSummary.id !== friendshipId
            )
          );
        } catch (error) {
          toast.error(getErrorMessage(error, "Không thể từ chối lời mời"));
        } finally {
          setProcessingInvitations((prev) => {
            const newSet = new Set(prev);
            newSet.delete(friendshipId);
            return newSet;
          });
        }
      },
      [processingInvitations]
    );

    // Expose methods cho parent component qua ref
    useImperativeHandle(
      ref,
      () => ({
        handleNewInvitation: (user: UserSummaryResponse) => {
          // Kiểm tra lời mời đã tồn tại chưa để tránh duplicate
          setReceivedInvitations((prev) => {
            const invitationExists = prev.some(
              (invitation) => invitation.id === user.id
            );
            if (invitationExists) return prev;

            // Thêm lời mời mới vào đầu danh sách
            return [user, ...prev];
          });
        },
        removeInvitation: (user: UserSummaryResponse) => {
          setReceivedInvitations((prev) =>
            prev.filter((invitation) => invitation.id !== user.id)
          );
        },
      }),
      []
    );

    useEffect(() => {
      setReceivedInvitations([]);
      setHasMoreInvitations(true);
      fetchReceivedInvitations();
    }, [fetchReceivedInvitations]);

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
                Lời mời nhận được
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {receivedInvitations.length} lời mời
              </p>
            </div>
          </div>
        </div>

        {/* Danh sách lời mời nhận được */}
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
          {isLoading && receivedInvitations.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex items-center space-x-3 text-purple-600">
                <LoadingSpinner className="w-8 h-8" />
                <span className="text-lg font-medium">
                  Đang tải danh sách lời mời...
                </span>
              </div>
            </div>
          ) : receivedInvitations.length === 0 ? (
            <div className="h-64">
              <EmptyState
                icon={Inbox}
                title="Chưa có lời mời nào"
                description="Chưa có ai gửi lời mời kết bạn cho bạn."
              />
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {receivedInvitations.map((invitation) => {
                const friendshipId = invitation.friendshipSummary.id;
                const isProcessing = processingInvitations.has(friendshipId);

                return (
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

                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleAcceptInvitation(friendshipId)}
                        disabled={isProcessing}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        {isProcessing ? (
                          <LoadingSpinner className="w-4 h-4 mr-2" />
                        ) : (
                          <Check className="w-4 h-4 mr-2" />
                        )}
                        Chấp nhận
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRejectInvitation(friendshipId)}
                        disabled={isProcessing}
                        className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Từ chối
                      </Button>
                    </div>
                  </div>
                );
              })}

              {/* Loading indicator khi load thêm */}
              {isLoadingRef.current && hasMoreInvitations && (
                <div className="flex justify-center py-4">
                  <div className="flex items-center space-x-2 text-purple-600">
                    <LoadingSpinner className="w-5 h-5" />
                    <span>Đang tải thêm...</span>
                  </div>
                </div>
              )}

              {/* Thông báo hết dữ liệu */}
              {!hasMoreInvitations && receivedInvitations.length > 0 && (
                <div className="text-center py-4 text-gray-500">
                  <p>Đã hiển thị tất cả lời mời</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  });

ReceivedInvitationsComponent.displayName = "ReceivedInvitationsComponent";
