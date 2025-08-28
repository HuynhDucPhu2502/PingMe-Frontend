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

export const createOrGetDirectRoomApi = (
  data: CreateOrGetDirectRoomRequest
) => {
  return axiosClient.post<ApiResponse<RoomResponse>>("/rooms/direct", data);
};

export const getCurrentUserRoomsApi = ({
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

export const sendMessageApi = (data: SendMessageRequest) => {
  return axiosClient.post<ApiResponse<MessageResponse>>("/messages/send", data);
};

export const markAsReadApi = (data: MarkReadRequest) => {
  return axiosClient.post<ApiResponse<MessageResponse>>("/messages/read", data);
};

export const getHistoryMessagesApi = (
  roomId: number,
  beforeId?: number,
  size: number = 20
) => {
  const params = new URLSearchParams();
  params.append("roomId", roomId.toString());
  params.append("size", size.toString());
  if (beforeId !== undefined) {
    params.append("beforeId", beforeId.toString());
  }

  return axiosClient.get<ApiResponse<MessageResponse[]>>(
    `/messages/history?${params.toString()}`
  );
};
