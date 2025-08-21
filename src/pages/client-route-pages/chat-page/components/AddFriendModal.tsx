import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search, UserPlus, UserCheck, Clock, Users } from "lucide-react";
import { toast } from "sonner";
import { lookupApi } from "@/services/userLookupApi";
import type { UserSummaryResponse } from "@/types/userSummary";
import { getErrorMessage } from "@/utils/errorMessageHandler";
import LoadingSpinner from "@/components/custom/LoadingSpinner";
import type { FriendInvitationRequest } from "@/types/friendship";
import { sendInvitationApi } from "@/services/friendshipApi";

interface AddFriendModalProps {
  onFriendAdded?: () => void;
}

export function AddFriendModal({ onFriendAdded }: AddFriendModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [emailSearch, setEmailSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [userData, setUserData] = useState<UserSummaryResponse | null>(null);

  const handleLookup = async () => {
    if (!emailSearch.trim()) {
      toast.error("Vui lòng nhập email để tìm kiếm");
      return;
    }

    try {
      setIsLoading(true);
      setUserData(null);

      const response = await lookupApi(emailSearch.trim());
      setUserData(response.data.data);

      if (!response.data.data) {
        toast.error("Không tìm thấy người dùng với email này");
      }
    } catch (err) {
      toast.error(getErrorMessage(err, "Không thể tìm kiếm người dùng"));
      setUserData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendFriendRequest = async (data: FriendInvitationRequest) => {
    if (!userData?.email) return;
    try {
      setIsSending(true);
      await sendInvitationApi(data);
      toast.success("Đã gửi lời mời kết bạn thành công!");

      setEmailSearch("");
      setUserData(null);
      setIsOpen(false);

      onFriendAdded?.();
    } catch (err) {
      toast.error(getErrorMessage(err, "Không thể gửi lời mời kết bạn"));
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleLookup();
    }
  };

  const getFriendshipStatus = () => {
    if (!userData?.friendshipSummary) {
      return {
        status: "none",
        text: "Chưa kết bạn",
        color: "text-gray-500",
        bgColor: "bg-gray-100",
        icon: UserPlus,
        canSendRequest: true,
      };
    }

    const { friendshipStatus } = userData.friendshipSummary;

    switch (friendshipStatus) {
      case "ACCEPTED":
        return {
          status: "accepted",
          text: "Đã là bạn bè",
          color: "text-green-600",
          bgColor: "bg-green-100",
          icon: UserCheck,
          canSendRequest: false,
        };
      case "PENDING":
        return {
          status: "pending",
          text: "Đang chờ phản hồi",
          color: "text-yellow-600",
          bgColor: "bg-yellow-100",
          icon: Clock,
          canSendRequest: false,
        };
      default:
        return {
          status: "none",
          text: "Chưa kết bạn",
          color: "text-gray-500",
          bgColor: "bg-gray-100",
          icon: UserPlus,
          canSendRequest: true,
        };
    }
  };

  const friendshipStatus = userData ? getFriendshipStatus() : null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-gray-500 hover:text-purple-600 hover:bg-purple-50"
        >
          <UserPlus className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-purple-600" />
            <span>Thêm bạn bè</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Input */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email người dùng
            </label>
            <div className="flex space-x-2">
              <Input
                id="email"
                type="email"
                placeholder="Nhập email để tìm kiếm..."
                value={emailSearch}
                onChange={(e) => setEmailSearch(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
                disabled={isLoading}
              />
              <Button
                onClick={handleLookup}
                disabled={isLoading || !emailSearch.trim()}
                size="sm"
              >
                {isLoading ? (
                  <LoadingSpinner className="w-4 h-4" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* User Result */}
          {userData && (
            <div className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center space-x-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={userData.avatarUrl || "/placeholder.svg"} />
                  <AvatarFallback className="bg-purple-100 text-purple-600 text-sm font-medium">
                    {userData.name?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {userData.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {userData.email}
                  </p>
                </div>
              </div>

              {/* Friendship Status */}
              {friendshipStatus && (
                <div className="flex items-center justify-between">
                  <div
                    className={`flex items-center space-x-2 px-3 py-1 rounded-full ${friendshipStatus.bgColor}`}
                  >
                    <friendshipStatus.icon
                      className={`w-4 h-4 ${friendshipStatus.color}`}
                    />
                    <span
                      className={`text-sm font-medium ${friendshipStatus.color}`}
                    >
                      {friendshipStatus.text}
                    </span>
                  </div>

                  {friendshipStatus.canSendRequest && (
                    <Button
                      onClick={() =>
                        handleSendFriendRequest({ targetUserId: userData.id })
                      }
                      disabled={isSending}
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      {isSending ? (
                        <>
                          <LoadingSpinner className="w-4 h-4 mr-2" />
                          Đang gửi...
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4 mr-2" />
                          Gửi lời mời
                        </>
                      )}
                    </Button>
                  )}
                </div>
              )}

              {/* Additional Info for Pending Status */}
              {friendshipStatus?.status === "pending" && (
                <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                  Lời mời kết bạn đã được gửi. Vui lòng chờ phản hồi từ người
                  dùng.
                </div>
              )}

              {/* Additional Info for Accepted Status */}
              {friendshipStatus?.status === "accepted" && (
                <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                  Bạn và {userData.name} đã là bạn bè. Có thể bắt đầu trò
                  chuyện!
                </div>
              )}
            </div>
          )}

          {/* No Results Message */}
          {isLoading === false && emailSearch && !userData && (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">Không tìm thấy người dùng với email này</p>
              <p className="text-xs mt-1">
                Vui lòng kiểm tra lại email và thử lại
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
