import type { RoomParticipantResponse } from "./roomParticipant";

export interface RoomResponse {
  roomId: number;
  roomType: "DIRECT" | "GROUP";
  directKey: string | null;
  name: string;
  lastMessage: LastMessage;
  participants: RoomParticipantResponse[];
  unreadCount: number;
}

export interface LastMessage {
  messageId: number;
  senderId: number;
  preview: string;
  createdAt: string;
}

export interface CreateOrGetDirectRoomRequest {
  targetUserId: number;
}
