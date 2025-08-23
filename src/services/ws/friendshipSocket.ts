import type { AppDispatch } from "@/features/store";
import { getErrorMessage } from "@/utils/errorMessageHandler";
import { isExpiringSoon } from "@/utils/jwtDecodeHandler";
import { Client, type IMessage, type StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client/dist/sockjs";
import { toast } from "sonner";
import { refreshSessionApi } from "../userAccountApi";
import { updateTokenManually } from "@/features/slices/authSlice";

// =================================================================
// Backend Types (khớp BE)
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

// =================================================================
// Connect Options
// =================================================================
export interface FriendshipWSOptions {
  baseUrl: string;
  getToken?: () => Promise<string | null>;
  onEvent: (ev: FriendshipEvent) => void;
  onConnect?: () => void;
  onDisconnect?: (reason?: string) => void;
  debug?: boolean;
}

// =================================================================
// Internal state
// =================================================================
let client: Client | null = null;
let sub: StompSubscription | null = null;
let manualDisconnect = false;

// =================================================================
// Helpers
// =================================================================
let dispatchRef: AppDispatch;

export const setupFriendshipWSDispatch = (dispatch: AppDispatch) => {
  dispatchRef = dispatch;
};

const defaultGetToken = async () => {
  const acccessToken = localStorage.getItem("access_token");

  if (!acccessToken || isExpiringSoon(acccessToken)) {
    const res = (await refreshSessionApi()).data.data;

    const newAccessToken = res.accessToken;
    dispatchRef(updateTokenManually(res));

    return newAccessToken;
  }

  return acccessToken;
};

export function isFriendshipWSConnected(): boolean {
  return !!client?.connected;
}

export async function connectFriendshipWS(opts: FriendshipWSOptions) {
  if (client?.connected) return;

  manualDisconnect = false;

  const token = (await (opts.getToken ?? defaultGetToken)()) ?? "";

  client = new Client({
    webSocketFactory: () =>
      new SockJS(`${opts.baseUrl}/ws?access_token=${token}`),

    heartbeatIncoming: 15000,
    heartbeatOutgoing: 15000,
    reconnectDelay: 3000,
    debug: opts.debug ? (str) => console.log("[FriendshipWS]", str) : () => {},
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
