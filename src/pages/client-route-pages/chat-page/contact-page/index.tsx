import { useEffect, useState, useCallback, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Search, Users, Send, Inbox } from "lucide-react";
import Pagination from "@/components/custom/Pagination";
import { EmptyState } from "@/components/custom/EmptyState";
import LoadingSpinner from "@/components/custom/LoadingSpinner";
import SidebarNavigation from "./components/SidebarNavigation";
import ContactItem from "./components/ContactItem";
import {
  connectFriendshipWS,
  disconnectFriendshipWS,
  type FriendshipEvent,
} from "@/services/ws/friendshipSocket";
import { SharedTopBar } from "../components/SharedTopbar";
import { useContactsState } from "./hooks/useContactsState";
import { useContactsActions } from "./hooks/useContactsActions";

const sidebarItems = [
  {
    id: "friends",
    title: "Danh sách bạn bè",
    icon: Users,
    description: "Bạn bè đã kết nối",
  },
  {
    id: "received-requests",
    title: "Lời mời được nhận",
    icon: Inbox,
    description: "Lời mời kết bạn từ người khác",
  },
  {
    id: "sent-requests",
    title: "Lời mời đã gửi",
    icon: Send,
    description: "Lời mời bạn đã gửi đi",
  },
];

export default function ContactsPage() {
  const [activeCategory, setActiveCategory] = useState("friends");
  const [searchQuery, setSearchQuery] = useState("");

  const {
    friendsState,
    receivedRequestsState,
    sentRequestsState,
    fetchFriends,
    fetchReceivedRequests,
    fetchSentRequests,
    updateCurrentPagination,
    getCurrentState,
  } = useContactsState();

  const {
    handleAcceptRequest,
    handleRejectRequest,
    handleCancelRequest,
    handleRemoveFriend,
  } = useContactsActions({
    fetchFriends,
    fetchReceivedRequests,
    fetchSentRequests,
    friendsState,
    receivedRequestsState,
    sentRequestsState,
    searchQuery,
  });

  const currentState = useMemo(() => {
    return getCurrentState(activeCategory);
  }, [activeCategory, getCurrentState]);

  const handlePageChange = useCallback(
    (page: number) => {
      updateCurrentPagination(activeCategory, { currentPage: page });

      switch (activeCategory) {
        case "friends":
          fetchFriends(page, friendsState.pagination.itemsPerPage, searchQuery);
          break;
        case "received-requests":
          fetchReceivedRequests(
            page,
            receivedRequestsState.pagination.itemsPerPage,
            searchQuery
          );
          break;
        case "sent-requests":
          fetchSentRequests(
            page,
            sentRequestsState.pagination.itemsPerPage,
            searchQuery
          );
          break;
      }
    },
    [
      activeCategory,
      friendsState.pagination.itemsPerPage,
      receivedRequestsState.pagination.itemsPerPage,
      sentRequestsState.pagination.itemsPerPage,
      searchQuery,
      updateCurrentPagination,
      fetchFriends,
      fetchReceivedRequests,
      fetchSentRequests,
    ]
  );

  const handleItemsPerPageChange = useCallback(
    (size: number) => {
      updateCurrentPagination(activeCategory, {
        itemsPerPage: size,
        currentPage: 1,
      });

      switch (activeCategory) {
        case "friends":
          fetchFriends(1, size, searchQuery);
          break;
        case "received-requests":
          fetchReceivedRequests(1, size, searchQuery);
          break;
        case "sent-requests":
          fetchSentRequests(1, size, searchQuery);
          break;
      }
    },
    [
      activeCategory,
      searchQuery,
      updateCurrentPagination,
      fetchFriends,
      fetchReceivedRequests,
      fetchSentRequests,
    ]
  );

  const currentItem = useMemo(
    () => sidebarItems.find((item) => item.id === activeCategory),
    [activeCategory]
  );

  useEffect(() => {
    const fetchInitialData = async () => {
      await Promise.all([
        fetchFriends(1, 10),
        fetchReceivedRequests(1, 10),
        fetchSentRequests(1, 10),
      ]);
    };
    fetchInitialData();
  }, [fetchFriends, fetchReceivedRequests, fetchSentRequests]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateCurrentPagination(activeCategory, { currentPage: 1 });

      switch (activeCategory) {
        case "friends":
          fetchFriends(1, friendsState.pagination.itemsPerPage, searchQuery);
          break;
        case "received-requests":
          fetchReceivedRequests(
            1,
            receivedRequestsState.pagination.itemsPerPage,
            searchQuery
          );
          break;
        case "sent-requests":
          fetchSentRequests(
            1,
            sentRequestsState.pagination.itemsPerPage,
            searchQuery
          );
          break;
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [
    searchQuery,
    activeCategory,
    fetchFriends,
    fetchReceivedRequests,
    fetchSentRequests,
    friendsState.pagination.itemsPerPage,
    receivedRequestsState.pagination.itemsPerPage,
    sentRequestsState.pagination.itemsPerPage,
    updateCurrentPagination,
  ]);

  useEffect(() => {
    connectFriendshipWS({
      baseUrl: `${import.meta.env.VITE_BACKEND_BASE_URL}`,
      onEvent: (ev: FriendshipEvent) => {
        switch (ev.type) {
          case "INVITED":
            fetchReceivedRequests(
              receivedRequestsState.pagination.currentPage,
              receivedRequestsState.pagination.itemsPerPage,
              searchQuery
            );
            break;
          case "ACCEPTED":
            fetchFriends(
              friendsState.pagination.currentPage,
              friendsState.pagination.itemsPerPage,
              searchQuery
            );
            fetchSentRequests(
              sentRequestsState.pagination.currentPage,
              sentRequestsState.pagination.itemsPerPage,
              searchQuery
            );
            break;
          case "REJECTED":
            fetchSentRequests(
              sentRequestsState.pagination.currentPage,
              sentRequestsState.pagination.itemsPerPage,
              searchQuery
            );
            break;
          case "CANCELED":
            fetchReceivedRequests(
              receivedRequestsState.pagination.currentPage,
              receivedRequestsState.pagination.itemsPerPage,
              searchQuery
            );
            break;
          case "DELETED":
            fetchFriends(
              friendsState.pagination.currentPage,
              friendsState.pagination.itemsPerPage,
              searchQuery
            );
            break;
        }
      },
      onConnect: () => console.log("WS Connected"),
      onDisconnect: (reason) => console.log("WS Disconnected: ", reason),
      debug: false,
    });

    return () => {
      disconnectFriendshipWS();
    };
  }, [
    fetchFriends,
    fetchReceivedRequests,
    fetchSentRequests,
    friendsState.pagination.currentPage,
    friendsState.pagination.itemsPerPage,
    receivedRequestsState.pagination.currentPage,
    receivedRequestsState.pagination.itemsPerPage,
    sentRequestsState.pagination.currentPage,
    sentRequestsState.pagination.itemsPerPage,
    searchQuery,
  ]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <SharedTopBar
          onFriendAdded={async () => {
            await fetchSentRequests(
              sentRequestsState.pagination.currentPage,
              sentRequestsState.pagination.itemsPerPage,
              searchQuery
            );
          }}
        />

        {/* Sidebar Navigation */}
        <SidebarNavigation
          sidebarItems={sidebarItems}
          friendsStateTotalElements={friendsState.pagination.totalElements}
          receivedRequestsStateTotalElements={
            receivedRequestsState.pagination.totalElements
          }
          sentRequestsStateTotalElements={
            sentRequestsState.pagination.totalElements
          }
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />
      </div>

      {/* Right Content */}
      <div className="flex-1 bg-white flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {currentItem?.title}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {currentState.pagination.totalElements} kết quả
              </p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm theo tên hoặc email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200 focus:border-purple-300 focus:ring-purple-200"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          {currentState.isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="flex items-center space-x-3 text-purple-600">
                <LoadingSpinner className="w-8 h-8" />
                <span className="text-lg font-medium">Đang tải...</span>
              </div>
            </div>
          ) : currentState.data.length === 0 ? (
            <div className="flex-1">
              <EmptyState
                icon={currentItem?.icon}
                title={`Không có ${currentItem?.title.toLowerCase()}`}
                description={
                  searchQuery
                    ? `Không tìm thấy kết quả nào cho "${searchQuery}"`
                    : `Chưa có ${currentItem?.title.toLowerCase()} nào.`
                }
              />
            </div>
          ) : (
            <>
              {/* Contact List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {currentState.data.map((item) => (
                  <ContactItem
                    key={item.friendshipSummary.id}
                    contact={item}
                    activeCategory={activeCategory}
                    handleAcceptRequest={handleAcceptRequest}
                    handleRejectRequest={handleRejectRequest}
                    handleCancelRequest={handleCancelRequest}
                    handleRemoveFriend={handleRemoveFriend}
                  />
                ))}
              </div>

              {/* Pagination */}
              {currentState.pagination.totalPages > 1 && (
                <Pagination
                  currentPage={currentState.pagination.currentPage}
                  setCurrentPage={handlePageChange}
                  totalPages={currentState.pagination.totalPages}
                  totalElements={currentState.pagination.totalElements}
                  itemsPerPage={currentState.pagination.itemsPerPage}
                  setItemsPerPage={handleItemsPerPageChange}
                  showItemsPerPageSelect={true}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
