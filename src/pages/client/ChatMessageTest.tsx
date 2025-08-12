import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client/dist/sockjs";
import { Client } from "@stomp/stompjs";

type ChatMsg = { sender: string; content: string };

export default function ChatMessageTest() {
  const [name, setName] = useState("phu");
  const [text, setText] = useState("");
  const [logs, setLogs] = useState<ChatMsg[]>([]);
  const [connected, setConnected] = useState(false);
  const clientRef = useRef<Client | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  const getAccessToken = () => localStorage.getItem("access_token") ?? "";
  useEffect(() => {
    const token = getAccessToken();

    // Thiết lập kết nối WebSocket
    const socket = new SockJS(
      `${import.meta.env.VITE_BACKEND_BASE_URL}/ws?access_token=${token}`
    );

    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 3000,
      debug: () => {},
      connectHeaders: {
        Authorization: getAccessToken(),
      },
    });

    client.onConnect = () => {
      console.log("WebSocket connected");
      setConnected(true);
      client.subscribe("/topic/messages", (msg) => {
        const data = JSON.parse(msg.body);
        setLogs((prev) => [...prev, data]);
      });
    };

    // Xử lý ngắt kết nối
    client.onWebSocketClose = () => setConnected(false);
    client.onStompError = (frame) => {
      console.error("Broker error:", frame.headers["message"], frame.body);
    };

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, []);

  const send = () => {
    if (!clientRef.current?.connected || !text.trim()) return;
    const payload: ChatMsg = {
      sender: name || "anonymous",
      content: text.trim(),
    };
    clientRef.current.publish({
      destination: "/app/chat",
      body: JSON.stringify(payload),
    });
    setText("");
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") send();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 py-10 px-4">
      <div className="mx-auto w-full max-w-2xl">
        {/* Card */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 shadow-sm backdrop-blur p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                WS Chat (STOMP)
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Demo SockJS + STOMP với Spring
              </p>
            </div>
            <span
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
                connected
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-200 dark:border-emerald-800"
                  : "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-900/30 dark:text-rose-200 dark:border-rose-800"
              }`}
              aria-live="polite"
            >
              <span
                className={`size-2 rounded-full ${
                  connected ? "bg-emerald-500" : "bg-rose-500"
                }`}
              />
              {connected ? "Connected" : "Disconnected"}
            </span>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setName("phu")}
                className="rounded-xl border border-slate-300 dark:border-slate-700 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/70 transition"
                title="Reset name"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Message input */}
          <div className="flex items-center gap-3 mb-5">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Type a message and press Enter…"
              className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
            <button
              onClick={send}
              disabled={!connected || !text.trim()}
              className="inline-flex items-center justify-center rounded-xl bg-indigo-600 text-white px-5 py-3 text-sm font-medium shadow-sm transition hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>

          {/* Messages */}
          <div className="h-[48vh] min-h-64 w-full overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4">
            {logs.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Chưa có tin nhắn. Hãy gửi một tin đầu tiên!
              </p>
            ) : (
              <ul className="space-y-3">
                {logs.map((m, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-1 h-2.5 w-2.5 rounded-full bg-indigo-500" />
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                        {m.sender}
                      </div>
                      <div className="text-sm text-slate-700 dark:text-slate-200">
                        {m.content}
                      </div>
                    </div>
                  </li>
                ))}
                <div ref={endRef} />
              </ul>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">
          Tip: Nhấn{" "}
          <kbd className="rounded border px-1.5 py-0.5 text-[10px]">Enter</kbd>{" "}
          để gửi
        </p>
      </div>
    </div>
  );
}
