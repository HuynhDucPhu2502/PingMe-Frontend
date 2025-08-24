import { updateTokenManually } from "@/features/slices/authSlice";
import type { AppDispatch } from "@/features/store";
import { getErrorMessage } from "@/utils/errorMessageHandler";
import { getValidAccessToken } from "@/utils/jwtDecodeHandler";
import { Client, type IMessage, type StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client/dist/sockjs";
import { toast } from "sonner";

// =================================================================
// Type
// =================================================================
export type FriendshipEventType =
  | "INVITED"
  | "ACCEPTED"
  | "REJECTED"
  | "CANCELED"
  | "DELETED";

export interface FriendshipEvent {
  type: FriendshipEventType;
  friendshipId: number;
  actorId: number;
  targetId: number;
}

export interface FriendshipWSOptions {
  baseUrl: string;
  onEvent: (ev: FriendshipEvent) => void;
  onConnect: () => void;
  onDisconnect: (reason?: string) => void;
}

// =================================================================
// Setup App Dispatch
// =================================================================
let dispatchRef: AppDispatch | null = null;

export const setupFriendshipWSAppDispatch = (dispatch: AppDispatch) => {
  dispatchRef = dispatch;
};

// =================================================================
// Internal state
// =================================================================
let client: Client | null = null;
let sub: StompSubscription | null = null;
let manualDisconnect = false;

export async function connectFriendshipWS(opts: FriendshipWSOptions) {
  if (client?.connected) return;
  manualDisconnect = false;

  client = new Client({
    webSocketFactory: async () => {
      const result = await getValidAccessToken();

      if (result.type === "refreshed" && dispatchRef != null)
        dispatchRef(updateTokenManually(result.payload));

      new SockJS(`${opts.baseUrl}/ws?access_token=${result.accessToken}`);
    },
    heartbeatIncoming: 15000,
    heartbeatOutgoing: 15000,
    reconnectDelay: 3000,
    maxWebSocketChunkSize: 8 * 1024,
  });

  client.onConnect = () => {
    sub?.unsubscribe();
    sub = client!.subscribe("/user/queue/friendship", (msg: IMessage) => {
      try {
        const ev = JSON.parse(msg.body) as FriendshipEvent;
        opts.onEvent(ev);
      } catch (e) {
        console.error("[FriendshipWS] parse error:", e, msg.body);
      }
    });

    opts.onConnect?.();
  };

  client.onStompError = (frame) => {
    console.error(
      "[FriendshipWS] STOMP error:",
      frame.headers["message"],
      frame.body
    );
  };

  client.onWebSocketError = (ev) => {
    console.error("[FriendshipWS] WebSocket error:", ev);
  };

  client.onDisconnect = (frame) => {
    sub = null;
    opts.onDisconnect?.(frame?.headers?.message);
    if (manualDisconnect) return;
  };

  client.activate();
}

export function disconnectFriendshipWS() {
  manualDisconnect = true;
  try {
    sub?.unsubscribe();
    sub = null;
  } catch (err) {
    toast.error(getErrorMessage(err, "Không thể ngắt kết nối"));
  }
  client?.deactivate();
  client = null;
}
