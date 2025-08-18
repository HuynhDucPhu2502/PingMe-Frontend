import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Users,
  UserPlus,
  Users2,
  MoreHorizontal,
  Filter,
  ArrowUpDown,
} from "lucide-react";
import { EmptyState } from "@/components/custom/EmptyState";

// Mock data
const contactCategories = [
  {
    id: "friends",
    name: "Danh sách bạn bè",
    icon: Users,
    count: 98,
  },
  {
    id: "groups",
    name: "Danh sách nhóm và cộng đồng",
    icon: Users2,
    count: 12,
  },
  {
    id: "friend-requests",
    name: "Lời mời kết bạn",
    icon: UserPlus,
    count: 3,
  },
  {
    id: "group-invites",
    name: "Lời mời vào nhóm và cộng đồng",
    icon: Users2,
    count: 1,
  },
];

const contacts = [
  {
    id: "1",
    name: "An",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
    category: "friends",
    letter: "A",
  },
  {
    id: "2",
    name: "An Võ",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "offline",
    category: "friends",
    letter: "A",
  },
  {
    id: "3",
    name: "Anh Thu",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "offline",
    category: "friends",
    letter: "A",
  },
  {
    id: "4",
    name: "Ba",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "offline",
    category: "friends",
    letter: "B",
  },
  {
    id: "5",
    name: "Bảo Nhi",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
    category: "friends",
    letter: "B",
  },
  {
    id: "6",
    name: "Cao Minh",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "offline",
    category: "friends",
    letter: "C",
  },
  {
    id: "7",
    name: "Dương Văn Nam",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
    category: "friends",
    letter: "D",
  },
];

const groups = [
  {
    id: "g1",
    name: "Nhóm Lập Trình",
    avatar: "/placeholder.svg?height=40&width=40",
    memberCount: 25,
    category: "groups",
  },
  {
    id: "g2",
    name: "Gia Đình",
    avatar: "/placeholder.svg?height=40&width=40",
    memberCount: 8,
    category: "groups",
  },
];

export default function ContactsPage() {
  const [selectedCategory, setSelectedCategory] = useState("friends");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [filterBy, setFilterBy] = useState("all");

  const selectedCategoryData = contactCategories.find(
    (cat) => cat.id === selectedCategory
  );

  const getFilteredData = () => {
    if (selectedCategory === "friends") {
      let filtered = contacts.filter((contact) =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

      if (filterBy === "online") {
        filtered = filtered.filter((contact) => contact.status === "online");
      }

      return filtered.sort((a, b) => {
        if (sortBy === "name") return a.name.localeCompare(b.name);
        return 0;
      });
    } else if (selectedCategory === "groups") {
      return groups.filter((group) =>
        group.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return [];
  };

  const groupedContacts = () => {
    if (selectedCategory !== "friends") return {};

    const filtered = getFilteredData();
    return filtered.reduce((acc: any, contact: any) => {
      const letter = contact.letter;
      if (!acc[letter]) acc[letter] = [];
      acc[letter].push(contact);
      return acc;
    }, {});
  };

  return (
    <div className="flex h-full">
      {/* Left Sidebar - Categories */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Danh bạ</h2>
            <Button variant="ghost" size="sm" className="text-gray-500">
              <Search className="w-4 h-4" />
            </Button>
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
        </div>

        {/* Categories List */}
        <div className="flex-1 overflow-y-auto">
          {contactCategories.map((category) => (
            <div
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${
                selectedCategory === category.id
                  ? "bg-purple-50 border-l-4 border-purple-500"
                  : ""
              }`}
            >
              <category.icon
                className={`w-5 h-5 mr-3 ${
                  selectedCategory === category.id
                    ? "text-purple-600"
                    : "text-gray-400"
                }`}
              />
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{category.name}</h3>
                <p className="text-sm text-gray-500">({category.count})</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Content - Contact List */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              {selectedCategoryData && (
                <>
                  <selectedCategoryData.icon className="w-5 h-5 mr-2 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedCategoryData.name}
                  </h3>
                </>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="text-gray-500">
                <Search className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-500">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {selectedCategory === "friends" && (
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Bạn bè ({contacts.length})
              </div>

              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Input
                    placeholder="Tìm bạn"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 w-48 h-8 text-sm"
                  />
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-32 h-8 text-sm">
                    <ArrowUpDown className="w-3 h-3 mr-1" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Tên (A-Z)</SelectItem>
                    <SelectItem value="recent">Gần đây</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterBy} onValueChange={setFilterBy}>
                  <SelectTrigger className="w-24 h-8 text-sm">
                    <Filter className="w-3 h-3 mr-1" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          {selectedCategory === "friends" ? (
            <div className="p-4">
              {Object.keys(groupedContacts()).length === 0 ? (
                <EmptyState
                  icon={<Users className="w-16 h-16" />}
                  title="Không tìm thấy bạn bè"
                  description="Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc."
                />
              ) : (
                Object.entries(groupedContacts()).map(
                  ([letter, contacts]: [string, any]) => (
                    <div key={letter} className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3 sticky top-0 bg-gray-50 py-2">
                        {letter}
                      </h4>
                      <div className="space-y-2">
                        {contacts.map((contact: any) => (
                          <div
                            key={contact.id}
                            className="flex items-center p-3 bg-white rounded-lg hover:shadow-sm cursor-pointer"
                          >
                            <div className="relative">
                              <Avatar className="w-12 h-12">
                                <AvatarImage
                                  src={contact.avatar || "/placeholder.svg"}
                                />
                                <AvatarFallback className="bg-purple-100 text-purple-600">
                                  {contact.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              {contact.status === "online" && (
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                              )}
                            </div>
                            <div className="flex-1 ml-3">
                              <h3 className="font-medium text-gray-900">
                                {contact.name}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {contact.status === "online"
                                  ? "Đang hoạt động"
                                  : "Không hoạt động"}
                              </p>
                            </div>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )
              )}
            </div>
          ) : selectedCategory === "groups" ? (
            <div className="p-4">
              <div className="space-y-2">
                {groups.map((group) => (
                  <div
                    key={group.id}
                    className="flex items-center p-3 bg-white rounded-lg hover:shadow-sm cursor-pointer"
                  >
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={group.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-purple-100 text-purple-600">
                        {group.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 ml-3">
                      <h3 className="font-medium text-gray-900">
                        {group.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {group.memberCount} thành viên
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <EmptyState
                icon={<UserPlus className="w-16 h-16" />}
                title="Chưa có dữ liệu"
                description="Tính năng này đang được phát triển."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
