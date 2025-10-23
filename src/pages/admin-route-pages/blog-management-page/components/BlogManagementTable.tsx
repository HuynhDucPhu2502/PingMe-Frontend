"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Trash2, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { BlogReviewResponse } from "@/types/blog";
import { CATEGORY_LABELS } from "@/utils/blogFieldHandler";
import { formatRelativeTime } from "@/utils/dateFormatter";
import { Badge } from "@/components/ui/badge";

interface BlogManagementTableProps {
  blogs: BlogReviewResponse[];
  onDelete: (id: number) => void;
  onApprove: (id: number) => void;
}

export const BlogManagementTable = ({
  blogs,
  onDelete,
  onApprove,
}: BlogManagementTableProps) => {
  const navigate = useNavigate();

  const handleViewDetails = (id: number) => {
    window.open(`/blogs/${id}`, "_blank");
  };

  return (
    <div className="rounded-lg border border-purple-100 overflow-hidden bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-50 hover:to-pink-50">
            <TableHead className="font-semibold text-purple-900">
              Tiêu đề
            </TableHead>
            <TableHead className="font-semibold text-purple-900">
              Danh mục
            </TableHead>
            <TableHead className="font-semibold text-purple-900">
              Tác giả
            </TableHead>
            <TableHead className="font-semibold text-purple-900">
              Trạng thái
            </TableHead>
            <TableHead className="font-semibold text-purple-900">
              Ngày tạo
            </TableHead>
            <TableHead className="font-semibold text-purple-900 text-right">
              Hành động
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {blogs.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-8 text-muted-foreground"
              >
                Không có blog nào
              </TableCell>
            </TableRow>
          ) : (
            blogs.map((blog) => (
              <TableRow
                key={blog.id}
                className="hover:bg-purple-50/50 transition-colors"
              >
                <TableCell className="font-medium max-w-xs truncate">
                  {blog.title}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="border-purple-200 text-purple-700"
                  >
                    {CATEGORY_LABELS[blog.category]}
                  </Badge>
                </TableCell>
                <TableCell>{blog.user.name}</TableCell>
                <TableCell>
                  {blog.isApproved ? (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                      Đã duyệt
                    </Badge>
                  ) : (
                    <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
                      Chờ duyệt
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatRelativeTime(blog.createdAt)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetails(blog.id)}
                      className="h-8 w-8 p-0 hover:bg-purple-100 hover:text-purple-700"
                      title="Xem chi tiết"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(blog.id)}
                      className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-700"
                      title="Xóa"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    {!blog.isApproved && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onApprove(blog.id)}
                        className="h-8 w-8 p-0 hover:bg-green-100 hover:text-green-700"
                        title="Duyệt bài"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
