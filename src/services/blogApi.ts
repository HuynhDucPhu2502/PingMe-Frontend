import axiosClient from "@/lib/axiosClient";
import type {
  ApiResponse,
  PageResponse,
  PaginationParams,
} from "@/types/apiResponse";
import type { BlogDetailsResponse, BlogReviewResponse } from "@/types/blog";

export const saveBlog = (data: FormData) => {
  return axiosClient.post<ApiResponse<BlogReviewResponse>>("/blogs", data);
};

export const getBlogDetailsById = (id: number) => {
  return axiosClient.get<ApiResponse<BlogDetailsResponse>>(
    `/blogs/details/${id}`
  );
};

export const getAllApprovedBlogs = ({
  page = 0,
  size = 10,
  filter,
}: PaginationParams) => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });

  if (filter) params.append("filter", filter);

  return axiosClient.get<ApiResponse<PageResponse<BlogReviewResponse>>>(
    `/blogs/approved?${params.toString()}`
  );
};

export const getCurrentUserBlogs = ({
  page = 0,
  size = 10,
  filter,
}: PaginationParams) => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });

  if (filter) params.append("filter", filter);

  return axiosClient.get<ApiResponse<PageResponse<BlogReviewResponse>>>(
    `/blogs/me?${params.toString()}`
  );
};
