export interface ApiResponse<T> {
  errorCode: string;
  errorMessage: string;
  data: T;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface PaginationParams {
  page: number;
  size: number;
  filter: string | null;
}
