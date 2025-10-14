import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileText } from "lucide-react";
import type { BlogCategory, BlogReviewResponse } from "@/types/blog";
import { getUserInitials } from "@/utils/authFieldHandler";
import { EmptyState } from "@/components/custom/EmptyState";
import LoadingSpinner from "@/components/custom/LoadingSpinner";

const GRADIENT_COLORS = [
  "from-blue-500 to-purple-600",
  "from-green-500 to-teal-600",
  "from-orange-500 to-red-600",
  "from-pink-500 to-rose-600",
  "from-indigo-500 to-blue-600",
  "from-yellow-500 to-orange-600",
  "from-cyan-500 to-blue-600",
  "from-violet-500 to-purple-600",
];

const getGradientForBlog = (id: number): string => {
  return GRADIENT_COLORS[id % GRADIENT_COLORS.length];
};

const CATEGORY_LABELS: Record<BlogCategory, string> = {
  TECHNOLOGY: "Technology",
  LIFESTYLE: "Lifestyle",
  EDUCATION: "Education",
  BUSINESS: "Business",
  TRAVEL: "Travel",
  FOOD: "Food",
  ENTERTAINMENT: "Entertainment",
  OTHER: "Other",
};

interface BlogGridProps {
  blogs: BlogReviewResponse[];
  showApprovalStatus?: boolean;
  loading?: boolean;
}

export function BlogGrid({
  blogs,
  showApprovalStatus = false,
  loading = false,
}: BlogGridProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner className="h-12 w-12 text-primary" />
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="Không tìm thấy Blogs nào"
        description="Hãy tùy chỉnh lại bộ lọc của bạn."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[400px]">
      {blogs.map((blog) => (
        <Card
          key={blog.id}
          className="group cursor-pointer hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 overflow-hidden border-border/50 pt-0 px-0 pb-6"
        >
          <div className="relative h-48 overflow-hidden">
            {blog.imgPreviewUrl ? (
              <img
                src={blog.imgPreviewUrl || "/placeholder.svg"}
                alt={blog.title}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div
                className={`w-full h-full bg-gradient-to-br ${getGradientForBlog(
                  blog.id
                )} group-hover:scale-105 transition-transform duration-300`}
              />
            )}
          </div>

          <CardHeader className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <Badge
                variant="secondary"
                className="text-xs bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-300"
              >
                {CATEGORY_LABELS[blog.category]}
              </Badge>
              {showApprovalStatus && (
                <Badge
                  variant={blog.isApproved ? "default" : "outline"}
                  className="text-xs"
                >
                  {blog.isApproved ? "Đã duyệt" : "Chờ duyệt"}
                </Badge>
              )}
            </div>

            <h3 className="text-xl font-semibold text-foreground group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 line-clamp-2 text-balance">
              {blog.title}
            </h3>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground line-clamp-3 text-pretty">
              {blog.description}
            </p>

            <div className="flex items-center gap-3 pt-4 border-t border-purple-200/30 dark:border-purple-800/30">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={blog.user.avatarUrl || "/placeholder.svg"}
                  alt={blog.user.name}
                />
                <AvatarFallback>
                  {getUserInitials(blog.user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {blog.user.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {blog.user.email}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
