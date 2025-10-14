"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import type { BlogReviewResponse } from "@/types/blog";
import { useSelector } from "react-redux";
import type { RootState } from "@/features/store";
import { HeroSection } from "./components/HeroSection";
import { SearchAndFilterSection } from "./components/SearchAndFilterSection";
import { BlogGrid } from "./components/BlogGrid";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAllApprovedBlogs } from "@/services/blogApi";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/use-debounce";
import { usePagination } from "@/hooks/use-pagination";
import Pagination from "@/components/custom/Pagination";
import { getErrorMessage } from "@/utils/errorMessageHandler";

const MOCK_MY_BLOGS: BlogReviewResponse[] = [];

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"all" | "my">("all");
  const [allBlogs, setAllBlogs] = useState<BlogReviewResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const {
    currentPage,
    itemsPerPage,
    totalElements,
    totalPages,
    setCurrentPage,
    setItemsPerPage,
    setTotalElements,
    setTotalPages,
    resetPagination,
  } = usePagination(20);

  const { isLogin } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const fetchBlogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const filters: string[] = [];

      if (debouncedSearchQuery.trim()) {
        filters.push(`title ~ '*${debouncedSearchQuery.trim()}*'`);
      }

      if (selectedCategory !== "all") {
        filters.push(`category = '${selectedCategory}'`);
      }

      const filter = filters.length > 0 ? filters.join(" and ") : undefined;

      const response = await getAllApprovedBlogs({
        page: currentPage - 1,
        size: itemsPerPage,
        filter,
      });

      setAllBlogs(response.data.data.content);
      setTotalElements(response.data.data.totalElements);
      setTotalPages(response.data.data.totalPages);
    } catch (error) {
      toast.error(getErrorMessage(error, "Không thể tải danh sách blog"));
    } finally {
      setIsLoading(false);
    }
  }, [
    debouncedSearchQuery,
    selectedCategory,
    currentPage,
    itemsPerPage,
    setTotalElements,
    setTotalPages,
  ]);

  useEffect(() => {
    if (activeTab === "all") {
      resetPagination();
    }
  }, [debouncedSearchQuery, selectedCategory, activeTab, resetPagination]);

  useEffect(() => {
    if (activeTab === "all") {
      fetchBlogs();
    }
  }, [activeTab, currentPage, itemsPerPage, fetchBlogs]);

  const displayBlogs = activeTab === "all" ? allBlogs : MOCK_MY_BLOGS;

  return (
    <div className="min-h-screen bg-background">
      <HeroSection />

      {isLogin && (
        <div className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur-md shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between py-2">
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="lg"
                  className={`rounded-lg px-6 py-3 font-semibold transition-all ${
                    activeTab === "all"
                      ? "bg-primary text-primary-foreground shadow-md hover:bg-primary/90"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                  onClick={() => setActiveTab("all")}
                >
                  Tất cả bài viết
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  className={`rounded-lg px-6 py-3 font-semibold transition-all ${
                    activeTab === "my"
                      ? "bg-primary text-primary-foreground shadow-md hover:bg-primary/90"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                  onClick={() => setActiveTab("my")}
                >
                  Bài viết của tôi
                </Button>
              </div>
              <Button
                onClick={() => navigate("/blogs/create")}
                className="gap-2"
                size="lg"
              >
                <Plus className="h-5 w-5" />
                Tạo Blog
              </Button>
            </div>
          </div>
        </div>
      )}

      <SearchAndFilterSection
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Blog Grid */}
      <div className="container mx-auto px-4 py-12">
        <BlogGrid
          blogs={displayBlogs}
          showApprovalStatus={activeTab === "my"}
          loading={isLoading}
        />

        {activeTab === "all" && !isLoading && allBlogs.length > 0 && (
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
              totalElements={totalElements}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
              showItemsPerPageSelect={true}
            />
          </div>
        )}
      </div>
    </div>
  );
}
