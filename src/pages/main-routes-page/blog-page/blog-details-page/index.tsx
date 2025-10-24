import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowUp } from "lucide-react";
import { getBlogDetailsById } from "@/services/blogApi";
import type { BlogDetailsResponse } from "@/types/blog";
import { getUserInitials } from "@/utils/authFieldHandler";
import { getErrorMessage } from "@/utils/errorMessageHandler";
import { toast } from "sonner";
import LoadingSpinner from "@/components/custom/LoadingSpinner";
import RichTextPreview from "@/components/custom/RichText/RichTextPreview";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { CATEGORY_LABELS, getGradientForBlog } from "@/utils/blogFieldHandler";

export default function BlogDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<BlogDetailsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const fetchBlogDetails = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const response = await getBlogDetailsById(Number(id));
        setBlog(response.data.data);
      } catch (error) {
        toast.error(getErrorMessage(error, "Không thể tải chi tiết blog"));
        navigate("/blogs");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogDetails();
  }, [id, navigate]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner className="h-12 w-12 text-primary" />
      </div>
    );
  }

  if (!blog) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 py-6">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/blogs")}
              className="text-white hover:bg-white/20 hover:text-white"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại
            </Button>
          </div>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    to="/blogs"
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    Blog
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-white/60" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-white font-bold line-clamp-1">
                  {blog.title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Blog Header */}
          <div className="space-y-6 mb-8">
            {/* Category Badge */}
            <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-300">
              {CATEGORY_LABELS[blog.category]}
            </Badge>

            {/* Title */}
            <h1 className="text-4xl font-bold text-foreground leading-tight line-clamp-2 text-balance break-words">
              {blog.title}
            </h1>

            {/* Description */}
            <p className="text-lg text-muted-foreground line-clamp-3 text-pretty break-words">
              {blog.description}
            </p>

            {/* Author Info */}
            <div className="flex items-center gap-4 py-4 border-y border-border">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={blog.user.avatarUrl || "/placeholder.svg"}
                  alt={blog.user.name}
                />
                <AvatarFallback>
                  {getUserInitials(blog.user.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-foreground">
                  {blog.user.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {blog.user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="mb-8 rounded-lg overflow-hidden">
            {blog.imgPreviewUrl ? (
              <img
                src={blog.imgPreviewUrl || "/placeholder.svg"}
                alt={blog.title}
                className="w-full h-[400px] object-cover"
              />
            ) : (
              <div
                className={`w-full h-[400px] bg-gradient-to-br ${getGradientForBlog(
                  blog.id
                )}`}
              />
            )}
          </div>

          {/* Blog Content */}
          <div className="prose prose-xl max-w-none dark:prose-invert [&_p]:text-lg [&_p]:leading-relaxed [&_li]:text-lg">
            <RichTextPreview content={blog.content} />
          </div>
        </div>
      </div>

      {/* Floating Scroll-to-Top Button */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 h-12 w-12 rounded-full shadow-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white z-50"
          size="icon"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}
