import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Send, Smile, Paperclip, MoreHorizontal } from "lucide-react";
import { EmptyState } from "@/components/custom/EmptyState";
import { MessageCircle } from "lucide-react"; // Import MessageCircle

// Mock data
const chatRooms = [
  {
    id: "5",
    name: "Lập Trình Di Động_7-9_CN",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Thạch Nguyên đã tham gia nhóm",
    time: "7 giờ",
    unreadCount: 48,
    isGroup: true,
    isOnline: false,
  },
  {
    id: "8",
    name: "Nhóm 10 WWW Spring",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Bạn: 📷 btw t làm xong cái đổi avatar...",
    time: "22 giờ",
    unreadCount: 5,
    isGroup: true,
    isOnline: false,
  },
];

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageInput, setMessageInput] = useState("");

  const filteredChats = chatRooms.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedChatData = chatRooms.find((chat) => chat.id === selectedChat);

  return (
    <div className="flex h-full">
      {/* Left Sidebar - Chat List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Tin nhắn</h2>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="text-gray-500">
                <Search className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-500">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Tìm kiếm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-50 border-gray-200"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex mt-3 space-x-1">
            <Button
              variant="ghost"
              size="sm"
              className="text-purple-600 bg-purple-50 hover:bg-purple-100"
            >
              Tất cả
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:bg-gray-100"
            >
              Chưa đọc
            </Button>
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat.id)}
              className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${
                selectedChat === chat.id
                  ? "bg-purple-50 border-l-4 border-purple-500"
                  : ""
              }`}
            >
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

              <div className="flex-1 ml-3 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900 truncate">
                    {chat.name}
                  </h3>
                  <span className="text-xs text-gray-500">{chat.time}</span>
                </div>
                <p className="text-sm text-gray-600 truncate mt-1">
                  {chat.lastMessage}
                </p>
              </div>

              {chat.unreadCount > 0 && (
                <Badge className="bg-red-500 text-white ml-2 min-w-[20px] h-5 flex items-center justify-center text-xs">
                  {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
                </Badge>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right Content - Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChatData ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar className="w-10 h-10">
                    <AvatarImage
                      src={selectedChatData.avatar || "/placeholder.svg"}
                    />
                    <AvatarFallback className="bg-purple-100 text-purple-600">
                      {selectedChatData.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-3">
                    <h3 className="font-medium text-gray-900">
                      {selectedChatData.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {selectedChatData.isOnline
                        ? "Đang hoạt động"
                        : "Hoạt động 2 giờ trước"}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 bg-gray-50 overflow-y-auto">
              <div className="text-center text-gray-500 text-sm mb-4">
                Hôm nay
              </div>

              {/* Sample messages */}
              <div className="space-y-4">
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-lg shadow-sm max-w-xs">
                    <p className="text-gray-800">
                      Xin chào! Bạn có khỏe không?
                    </p>
                    <span className="text-xs text-gray-500 mt-1 block">
                      14:30
                    </span>
                  </div>
                </div>

                <div className="flex justify-end">
                  <div className="bg-purple-600 text-white p-3 rounded-lg shadow-sm max-w-xs">
                    <p>Tôi khỏe, cảm ơn bạn! Bạn thì sao?</p>
                    <span className="text-xs text-purple-200 mt-1 block">
                      14:32
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Message Input */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="text-gray-500">
                  <Paperclip className="w-5 h-5" />
                </Button>
                <div className="flex-1 relative">
                  <Input
                    placeholder="Nhập tin nhắn..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    className="pr-10"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  >
                    <Smile className="w-4 h-4 text-gray-500" />
                  </Button>
                </div>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <EmptyState
              icon={<MessageCircle className="w-16 h-16" />}
              title="Chào mừng đến với PingMe!"
              description="Khám phá những tiện ích hỗ trợ làm việc và trò chuyện cùng người thân, bạn bè được tối ưu hóa cho máy tính của bạn."
            />
          </div>
        )}
      </div>
    </div>
  );
}
