import type { UserSummaryResponse } from "../common/userSummary";

export interface FriendInvitationRequest {
  targetUserId: number;
}

export interface FriendshipSummary {
  id: number;
  friendshipStatus: "PENDING" | "ACCEPTED";
}

export interface HistoryFriendshipResponse {
  userSummaryResponses: UserSummaryResponse[];
  total: number;
}

export interface UserFriendshipStatsResponse {
  totalFriends: number;
  totalSentInvites: number;
  totalReceivedInvites: number;
}
