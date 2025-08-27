export interface RoomParticipantResponse {
  userId: number;
  role: "OWNER" | "ADMIN" | "MEMBER";
  lastReadMessageId: number | null;
  lastReadAt: string | null;
}
