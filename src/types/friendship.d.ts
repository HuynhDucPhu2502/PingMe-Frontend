export interface FriendInvitationRequest {
  targetUserId: number;
}

export interface FriendshipSummary {
  id: number;
  friendshipStatus: "PENDING" | "ACCEPTED";
}
