import { User, LogOut, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppDispatch, useAppSelector } from "@/features/hooks";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { logout } from "@/features/slices/authThunk";
import { getUserInitials } from "@/utils/authFieldHandler";

const UserMenu = () => {
  const { userSession } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const [avatarVersion, setAvatarVersion] = useState(Date.now());

  const handleLogout = () => {
    dispatch(logout());
  };

  useEffect(() => {
    if (userSession?.updatedAt) {
      setAvatarVersion(Date.now());
    }
  }, [userSession?.updatedAt]);

  if (!userSession) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="group flex h-auto items-center gap-3 px-3 py-2 transition-colors hover:bg-purple-50"
        >
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 ring-2 ring-purple-100 transition-all group-hover:ring-purple-200">
              <AvatarImage
                src={
                  userSession.avatarUrl
                    ? `${userSession.avatarUrl}?v=${avatarVersion}`
                    : undefined
                }
                alt={userSession?.name || "User"}
              />
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-purple-600 font-semibold text-white">
                {getUserInitials(userSession?.name) || "U"}
              </AvatarFallback>
            </Avatar>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-72 p-2"
        sideOffset={5}
        alignOffset={-5}
      >
        {/* User Info Header */}
        <div className="mb-2 flex items-center gap-3 rounded-lg bg-gradient-to-r from-purple-50 to-purple-100 p-3">
          <Avatar className="h-12 w-12 ring-2 ring-white">
            <AvatarImage
              src={
                userSession.avatarUrl
                  ? `${userSession.avatarUrl}?v=${avatarVersion}`
                  : undefined
              }
              alt={userSession?.name || "User"}
            />
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-purple-600 font-semibold text-white">
              {userSession?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-gray-900">
              {userSession?.name || "User"}
            </p>
            <p className="truncate text-sm text-gray-600">
              {userSession?.email || "user@pingme.com"}
            </p>
          </div>
        </div>

        <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <Link
            to={"/profile/detail"}
            className="flex cursor-pointer items-center gap-3 rounded-lg w-full"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-100">
              <User className="h-4 w-4 text-purple-600" />
            </div>
            <div className="min-w-0">
              <p className="font-medium">Hồ sơ</p>
            </div>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Link
            to={"/security"}
            className="flex cursor-pointer items-center gap-3 rounded-lg w-full"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-100">
              <LockKeyhole className="h-4 w-4 text-purple-600" />
            </div>
            <div className="min-w-0">
              <p className="font-medium">Bảo mật</p>
            </div>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          className="flex cursor-pointer items-center gap-3 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100">
            <LogOut className="h-4 w-4 text-red-600" />
          </div>
          <div className="min-w-0">
            <p className="font-medium">Đăng xuất</p>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
