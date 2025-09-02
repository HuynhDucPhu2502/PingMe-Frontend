import type { UserSummaryResponse } from "./userSummary";

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
