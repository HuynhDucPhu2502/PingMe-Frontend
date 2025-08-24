import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SharedTopBar } from "../components/SharedTopbar";
import { EmptyState } from "@/components/custom/EmptyState";
import { ChatBox } from "./components/ChatBox";

// Mock data for messages
interface Message {
  id: string;
  content: string;
  sender: "me" | "other";
  time: string;
  avatar?: string;
}

const mockChats = [
  {
    id: "1",
    name: "Nhóm Frontend",
    lastMessage: "Ai có thể review code không?",
    time: "2 phút",
    unread: 3,
    avatar: "/placeholder.svg?height=40&width=40",
    isGroup: true,
    isOnline: true,
  },
  {
    id: "2",
    name: "Minh Hoàng",
    lastMessage: "Ok, tôi sẽ gửi file cho bạn",
    time: "15 phút",
    unread: 0,
    avatar: "/placeholder.svg?height=40&width=40",
    isGroup: false,
    isOnline: true,
  },
  {
    id: "3",
    name: "Team Backend",
    lastMessage: "Database đã được update",
    time: "1 giờ",
    unread: 1,
    avatar: "/placeholder.svg?height=40&width=40",
    isGroup: true,
    isOnline: false,
  },
  {
    id: "4",
    name: "Lan Anh",
    lastMessage: "Cảm ơn bạn nhiều!",
    time: "3 giờ",
    unread: 0,
    avatar: "/placeholder.svg?height=40&width=40",
    isGroup: false,
    isOnline: false,
  },
];

const mockMessages: Message[] = [
  {
    id: "1",
    content: "Chào bạn! Bạn có rảnh không?",
    sender: "other",
    time: "14:30",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "2",
    content: "Có, tôi đang rảnh. Có gì vậy?",
    sender: "me",
    time: "14:32",
  },
  {
    id: "3",
    content: "Tôi muốn hỏi về dự án mới",
    sender: "other",
    time: "14:33",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "4",
    content: "Được thôi, bạn muốn hỏi gì?",
    sender: "me",
    time: "14:35",
  },
];

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState<string | null>("1");

  const selectedChatData = mockChats.find((chat) => chat.id === selectedChat);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Top Bar */}
        <SharedTopBar />

        {/* Chat Categories */}
        <div className="px-4 py-2 border-b border-gray-200">
          <div className="flex space-x-4">
            <button className="text-sm font-medium text-purple-600 border-b-2 border-purple-600 pb-2">
              Tất cả
            </button>
            <button className="text-sm font-medium text-gray-500 hover:text-gray-700 pb-2">
              Chưa đọc
            </button>
            <button className="text-sm font-medium text-gray-500 hover:text-gray-700 pb-2">
              Nhóm
            </button>
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {mockChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat.id)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                selectedChat === chat.id
                  ? "bg-purple-50 border-l-4 border-l-purple-600"
                  : ""
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={chat.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-purple-100 text-purple-600">
                      {chat.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {chat.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {chat.name}
                    </h3>
                    <span className="text-xs text-gray-500">{chat.time}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-gray-600 truncate">
                      {chat.lastMessage}
                    </p>
                    {chat.unread > 0 && (
                      <Badge className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                        {chat.unread}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Content Area */}
      {selectedChat && selectedChatData ? (
        <ChatBox selectedChat={selectedChatData} messages={mockMessages} />
      ) : (
        <EmptyState
          title="Chọn một cuộc trò chuyện"
          description="Chọn một cuộc trò chuyện từ danh sách bên trái để bắt đầu nhắn tin"
        />
      )}
    </div>
  );
}
