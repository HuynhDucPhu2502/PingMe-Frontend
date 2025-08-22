"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Search, Users, Send, Inbox } from "lucide-react";
import type { UserSummaryResponse } from "@/types/userSummary";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/errorMessageHandler";
import {
  acceptInvitationApi,
  cancelInvitationApi,
  deleteFriendshipApi,
  getAcceptedFriendshipListApi,
  getReceivedInvitationsApi,
  getSentInvitationsApi,
  rejectInvitationApi,
} from "@/services/friendshipApi";
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

interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalElements: number;
  totalPages: number;
}

interface DataState {
  data: UserSummaryResponse[];
  isLoading: boolean;
  pagination: PaginationState;
}

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

  // ==============================================================================
  // Data States
  // ==============================================================================

  const [friendsState, setFriendsState] = useState<DataState>({
    data: [],
    isLoading: false,
    pagination: {
      currentPage: 1,
      itemsPerPage: 10,
      totalElements: 0,
      totalPages: 1,
    },
  });

  const [receivedRequestsState, setReceivedRequestsState] = useState<DataState>(
    {
      data: [],
      isLoading: false,
      pagination: {
        currentPage: 1,
        itemsPerPage: 10,
        totalElements: 0,
        totalPages: 1,
      },
    }
  );

  const [sentRequestsState, setSentRequestsState] = useState<DataState>({
    data: [],
    isLoading: false,
    pagination: {
      currentPage: 1,
      itemsPerPage: 10,
      totalElements: 0,
      totalPages: 1,
    },
  });

  // ==============================================================================
  // Fetch Functions
  // ==============================================================================

  const fetchFriends = useCallback(
    async (page: number, size: number, searchTerm?: string) => {
      setFriendsState((prev) => ({ ...prev, isLoading: true }));
      try {
        const response = await getAcceptedFriendshipListApi({
          page: page - 1,
          size,
          filter: searchTerm || null,
        });
        const { content, totalElements, totalPages } = response.data.data;

        setFriendsState((prev) => ({
          ...prev,
          data: content,
          isLoading: false,
          pagination: {
            ...prev.pagination,
            currentPage: page,
            totalElements,
            totalPages,
          },
        }));
      } catch (err) {
        toast.error(getErrorMessage(err, "Không thể lấy danh sách bạn bè"));
        setFriendsState((prev) => ({ ...prev, isLoading: false }));
      }
    },
    []
  );

  const fetchReceivedRequests = useCallback(
    async (page: number, size: number, searchTerm?: string) => {
      setReceivedRequestsState((prev) => ({ ...prev, isLoading: true }));
      try {
        const response = await getReceivedInvitationsApi({
          page: page - 1,
          size,
          filter: searchTerm || null,
        });
        const { content, totalElements, totalPages } = response.data.data;

        setReceivedRequestsState((prev) => ({
          ...prev,
          data: content,
          isLoading: false,
          pagination: {
            ...prev.pagination,
            currentPage: page,
            totalElements,
            totalPages,
          },
        }));
      } catch (err) {
        toast.error(getErrorMessage(err, "Không thể lấy lời mời được nhận"));
        setReceivedRequestsState((prev) => ({ ...prev, isLoading: false }));
      }
    },
    []
  );

  const fetchSentRequests = useCallback(
    async (page: number, size: number, searchTerm?: string) => {
      setSentRequestsState((prev) => ({ ...prev, isLoading: true }));
      try {
        const response = await getSentInvitationsApi({
          page: page - 1,
          size,
          filter: searchTerm || null,
        });
        const { content, totalElements, totalPages } = response.data.data;

        setSentRequestsState((prev) => ({
          ...prev,
          data: content,
          isLoading: false,
          pagination: {
            ...prev.pagination,
            currentPage: page,
            totalElements,
            totalPages,
          },
        }));
      } catch (err) {
        toast.error(getErrorMessage(err, "Không thể lấy lời mời đã gửi"));
        setSentRequestsState((prev) => ({ ...prev, isLoading: false }));
      }
    },
    []
  );

  const currentState = useMemo(() => {
    switch (activeCategory) {
      case "friends":
        return friendsState;
      case "received-requests":
        return receivedRequestsState;
      case "sent-requests":
        return sentRequestsState;
      default:
        return friendsState;
    }
  }, [activeCategory, friendsState, receivedRequestsState, sentRequestsState]);

  // ==============================================================================
  // Pagination Functions
  // ==============================================================================
  const updateFriendsPagination = useCallback(
    (updates: Partial<PaginationState>) => {
      setFriendsState((prev) => ({
        ...prev,
        pagination: { ...prev.pagination, ...updates },
      }));
    },
    []
  );

  const updateReceivedRequestsPagination = useCallback(
    (updates: Partial<PaginationState>) => {
      setReceivedRequestsState((prev) => ({
        ...prev,
        pagination: { ...prev.pagination, ...updates },
      }));
    },
    []
  );

  const updateSentRequestsPagination = useCallback(
    (updates: Partial<PaginationState>) => {
      setSentRequestsState((prev) => ({
        ...prev,
        pagination: { ...prev.pagination, ...updates },
      }));
    },
    []
  );

  const updateCurrentPagination = useCallback(
    (updates: Partial<PaginationState>) => {
      switch (activeCategory) {
        case "friends":
          updateFriendsPagination(updates);
          break;
        case "received-requests":
          updateReceivedRequestsPagination(updates);
          break;
        case "sent-requests":
          updateSentRequestsPagination(updates);
          break;
      }
    },
    [
      activeCategory,
      updateFriendsPagination,
      updateReceivedRequestsPagination,
      updateSentRequestsPagination,
    ]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      updateCurrentPagination({ currentPage: page });

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
      updateCurrentPagination({ itemsPerPage: size, currentPage: 1 });

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

  // ==============================================================================
  // Listener
  // ==============================================================================
  // Initial listener - chỉ fetch data lần đầu khi component mount
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

  // Search change listener - chỉ refetch khi search query thay đổi
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateCurrentPagination({ currentPage: 1 });

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

  // ==============================================================================
  // Handler
  // ==============================================================================
  const handleAcceptRequest = useCallback(
    async (friendshipId: number) => {
      try {
        await acceptInvitationApi(friendshipId);

        toast.success("Đã chấp nhận lời mời kết bạn");

        await Promise.all([
          fetchReceivedRequests(
            receivedRequestsState.pagination.currentPage,
            receivedRequestsState.pagination.itemsPerPage,
            searchQuery
          ),
          fetchFriends(1, 10),
        ]);
      } catch (err) {
        toast.error(getErrorMessage(err, "Không thể chấp nhận lời mời"));
      }
    },
    [
      receivedRequestsState.pagination.currentPage,
      receivedRequestsState.pagination.itemsPerPage,
      searchQuery,
      fetchReceivedRequests,
      fetchFriends,
    ]
  );

  const handleRejectRequest = useCallback(
    async (friendshipId: number) => {
      try {
        await rejectInvitationApi(friendshipId);
        await new Promise((resolve) => setTimeout(resolve, 1000));

        toast.success("Đã từ chối lời mời kết bạn");

        await fetchReceivedRequests(
          receivedRequestsState.pagination.currentPage,
          receivedRequestsState.pagination.itemsPerPage,
          searchQuery
        );
      } catch (err) {
        toast.error(getErrorMessage(err, "Không thể từ chối lời mời"));
      }
    },
    [
      receivedRequestsState.pagination.currentPage,
      receivedRequestsState.pagination.itemsPerPage,
      searchQuery,
      fetchReceivedRequests,
    ]
  );

  const handleCancelRequest = useCallback(
    async (friendshipId: number) => {
      try {
        await cancelInvitationApi(friendshipId);
        await new Promise((resolve) => setTimeout(resolve, 1000));

        toast.success("Đã hủy lời mời kết bạn");

        await fetchSentRequests(
          sentRequestsState.pagination.currentPage,
          sentRequestsState.pagination.itemsPerPage,
          searchQuery
        );
      } catch (err) {
        toast.error(getErrorMessage(err, "Không thể hủy lời mời"));
      }
    },
    [
      sentRequestsState.pagination.currentPage,
      sentRequestsState.pagination.itemsPerPage,
      searchQuery,
      fetchSentRequests,
    ]
  );

  const handleRemoveFriend = useCallback(
    async (friendshipId: number) => {
      try {
        await deleteFriendshipApi(friendshipId);

        await new Promise((resolve) => setTimeout(resolve, 1000));

        toast.success("Đã xóa bạn bè");

        await fetchFriends(
          friendsState.pagination.currentPage,
          friendsState.pagination.itemsPerPage,
          searchQuery
        );
      } catch (err) {
        toast.error(getErrorMessage(err, "Không thể xóa bạn bè"));
      }
    },
    [
      friendsState.pagination.currentPage,
      friendsState.pagination.itemsPerPage,
      searchQuery,
      fetchFriends,
    ]
  );

  // ==============================================================================
  // WebSocket - Real-time updates
  // ==============================================================================
  useEffect(() => {
    connectFriendshipWS({
      baseUrl: `${import.meta.env.VITE_BACKEND_BASE_URL}`,
      onEvent: (ev: FriendshipEvent) => {
        console.log("Friendship event:", ev);

        switch (ev.type) {
          case "INVITED":
            // Có lời mời mới -> cập nhật received requests
            fetchReceivedRequests(
              receivedRequestsState.pagination.currentPage,
              receivedRequestsState.pagination.itemsPerPage,
              searchQuery
            );
            break;
          case "ACCEPTED":
            // Lời mời được chấp nhận -> cập nhật friends và sent requests
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
            // Lời mời bị từ chối -> cập nhật sent requests
            fetchSentRequests(
              sentRequestsState.pagination.currentPage,
              sentRequestsState.pagination.itemsPerPage,
              searchQuery
            );
            break;
          case "CANCELED":
            // Lời mời bị hủy -> cập nhật received requests
            fetchReceivedRequests(
              receivedRequestsState.pagination.currentPage,
              receivedRequestsState.pagination.itemsPerPage,
              searchQuery
            );
            break;
          case "DELETED":
            // Bạn bè bị xóa -> cập nhật friends
            fetchFriends(
              friendsState.pagination.currentPage,
              friendsState.pagination.itemsPerPage,
              searchQuery
            );
            break;
        }
      },
      onConnect: () => console.log("FriendshipWS connected"),
      onDisconnect: (reason) =>
        console.log("FriendshipWS disconnected:", reason),
      debug: true,
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
