import type { UserSummaryResponse } from "./userSummary";

export const BLOG_CATEGORIES = [
  "TECHNOLOGY",
  "LIFESTYLE",
  "EDUCATION",
  "BUSINESS",
  "TRAVEL",
  "FOOD",
  "ENTERTAINMENT",
  "OTHER",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export const isBlogCategory = (v: string): v is BlogCategory =>
  (BLOG_CATEGORIES as readonly string[]).includes(v);

export interface BlogReviewResponse {
  id: number;
  title: string;
  description: string;
  category: BlogCategory;
  user: UserSummaryResponse;
  imgPreviewUrl?: string;
  isApproved: boolean;
}

export interface BlogDetailsResponse {
  id: number;
  title: string;
  description: string;
  category: BlogCategory;
  user: UserSummaryResponse;
  imgPreviewUrl?: string;
  isApproved: boolean;
  content: string;
}

export interface UpsertBlogRequest {
  title: string;
  description: string;
  content: string;
  category: BlogCategory;
}
