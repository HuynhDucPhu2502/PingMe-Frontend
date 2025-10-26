export interface RoomParticipantResponse {
  userId: number;
  name: string;
  avatarUrl: string;
  role: "OWNER" | "ADMIN" | "MEMBER";
  lastReadMessageId: number | null;
  lastReadAt: string | null;
}
