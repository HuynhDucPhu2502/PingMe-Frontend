"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, CheckCircle, XCircle } from "lucide-react";
import { getUserInitials } from "@/utils/authFieldHandler";
import type { BlogReviewResponse } from "@/types/blog";

// Mock data
const mockBlogs: BlogReviewResponse[] = [
  {
    id: 1,
    title: "Hướng dẫn sử dụng React Hooks",
    description:
      "Tìm hiểu cách sử dụng React Hooks hiệu quả trong dự án của bạn",
    category: "TECHNOLOGY",
    isApproved: true,
    user: {
      id: 1,
      email: "user1@example.com",
      name: "Nguyễn Văn A",
      avatarUrl: "",
      friendshipSummary: null,
    },
  },
  {
    id: 2,
    title: "10 mẹo để sống khỏe mỗi ngày",
    description: "Những thói quen đơn giản giúp bạn cải thiện sức khỏe",
    category: "LIFESTYLE",
    isApproved: false,
    user: {
      id: 2,
      email: "user2@example.com",
      name: "Trần Thị B",
      avatarUrl: "",
      friendshipSummary: null,
    },
  },
  {
    id: 3,
    title: "Khởi nghiệp thành công với ý tưởng độc đáo",
    description: "Bí quyết để biến ý tưởng thành doanh nghiệp thành công",
    category: "BUSINESS",
    isApproved: false,
    user: {
      id: 3,
      email: "user3@example.com",
      name: "Lê Văn C",
      avatarUrl: "",
      friendshipSummary: null,
    },
  },
  {
    id: 4,
    title: "Du lịch Đà Lạt tự túc",
    description: "Hướng dẫn chi tiết cho chuyến du lịch Đà Lạt tiết kiệm",
    category: "TRAVEL",
    isApproved: true,
    user: {
      id: 4,
      email: "user4@example.com",
      name: "Phạm Thị D",
      avatarUrl: "",
      friendshipSummary: null,
    },
  },
];

const categoryLabels: Record<string, string> = {
  TECHNOLOGY: "Công nghệ",
  LIFESTYLE: "Lối sống",
  EDUCATION: "Giáo dục",
  BUSINESS: "Kinh doanh",
  TRAVEL: "Du lịch",
  FOOD: "Ẩm thực",
  ENTERTAINMENT: "Giải trí",
  OTHER: "Khác",
};

export default function BlogManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [blogs, setBlogs] = useState(mockBlogs);

  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApprove = (blogId: number) => {
    setBlogs((prev) =>
      prev.map((blog) =>
        blog.id === blogId ? { ...blog, isApproved: true } : blog
      )
    );
  };

  const handleReject = (blogId: number) => {
    setBlogs((prev) =>
      prev.map((blog) =>
        blog.id === blogId ? { ...blog, isApproved: false } : blog
      )
    );
  };

  return (
    <div className="flex-1 overflow-auto">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý blog</h1>
        <p className="text-gray-600 mt-1">Duyệt và quản lý các bài viết blog</p>
      </div>

      {/* Content */}
      <div className="p-8">
        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Tìm kiếm theo tiêu đề..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tiêu đề
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tác giả
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Danh mục
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBlogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="max-w-md">
                        <div className="font-medium text-gray-900">
                          {blog.title}
                        </div>
                        <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {blog.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarImage
                            src={blog.user.avatarUrl || "/placeholder.svg"}
                          />
                          <AvatarFallback className="text-xs">
                            {getUserInitials(blog.user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-900">
                          {blog.user.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="outline">
                        {categoryLabels[blog.category]}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {blog.isApproved ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          Đã duyệt
                        </Badge>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                          Chờ duyệt
                        </Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        {!blog.isApproved && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleApprove(blog.id)}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Duyệt
                          </Button>
                        )}
                        {blog.isApproved && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReject(blog.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Hủy duyệt
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
