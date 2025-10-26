import type { UserSummaryResponse } from "../common/userSummary";

export type UpsertBlogCommentRequest = {
  content: string;
};

export type BlogCommentResponse = {
  id: number;
  content: string;
  user: UserSummaryResponse;
  createdAt: Date;
  updatedAt: Date;
};
