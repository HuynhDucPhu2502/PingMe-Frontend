import type { FriendshipSummary } from "../friendship";

export interface UserSummaryResponse {
  id: number;
  email: string;
  name: string;
  avatarUrl: string;
  friendshipSummary: FriendshipSummary | null;
}
