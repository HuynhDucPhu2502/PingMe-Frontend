import { useState, useEffect, useRef, useCallback } from "react";
import { Users, Send, Inbox } from "lucide-react";
import { SharedTopBar } from "../components/SharedTopbar.tsx";
import { FriendsListComponent } from "./components/FriendsListComponent.tsx";
import { SentInvitationsComponent } from "./components/SentInvitationsComponent.tsx";
import { ReceivedInvitationsComponent } from "./components/ReceivedInvitationsComponent.tsx";
import {
  connectFriendshipWS,
  disconnectFriendshipWS,
  type FriendshipEventPayload,
} from "@/services/ws/friendshipSocket.ts";
import type { UserSummaryResponse } from "@/types/userSummary";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/errorMessageHandler.ts";

const tabs = [
  {
    id: "friends",
    title: "Bạn bè",
    icon: Users,
    description: "Danh sách bạn bè đã kết nối",
  },
  {
    id: "received-invitations",
    title: "Lời mời nhận",
    icon: Inbox,
    description: "Lời mời kết bạn từ người khác",
  },
  {
    id: "sent-invitations",
    title: "Lời mời gửi",
    icon: Send,
    description: "Lời mời bạn đã gửi đi",
  },
];

export default function ContactsPage() {
  const [activeTab, setActiveTab] = useState("friends");

  // Ref quản lý hành động ở trang "Danh sách bạn bè"
  const friendsRef = useRef<{
    handleNewFriend: (user: UserSummaryResponse) => void; // thêm bạn mới
    removeFriend: (user: UserSummaryResponse) => void; // xóa bạn
  }>(null);

  // Ref quản lý hành động ở trang "Lời mời kết bạn đã nhận"
  const receivedRef = useRef<{
    handleNewInvitation: (user: UserSummaryResponse) => void; // thêm lời mời mới
    removeInvitation: (user: UserSummaryResponse) => void; // xóa lời mời
  }>(null);

  // Ref quản lý hành động ở trang "Lời mời đã gửi"
  const sentRef = useRef<{
    handleInvitationUpdate: (user: UserSummaryResponse) => void; // cập nhật trạng thái lời mời
  }>(null);

  useEffect(() => {
    const connectWebSocket = () => {
      connectFriendshipWS({
        baseUrl: `${import.meta.env.VITE_BACKEND_BASE_URL}`,
        onEvent: (event: FriendshipEventPayload) => {
          try {
            switch (event.type) {
              case "INVITED":
                if (activeTab === "received-invitations") {
                  receivedRef.current?.handleNewInvitation(
                    event.userSummaryResponse
                  );
                }
                break;

              case "ACCEPTED":
                if (activeTab === "friends") {
                  friendsRef.current?.handleNewFriend(
                    event.userSummaryResponse
                  );
                }
                if (activeTab === "sent-invitations") {
                  sentRef.current?.handleInvitationUpdate(
                    event.userSummaryResponse
                  );
                }
                break;

              case "REJECTED":
                if (activeTab === "sent-invitations") {
                  sentRef.current?.handleInvitationUpdate(
                    event.userSummaryResponse
                  );
                }
                break;

              case "CANCELED":
                if (activeTab === "received-invitations") {
                  receivedRef.current?.removeInvitation(
                    event.userSummaryResponse
                  );
                }
                break;

              case "DELETED":
                if (activeTab === "friends") {
                  friendsRef.current?.removeFriend(event.userSummaryResponse);
                }
                break;
            }
          } catch (error) {
            toast.error(getErrorMessage(error, "Không thể kết nối"));
          }
        },
      });
    };

    connectWebSocket();

    return () => {
      disconnectFriendshipWS();
    };
  }, [activeTab]);

  const handleFriendAdded = useCallback(() => {
    if (activeTab === "sent-invitations") setActiveTab("sent-invitations");
  }, [activeTab]);

  // Hàm render component theo tab đang chọns
  const renderActiveComponent = () => {
    switch (activeTab) {
      case "friends":
        return <FriendsListComponent ref={friendsRef} />;
      case "received-invitations":
        return <ReceivedInvitationsComponent ref={receivedRef} />;
      case "sent-invitations":
        return <SentInvitationsComponent ref={sentRef} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <SharedTopBar onFriendAdded={handleFriendAdded} />

        <div className="flex-1 p-4">
          <div className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                    isActive
                      ? "bg-purple-100 text-purple-700 border border-purple-200"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <div className="flex-1">
                    <div className="font-medium">{tab.title}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {tab.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white">{renderActiveComponent()}</div>
    </div>
  );
}
