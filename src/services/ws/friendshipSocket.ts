import { getErrorMessage } from "@/utils/errorMessageHandler";
import {
  Client,
  type IMessage,
  type StompSubscription,
  StompHeaders,
} from "@stomp/stompjs";
import SockJS from "sockjs-client/dist/sockjs";
import { toast } from "sonner";

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
  actorId: number; // user thực hiện hành động
  targetId: number; // user bị tác động
}

// =================================================================
// Connect Options
// =================================================================
export interface FriendshipWSOptions {
  baseUrl: string; // ví dụ: https://api.myapp.com
  getToken?: () => string | null; // hàm lấy Access Token (mặc định localStorage)
  onEvent: (ev: FriendshipEvent) => void; // callback khi nhận event
  onConnect?: () => void; // optional hook
  onDisconnect?: (reason?: string) => void; // optional hook
  debug?: boolean; // bật log STOMP
}

// =================================================================
// Internal state
// =================================================================
let client: Client | null = null;
let sub: StompSubscription | null = null;
let manualDisconnect = false; // để phân biệt disconnect chủ động

// =================================================================
// Helpers
// =================================================================
const defaultGetToken = () => localStorage.getItem("access_token");

/** Tạo headers Authorization gửi trong STOMP CONNECT (nếu BE đọc header) */
function makeConnectHeaders(getToken: () => string | null): StompHeaders {
  const t = getToken?.() ?? defaultGetToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

/** Có đang connected chưa */
export function isFriendshipWSConnected(): boolean {
  return !!client?.connected;
}

/** Kết nối WS và subscribe /user/queue/friendship */
export function connectFriendshipWS(opts: FriendshipWSOptions) {
  if (client?.connected) return; // tránh connect nhiều lần

  manualDisconnect = false;

  const getToken = opts.getToken ?? defaultGetToken;
  const token = getToken();

  client = new Client({
    // Bạn đang dùng token ở query param; giữ nguyên đúng nhu cầu hiện tại
    webSocketFactory: () =>
      new SockJS(`${opts.baseUrl}/ws?access_token=${token}`),

    // Đồng thời vẫn gắn Authorization header cho case BE đọc từ STOMP headers
    connectHeaders: makeConnectHeaders(getToken),

    heartbeatIncoming: 15000,
    heartbeatOutgoing: 15000,
    reconnectDelay: 3000, // tự reconnect khi mạng chập chờn (không liên quan refresh token)
    debug: opts.debug ? (str) => console.log("[FriendshipWS]", str) : () => {},
    maxWebSocketChunkSize: 8 * 1024,
  });

  client.onConnect = () => {
    // (re)subscribe
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
    if (manualDisconnect) return; // nếu mình chủ động tắt thì thôi
    // nếu không, thư viện sẽ tự reconnect theo reconnectDelay
  };

  client.activate();
}

/** Ngắt kết nối (manual) */
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

/** Chờ đến khi connected (tiện cho nơi cần đảm bảo đã online) */
export function waitForFriendshipWS(timeoutMs = 5000): Promise<void> {
  return new Promise((resolve, reject) => {
    if (isFriendshipWSConnected()) return resolve();
    const start = Date.now();
    const iv = setInterval(() => {
      if (isFriendshipWSConnected()) {
        clearInterval(iv);
        resolve();
      } else if (Date.now() - start > timeoutMs) {
        clearInterval(iv);
        reject(new Error("Timeout waiting for FriendshipWS to connect"));
      }
    }, 100);
  });
}
