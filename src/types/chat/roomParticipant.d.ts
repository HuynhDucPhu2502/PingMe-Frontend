import type { UserStatus } from "../common/userStatus";
export interface RoomParticipantResponse {
  userId: number;
  name: string;
  avatarUrl: string;

  status: UserStatus;
  role: "OWNER" | "ADMIN" | "MEMBER";
  lastReadMessageId: number | null;
  lastReadAt: string | null;
}
