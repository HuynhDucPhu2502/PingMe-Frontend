import axiosClient from "@/lib/axiosClient.ts";
import type {
  ApiResponse,
  PageResponse,
  PaginationParams,
} from "@/types/apiResponse";
import type { FriendInvitationRequest } from "@/types/friendship";
import type { UserSummaryResponse } from "@/types/userSummary";

export const sendInvitationApi = (data: FriendInvitationRequest) => {
  return axiosClient.post("/friendships", data);
};

export const acceptInvitationApi = (id: number) => {
  return axiosClient.post(`/friendships/${id}/accept`);
};

export const rejectInvitationApi = (id: number) => {
  return axiosClient.delete(`/friendships/${id}/reject`);
};

export const cancelInvitationApi = (id: number) => {
  return axiosClient.delete(`/friendships/${id}/cancel`);
};

export const deleteFriendshipApi = (id: number) => {
  return axiosClient.delete(`/friendships/${id}`);
};

export const getAcceptedFriendshipListApi = ({
  page = 0,
  size = 5,
}: PaginationParams) => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });

  return axiosClient.get<ApiResponse<PageResponse<UserSummaryResponse>>>(
    `/friendships?${params.toString()}`
  );
};

export const getReceivedInvitationsApi = ({
  page = 0,
  size = 5,
}: PaginationParams) => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });

  return axiosClient.get<ApiResponse<PageResponse<UserSummaryResponse>>>(
    `/friendships/received?${params.toString()}`
  );
};

export const getSentInvitationsApi = ({
  page = 0,
  size = 5,
}: PaginationParams) => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });

  return axiosClient.get<ApiResponse<PageResponse<UserSummaryResponse>>>(
    `/friendships/sent?${params.toString()}`
  );
};
