import axiosClient from "@/lib/axiosClient.ts";
import type {
  ApiResponse,
  PageResponse,
  PaginationParams,
} from "@/types/common/apiResponse";
import type {
  HistoryMessageResponse,
  MarkReadRequest,
  MessageResponse,
  SendMessageRequest,
} from "@/types/chat/message";
import type {
  CreateOrGetDirectRoomRequest,
  RoomResponse,
} from "@/types/chat/room";

// ==================================================================================
// Rooms Service
// ==================================================================================

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

// ==================================================================================
// Messages Service
// ==================================================================================

export const sendMessageApi = (data: SendMessageRequest) => {
  return axiosClient.post<ApiResponse<MessageResponse>>("/messages/send", data);
};

export const sendFileMessageApi = (data: FormData) => {
  return axiosClient.post<ApiResponse<MessageResponse>>(
    "/messages/files",
    data
  );
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

  return axiosClient.get<ApiResponse<HistoryMessageResponse>>(
    `/messages/history?${params.toString()}`
  );
};
