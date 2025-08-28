import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { UserSummaryResponse } from "@/types/userSummary";
import { MoreHorizontal, UserCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ContactItemProps {
  contact: UserSummaryResponse;
  activeCategory: string;
  handleAcceptRequest: (id: number) => void;
  handleRejectRequest: (id: number) => void;
  handleCancelRequest: (id: number) => void;
  handleRemoveFriend: (id: number) => void;
}

const ContactItem = ({
  contact,
  activeCategory,
  handleAcceptRequest,
  handleRejectRequest,
  handleCancelRequest,
  handleRemoveFriend,
}: ContactItemProps) => {
  const itemKey = contact.friendshipSummary.id.toString();

  return (
    <div
      key={itemKey}
      className="flex items-center space-x-3 p-4 rounded-lg cursor-pointer hover:bg-gray-50 group transition-colors border border-gray-100"
    >
      <div className="relative">
        <Avatar className="w-12 h-12">
          <AvatarImage src={contact.avatarUrl || "/placeholder.svg"} />
          <AvatarFallback className="bg-purple-100 text-purple-600 text-sm font-medium">
            {contact.name?.charAt(0)?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        {/* Status indicator based on friendship status */}
        <div
          className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${
            contact.friendshipSummary.friendshipStatus === "ACCEPTED"
              ? "bg-green-500"
              : "bg-yellow-500"
          }`}
        ></div>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {contact.name}
        </p>
        <p className="text-xs text-gray-500 truncate">{contact.email}</p>
        <p className="text-xs text-gray-400 mt-1">
          Trạng thái:{" "}
          {contact.friendshipSummary.friendshipStatus === "ACCEPTED"
            ? "Bạn bè"
            : "Đang chờ"}
        </p>
      </div>

      <div className="flex items-center space-x-2">
        {activeCategory === "received-requests" &&
          contact.friendshipSummary.friendshipStatus === "PENDING" && (
            <>
              <Button
                size="sm"
                className="bg-purple-600 hover:bg-purple-700 text-white"
                onClick={() =>
                  handleAcceptRequest(contact.friendshipSummary.id)
                }
              >
                <UserCheck className="w-4 h-4 mr-1" />
                Chấp nhận
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-gray-600 hover:text-red-600 hover:border-red-300 bg-transparent"
                onClick={() =>
                  handleRejectRequest(contact.friendshipSummary.id)
                }
              >
                <X className="w-4 h-4 mr-1" />
                Từ chối
              </Button>
            </>
          )}

        {activeCategory === "sent-requests" &&
          contact.friendshipSummary.friendshipStatus === "PENDING" && (
            <Button
              variant="outline"
              size="sm"
              className="text-gray-600 hover:text-red-600 hover:border-red-300 bg-transparent"
              onClick={() => handleCancelRequest(contact.friendshipSummary.id)}
            >
              <X className="w-4 h-4 mr-1" />
              Hủy lời mời
            </Button>
          )}

        {activeCategory === "friends" &&
          contact.friendshipSummary.friendshipStatus === "ACCEPTED" && (
            <Button
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100"
              onClick={() => handleRemoveFriend(contact.friendshipSummary.id)}
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          )}
      </div>
    </div>
  );
};

export default ContactItem;
