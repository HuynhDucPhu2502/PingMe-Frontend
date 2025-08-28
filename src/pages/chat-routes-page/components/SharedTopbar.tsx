import { Button } from "@/components/ui/button.tsx";
import { Search, Users } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip.tsx";
import { UserLookupModal } from "./UserLookupModal.tsx";
import type { RoomResponse } from "@/types/room";

interface SharedTopBarProps {
  onFriendAdded?: () => void;
  setSelectedChat?: (room: RoomResponse) => void;
}

export function SharedTopBar({
  onFriendAdded,
  setSelectedChat,
}: SharedTopBarProps) {
  return (
    <TooltipProvider>
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-center space-x-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-gray-500 hover:text-purple-600 hover:bg-purple-50"
              >
                <Search className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Tìm kiếm</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <UserLookupModal
                onFriendAdded={onFriendAdded}
                setSelectedChat={setSelectedChat}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Thêm bạn</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-gray-500 hover:text-purple-600 hover:bg-purple-50"
              >
                <Users className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Tạo nhóm chat</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}
