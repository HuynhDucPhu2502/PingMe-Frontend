import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MoreHorizontal,
  Search,
  Users,
  UserPlus,
  UserCheck,
} from "lucide-react";
import { SharedTopBar } from "../components/SharedTopbar";

// Mock data for contacts organized by categories
const mockContacts = [
  // Recent contacts
  {
    id: "recent-1",
    name: "Minh Hoàng",
    email: "minh.hoang@example.com",
    phone: "+84 123 456 789",
    avatar: "/placeholder.svg?height=40&width=40",
    isOnline: true,
    lastSeen: "Đang hoạt động",
    mutualFriends: 5,
    category: "recent",
    letter: "M",
  },
  {
    id: "recent-2",
    name: "Thu Hà",
    email: "thu.ha@example.com",
    phone: "+84 987 654 321",
    avatar: "/placeholder.svg?height=40&width=40",
    isOnline: false,
    lastSeen: "2 giờ trước",
    mutualFriends: 3,
    category: "recent",
    letter: "T",
  },
  // A
  {
    id: "a-1",
    name: "An Nguyễn",
    email: "an.nguyen@example.com",
    phone: "+84 555 123 456",
    avatar: "/placeholder.svg?height=40&width=40",
    isOnline: true,
    lastSeen: "Đang hoạt động",
    mutualFriends: 8,
    category: "friends",
    letter: "A",
  },
  {
    id: "a-2",
    name: "Anh Tuấn",
    email: "anh.tuan@example.com",
    phone: "+84 777 888 999",
    avatar: "/placeholder.svg?height=40&width=40",
    isOnline: false,
    lastSeen: "1 ngày trước",
    mutualFriends: 2,
    category: "friends",
    letter: "A",
  },
  {
    id: "a-3",
    name: "Ánh Dương",
    email: "anh.duong@example.com",
    phone: "+84 333 444 555",
    avatar: "/placeholder.svg?height=40&width=40",
    isOnline: true,
    lastSeen: "Đang hoạt động",
    mutualFriends: 6,
    category: "friends",
    letter: "A",
  },
  // B
  {
    id: "b-1",
    name: "Bảo Trâm",
    email: "bao.tram@example.com",
    phone: "+84 666 777 888",
    avatar: "/placeholder.svg?height=40&width=40",
    isOnline: false,
    lastSeen: "3 giờ trước",
    mutualFriends: 4,
    category: "friends",
    letter: "B",
  },
  {
    id: "b-2",
    name: "Bình An",
    email: "binh.an@example.com",
    phone: "+84 999 000 111",
    avatar: "/placeholder.svg?height=40&width=40",
    isOnline: true,
    lastSeen: "Đang hoạt động",
    mutualFriends: 7,
    category: "friends",
    letter: "B",
  },
  // C
  {
    id: "c-1",
    name: "Cẩm Ly",
    email: "cam.ly@example.com",
    phone: "+84 222 333 444",
    avatar: "/placeholder.svg?height=40&width=40",
    isOnline: false,
    lastSeen: "5 giờ trước",
    mutualFriends: 3,
    category: "friends",
    letter: "C",
  },
  {
    id: "c-2",
    name: "Công Phượng",
    email: "cong.phuong@example.com",
    phone: "+84 111 222 333",
    avatar: "/placeholder.svg?height=40&width=40",
    isOnline: true,
    lastSeen: "Đang hoạt động",
    mutualFriends: 9,
    category: "friends",
    letter: "C",
  },
];

const sidebarItems = [
  {
    id: "friends",
    title: "Danh sách bạn bè",
    icon: Users,
    count: 99,
    isActive: true,
  },
  {
    id: "groups",
    title: "Danh sách nhóm và cộng đồng",
    icon: Users,
    count: 12,
    isActive: false,
  },
  {
    id: "friend-requests",
    title: "Lời mời kết bạn",
    icon: UserPlus,
    count: 3,
    isActive: false,
  },
  {
    id: "group-invites",
    title: "Lời mời vào nhóm và cộng đồng",
    icon: UserCheck,
    count: 1,
    isActive: false,
  },
];

export default function ContactsPage() {
  const [activeCategory, setActiveCategory] = useState("friends");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");

  // Group contacts by letter for alphabetical display
  const groupedContacts = mockContacts
    .filter((contact) => contact.category === activeCategory)
    .filter(
      (contact) =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .reduce((groups, contact) => {
      const letter = contact.letter;
      if (!groups[letter]) {
        groups[letter] = [];
      }
      groups[letter].push(contact);
      return groups;
    }, {} as Record<string, typeof mockContacts>);

  // Add recent contacts section
  const recentContacts = mockContacts.filter(
    (contact) => contact.category === "recent"
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Top Bar */}
        <SharedTopBar />

        {/* Sidebar Navigation */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveCategory(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeCategory === item.id
                    ? "bg-purple-100 text-purple-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="flex-1">{item.title}</span>
                {item.count > 0 && (
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      activeCategory === item.id
                        ? "bg-purple-200 text-purple-800"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Content - Contact List */}
      <div className="flex-1 bg-white flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Bạn bè (
              {mockContacts.filter((c) => c.category === activeCategory).length}
              )
            </h2>
          </div>

          {/* Search and Filters */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Tìm bạn"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200"
              />
            </div>

            <div className="flex space-x-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="flex-1 bg-gray-50 border-gray-200">
                  <SelectValue placeholder="Tên (A-Z)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Tên (A-Z)</SelectItem>
                  <SelectItem value="recent">Gần đây</SelectItem>
                  <SelectItem value="online">Đang online</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="all">
                <SelectTrigger className="flex-1 bg-gray-50 border-gray-200">
                  <SelectValue placeholder="Tất cả" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="online">Đang online</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Contact List */}
        <div className="flex-1 overflow-y-auto">
          {/* Recent Contacts */}
          {recentContacts.length > 0 && (
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-3">
                Bạn mới
              </h3>
              {recentContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-gray-50 group"
                >
                  <div className="relative">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={contact.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-purple-100 text-purple-600 text-sm">
                        {contact.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {contact.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {contact.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {contact.lastSeen}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Alphabetical Groups */}
          {Object.entries(groupedContacts)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([letter, contacts]) => (
              <div key={letter} className="p-4">
                <h3 className="text-sm font-medium text-gray-500 mb-3">
                  {letter}
                </h3>
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-gray-50 group"
                  >
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarImage
                          src={contact.avatar || "/placeholder.svg"}
                        />
                        <AvatarFallback className="bg-purple-100 text-purple-600 text-sm">
                          {contact.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {contact.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {contact.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {contact.lastSeen}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
