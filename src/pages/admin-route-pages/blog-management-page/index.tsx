import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "../components/PageHeader";
import { BlogSearchFilters } from "./components/BlogSearchFilters";
import { BlogManagementTable } from "./components/BlogManagementTable";
import Pagination from "@/components/custom/Pagination";
import { getAllBlogs } from "@/services/blogApi";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/errorMessageHandler";
import { useDebounce } from "@/hooks/use-debounce";
import { usePagination } from "@/hooks/use-pagination";
import type { BlogReviewResponse } from "@/types/blog";
import LoadingSpinner from "@/components/custom/LoadingSpinner";

export default function BlogManagementPage() {
  const [blogs, setBlogs] = useState<BlogReviewResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
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
  } = usePagination(10);

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

      if (selectedStatus !== "all") {
        const isApproved = selectedStatus === "approved";
        filters.push(`isApproved = ${isApproved}`);
      }

      const filter = filters.length > 0 ? filters.join(" and ") : undefined;

      const response = await getAllBlogs({
        page: currentPage - 1, // API uses 0-based indexing
        size: itemsPerPage,
        filter,
      });

      setBlogs(response.data.data.content);
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
    selectedStatus,
    currentPage,
    itemsPerPage,
    setTotalElements,
    setTotalPages,
  ]);

  useEffect(() => {
    resetPagination();
  }, [debouncedSearchQuery, selectedCategory, selectedStatus, resetPagination]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleDelete = (blogId: number) => {
    console.log("Delete blog:", blogId);
  };

  const handleApprove = (blogId: number) => {
    console.log("Approve blog:", blogId);
  };

  return (
    <div className="flex-1 overflow-auto">
      <PageHeader
        title="Quản lý blog"
        description="Duyệt và quản lý các bài viết blog"
      />

      <BlogSearchFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
      />

      {/* Content */}
      <div className="p-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            <BlogManagementTable
              blogs={blogs}
              onDelete={handleDelete}
              onApprove={handleApprove}
            />

            {blogs.length > 0 && (
              <div className="mt-6">
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
          </>
        )}
      </div>
    </div>
  );
}
