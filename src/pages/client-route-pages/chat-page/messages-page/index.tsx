import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Phone, Video, Info } from "lucide-react";
import { SharedTopBar } from "../components/SharedTopbar";
import { EmptyState } from "@/components/custom/EmptyState";

// Mock data for messages
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

const mockMessages = [
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
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Handle sending message
      setNewMessage("");
    }
  };

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
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage
                      src={selectedChatData?.avatar || "/placeholder.svg"}
                    />
                    <AvatarFallback className="bg-purple-100 text-purple-600">
                      {selectedChatData?.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {selectedChatData?.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {selectedChatData?.isOnline
                        ? "Đang hoạt động"
                        : "Offline"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-purple-600"
                  >
                    <Phone className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-purple-600"
                  >
                    <Video className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-purple-600"
                  >
                    <Info className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-purple-600"
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {mockMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "me" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${
                      message.sender === "me"
                        ? "flex-row-reverse space-x-reverse"
                        : ""
                    }`}
                  >
                    {message.sender === "other" && (
                      <Avatar className="w-8 h-8">
                        <AvatarImage
                          src={message.avatar || "/placeholder.svg"}
                        />
                        <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">
                          U
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`px-4 py-2 rounded-lg ${
                        message.sender === "me"
                          ? "bg-purple-600 text-white"
                          : "bg-gray-200 text-gray-900"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.sender === "me"
                            ? "text-purple-200"
                            : "text-gray-500"
                        }`}
                      >
                        {message.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Nhập tin nhắn..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Gửi
                </Button>
              </div>
            </div>
          </>
        ) : (
          <EmptyState
            title="Chọn một cuộc trò chuyện"
            description="Chọn một cuộc trò chuyện từ danh sách bên trái để bắt đầu nhắn tin"
          />
        )}
      </div>
    </div>
  );
}
