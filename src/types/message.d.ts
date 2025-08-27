export interface MessageResponse {
  id: number;
  roomId: number;
  clientMsgId: string;
  senderId: number;
  content: string;
  type: "TEXT" | "IMAGE" | "VIDEO" | "FILE";
  createdAt: string;
}

export interface SendMessageRequest {
  content: string;
  clientMsgId: string;
  type: "TEXT" | "IMAGE" | "VIDEO" | "FILE";
  roomId: number;
}

export interface ReadStateResponse {
  roomId: number;
  userId: number;
  lastReadMessageId: number | null;
  lastReadAt: string | null;
  unreadCount: number;
}

export interface MarkReadRequest {
  lastReadMessageId: number;
  roomId: number;
}
