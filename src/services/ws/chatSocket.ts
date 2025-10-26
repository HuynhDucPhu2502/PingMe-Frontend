import type { MessageResponse } from "@/types/chat/message";
import type { RoomResponse } from "@/types/chat/room";
import { Client, type IMessage, type StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client/dist/sockjs";

// =================================================================
// Type
// =================================================================
export type ChatEventType =
  | "MESSAGE_CREATED"
  | "READ_STATE_CHANGED"
  | "ROOM_UPDATED";

export interface MessageCreatedEventPayload {
  chatEventType: "MESSAGE_CREATED";
  messageResponse: MessageResponse;
}

export interface ReadStateChangedEvent {
  chatEventType: "READ_STATE_CHANGED";
  roomId: number;
  userId?: number;
  lastReadMessageId: number;
  lastReadAt: string;
}

export interface RoomUpdatedEventPayload {
  chatEventType: "ROOM_UPDATED";
  roomResponse: RoomResponse;
}

export interface ChatWSOptions {
  baseUrl: string;
  onDisconnect?: (reason?: string) => void;
  onMessageCreated?: (ev: MessageCreatedEventPayload) => void;
  onReadStateChanged?: (ev: ReadStateChangedEvent) => void;
  onRoomUpdated?: (ev: RoomUpdatedEventPayload) => void;
}

// =================================================================
// Internal State
// =================================================================
let client: Client | null = null;
let manualDisconnect = false;
let lastOpts: ChatWSOptions | null = null;

let userRoomsSub: StompSubscription | null = null;

let currentRoomIdRef: number | null = null;
let roomMsgSub: StompSubscription | null = null;
let roomReadSub: StompSubscription | null = null;

// ================================================================
// Connect / Disconnect
// ================================================================
export function isConnected(): boolean {
  return !!client?.connected;
}

export function connectChatWS(opts: ChatWSOptions) {
  if (isConnected()) return;
  manualDisconnect = false;
  lastOpts = opts;

  client = new Client({
    webSocketFactory: () => {
      const token = localStorage.getItem("access_token") ?? "";
      const url = `${opts.baseUrl}/ws?access_token=${encodeURIComponent(
        token
      )}`;
      return new SockJS(url);
    },
    heartbeatIncoming: 15000,
    heartbeatOutgoing: 15000,
    reconnectDelay: 3000,
    maxWebSocketChunkSize: 8 * 1024,
  });

  client.onConnect = () => {
    try {
      userRoomsSub?.unsubscribe();
    } catch (e) {
      console.warn("[ChatWS] unsubscribe old userRoomsSub err:", e);
    }
    userRoomsSub = client!.subscribe("/user/queue/rooms", (msg: IMessage) => {
      try {
        const ev = JSON.parse(msg.body) as RoomUpdatedEventPayload;
        if (ev?.chatEventType === "ROOM_UPDATED") {
          lastOpts?.onRoomUpdated?.(ev);
        }
      } catch (e) {
        console.error("[ChatWS] parse ROOM_UPDATED error:", e, msg.body);
      }
    });

    // 2) Nếu trước đó đang mở 1 phòng, khi reconnect thì resubscribe lại
    if (currentRoomIdRef != null) {
      _subscribeRoomMessages(currentRoomIdRef);
      _subscribeRoomReadStates(currentRoomIdRef);
    }
  };

  client.onStompError = (frame) => {
    console.error(
      "[ChatWS] STOMP error:",
      frame.headers["message"],
      frame.body
    );
  };

  client.onWebSocketError = (ev) => {
    console.error("[ChatWS] WebSocket error:", ev);
  };

  client.onDisconnect = (frame) => {
    // không clear currentRoomIdRef để reconnect còn biết phòng đang mở
    userRoomsSub = null;
    lastOpts?.onDisconnect?.(frame?.headers?.message);

    if (manualDisconnect) {
      try {
        roomMsgSub?.unsubscribe();
        roomReadSub?.unsubscribe();
      } catch (e) {
        console.warn("[ChatWS] cleanup subs err:", e);
      }
      roomMsgSub = null;
      roomReadSub = null;
      currentRoomIdRef = null;
    }
  };

  client.activate();
}

export function disconnectChatWS() {
  manualDisconnect = true;
  try {
    userRoomsSub?.unsubscribe();
    userRoomsSub = null;

    roomMsgSub?.unsubscribe();
    roomReadSub?.unsubscribe();
    roomMsgSub = null;
    roomReadSub = null;
    currentRoomIdRef = null;
  } catch (e) {
    console.warn("[ChatWS] unsubscribe on disconnect err:", e);
  }
  client?.deactivate();
  client = null;
}

export function enterRoom(roomId: number) {
  if (!isConnected() || !client) return;
  if (currentRoomIdRef === roomId) return; // đã ở phòng này rồi

  // huỷ sub của phòng cũ (nếu có)
  try {
    roomMsgSub?.unsubscribe();
  } catch (e) {
    console.warn(e);
  }
  try {
    roomReadSub?.unsubscribe();
  } catch (e) {
    console.warn(e);
  }

  // sub phòng mới
  _subscribeRoomMessages(roomId);
  _subscribeRoomReadStates(roomId);
  currentRoomIdRef = roomId;
}

export function leaveRoom() {
  try {
    roomMsgSub?.unsubscribe();
  } catch (e) {
    console.warn(e);
  }
  try {
    roomReadSub?.unsubscribe();
  } catch (e) {
    console.warn(e);
  }
  roomMsgSub = null;
  roomReadSub = null;
  currentRoomIdRef = null;
}

// ================================================================
//  Subscribe helpers
// ================================================================
function _subscribeRoomMessages(roomId: number) {
  if (!isConnected() || !client) return;

  try {
    roomMsgSub?.unsubscribe();
  } catch (e) {
    console.warn("[ChatWS] _subscribeRoomMessages old unsub err:", e);
  }

  const dest = `/topic/rooms/${roomId}/messages`;
  roomMsgSub = client.subscribe(dest, (msg: IMessage) => {
    try {
      const ev = JSON.parse(msg.body) as MessageCreatedEventPayload;
      if (ev?.chatEventType === "MESSAGE_CREATED") {
        lastOpts?.onMessageCreated?.(ev);
      }
    } catch (e) {
      console.error("[ChatWS] parse MESSAGE_CREATED error:", e, msg.body);
    }
  });
}

function _subscribeRoomReadStates(roomId: number) {
  if (!isConnected() || !client) return;

  try {
    roomReadSub?.unsubscribe();
  } catch (e) {
    console.warn("[ChatWS] _subscribeRoomReadStates old unsub err:", e);
  }

  const dest = `/topic/rooms/${roomId}/read-states`;
  roomReadSub = client.subscribe(dest, (msg: IMessage) => {
    try {
      const ev = JSON.parse(msg.body) as ReadStateChangedEvent;
      if (ev?.chatEventType === "READ_STATE_CHANGED") {
        lastOpts?.onReadStateChanged?.(ev);
      }
    } catch (e) {
      console.error("[ChatWS] parse READ_STATE_CHANGED error:", e, msg.body);
    }
  });
}
