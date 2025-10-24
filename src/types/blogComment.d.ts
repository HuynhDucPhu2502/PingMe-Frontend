import type { UserSummaryResponse } from "./userSummary";

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
