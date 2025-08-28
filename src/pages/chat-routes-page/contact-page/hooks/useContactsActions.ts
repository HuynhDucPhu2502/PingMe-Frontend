import { toast } from "sonner";
import {
  acceptInvitationApi,
  rejectInvitationApi,
  cancelInvitationApi,
  deleteFriendshipApi,
} from "@/services/friendshipApi";
import { getErrorMessage } from "@/utils/errorMessageHandler";
import type { DataState } from "./useContactsState";

interface UseContactsActionsProps {
  fetchFriends: (
    page: number,
    size: number,
    searchTerm?: string
  ) => Promise<void>;
  fetchReceivedRequests: (
    page: number,
    size: number,
    searchTerm?: string
  ) => Promise<void>;
  fetchSentRequests: (
    page: number,
    size: number,
    searchTerm?: string
  ) => Promise<void>;
  friendsState: DataState;
  receivedRequestsState: DataState;
  sentRequestsState: DataState;
  searchQuery: string;
}

export const useContactsActions = ({
  fetchFriends,
  fetchReceivedRequests,
  fetchSentRequests,
  friendsState,
  receivedRequestsState,
  sentRequestsState,
  searchQuery,
}: UseContactsActionsProps) => {
  const acceptFriendRequest = async (id: number) => {
    try {
      await acceptInvitationApi(id);

      await Promise.all([
        fetchFriends(
          friendsState.pagination.currentPage,
          friendsState.pagination.itemsPerPage,
          searchQuery
        ),
        fetchReceivedRequests(
          receivedRequestsState.pagination.currentPage,
          receivedRequestsState.pagination.itemsPerPage,
          searchQuery
        ),
      ]);

      toast.success("Đã chấp nhận lời mời kết bạn!");
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Không thể chấp nhận lời mời kết bạn")
      );
    }
  };

  const rejectFriendRequest = async (id: number) => {
    try {
      await rejectInvitationApi(id);

      await fetchReceivedRequests(
        receivedRequestsState.pagination.currentPage,
        receivedRequestsState.pagination.itemsPerPage,
        searchQuery
      );

      toast.success("Đã từ chối lời mời kết bạn");
    } catch (error) {
      toast.error(getErrorMessage(error, "Không thể từ chối lời mời kết bạn"));
    }
  };

  const cancelFriendRequest = async (id: number) => {
    try {
      await cancelInvitationApi(id);

      await fetchSentRequests(
        sentRequestsState.pagination.currentPage,
        sentRequestsState.pagination.itemsPerPage,
        searchQuery
      );

      toast.success("Đã hủy lời mời kết bạn");
    } catch (error) {
      toast.error(getErrorMessage(error, "Không thể hủy lời mời kết bạn"));
    }
  };

  const removeFriend = async (id: number) => {
    try {
      await deleteFriendshipApi(id);

      await fetchFriends(
        friendsState.pagination.currentPage,
        friendsState.pagination.itemsPerPage,
        searchQuery
      );

      toast.success("Đã xóa bạn bè");
    } catch (error) {
      toast.error(getErrorMessage(error, "Không thể xóa bạn bè"));
    }
  };

  const handleAcceptRequest = (id: number) => {
    acceptFriendRequest(id);
  };

  const handleRejectRequest = (id: number) => {
    rejectFriendRequest(id);
  };

  const handleCancelRequest = (id: number) => {
    cancelFriendRequest(id);
  };

  const handleRemoveFriend = (id: number) => {
    removeFriend(id);
  };

  return {
    handleAcceptRequest,
    handleRejectRequest,
    handleCancelRequest,
    handleRemoveFriend,
  };
};
