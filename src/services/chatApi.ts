import axiosClient from "@/lib/axiosClient.ts";
import type {
  ApiResponse,
  PageResponse,
  PaginationParams,
} from "@/types/apiResponse";
import type {
  MarkReadRequest,
  MessageResponse,
  SendMessageRequest,
} from "@/types/message";
import type { CreateOrGetDirectRoomRequest, RoomResponse } from "@/types/room";

export const createOrGetDirectRoom = (data: CreateOrGetDirectRoomRequest) => {
  return axiosClient.post<ApiResponse<RoomResponse>>("/rooms/direct", data);
};

export const getCurrentUserRooms = ({
  page = 0,
  size = 10,
}: PaginationParams) => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });

  return axiosClient.get<ApiResponse<PageResponse<RoomResponse>>>(
    `/rooms?${params.toString()}`
  );
};

export const sendMessage = (data: SendMessageRequest) => {
  return axiosClient.post<ApiResponse<MessageResponse>>("/messages/send", data);
};

export const markAsRead = (data: MarkReadRequest) => {
  return axiosClient.post<ApiResponse<MessageResponse>>("/messages/read", data);
};
