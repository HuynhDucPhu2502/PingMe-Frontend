import type { FriendshipSummary } from "../friendship";
import type { UserStatus } from "./userStatus";

export interface UserSummaryResponse {
  id: number;
  email: string;
  name: string;
  avatarUrl: string;

  status?: UserStatus;
  friendshipSummary: FriendshipSummary | null;
}
