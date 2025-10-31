import type { RoomParticipantResponse } from "./roomParticipant";

export interface RoomResponse {
  roomId: number;
  roomType: "DIRECT" | "GROUP";
  directKey: string | null;
  name: string | null;
  lastMessage: LastMessage | null;
  participants: RoomParticipantResponse[];
  unreadCount: number;
}

export interface LastMessage {
  messageId: number;
  senderId: number;
  preview: string;
  messageType: "TEXT" | "IMAGE" | "VIDEO" | "FILE";
  createdAt: string;
}

export interface CreateOrGetDirectRoomRequest {
  targetUserId: number;
}
