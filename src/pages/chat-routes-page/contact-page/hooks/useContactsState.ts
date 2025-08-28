import { useState, useCallback } from "react";
import type { UserSummaryResponse } from "@/types/userSummary";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/errorMessageHandler.ts";
import {
  getAcceptedFriendshipListApi,
  getReceivedInvitationsApi,
  getSentInvitationsApi,
} from "@/services/friendshipApi.ts";

interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalElements: number;
  totalPages: number;
}

export interface DataState {
  data: UserSummaryResponse[];
  isLoading: boolean;
  pagination: PaginationState;
}

export function useContactsState() {
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
    (activeCategory: string, updates: Partial<PaginationState>) => {
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
      updateFriendsPagination,
      updateReceivedRequestsPagination,
      updateSentRequestsPagination,
    ]
  );

  const getCurrentState = useCallback(
    (activeCategory: string) => {
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
    },
    [friendsState, receivedRequestsState, sentRequestsState]
  );

  return {
    // States
    friendsState,
    receivedRequestsState,
    sentRequestsState,

    // Fetch functions
    fetchFriends,
    fetchReceivedRequests,
    fetchSentRequests,

    // Pagination functions
    updateCurrentPagination,

    // Helper functions
    getCurrentState,
  };
}
