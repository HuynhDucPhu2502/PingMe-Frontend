import { useAppSelector } from "@/features/hooks";
import { User, Key, Monitor, X } from "lucide-react";
import { Navigate, NavLink, Outlet, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserInitials } from "@/utils/authFieldHandler";

const navigationItems = [
  {
    title: "Thông tin cá nhân",
    icon: User,
    href: "user-info",
    description: "Quản lý thông tin cá nhân của bạn",
  },
  {
    title: "Thay đổi mật khẩu",
    icon: Key,
    href: "change-password",
    description: "Bảo mật tài khoản với mật khẩu mới",
  },
  {
    title: "Quản lý thiết bị",
    icon: Monitor,
    href: "device-management",
    description: "Xem và quản lý các thiết bị đăng nhập",
  },
  {
    title: "Xóa tài khoản",
    icon: X,
    href: "delete-account",
    description: "Xóa vĩnh viễn tài khoản của bạn",
    isDestructive: true,
  },
];

export default function UserPage() {
  const { isLogin, userSession } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!isLogin || !userSession)
    return <Navigate to="/auth?mode=login" replace />;

  // Get current active item
  const currentPath = location.pathname.split("/").pop();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-48 relative overflow-hidden min-h-[300px]">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/bg_office.jpg')" }}
        />
        <div className="absolute inset-0 bg-purple-600/40"></div>

        <div className="relative z-30 flex flex-col items-center justify-center h-full text-white">
          <div className="relative">
            <Avatar className="h-20 w-20 ring-2 ring-white mb-4">
              <AvatarImage
                src={
                  userSession.avatarUrl ? `${userSession.avatarUrl}` : undefined
                }
                alt={userSession?.name || "User"}
              />
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-purple-600 font-semibold text-white">
                {getUserInitials(userSession?.name)}
              </AvatarFallback>
            </Avatar>
          </div>
          <h1 className="text-xl font-semibold drop-shadow-sm ">
            {userSession?.name || "Người dùng"}
          </h1>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto -mt-16 relative z-40 px-4">
        <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
          <div className="flex">
            {/* Sidebar */}
            <div className="w-80 border-r border-gray-200">
              <nav className="p-0">
                <ul className="space-y-0">
                  {navigationItems.map((item, index) => {
                    const isActive = currentPath === item.href;
                    return (
                      <li key={item.title}>
                        <NavLink
                          to={item.href}
                          className={`flex items-center px-4 py-4 text-sm font-medium transition-colors border-l-4 ${
                            isActive
                              ? "bg-purple-50 text-purple-700 border-purple-500"
                              : item.isDestructive
                              ? "text-red-600 hover:bg-red-50 border-transparent hover:border-red-200"
                              : "text-gray-700 hover:bg-gray-50 border-transparent hover:border-gray-200"
                          } ${
                            index !== navigationItems.length - 1
                              ? "border-b border-gray-100"
                              : ""
                          }`}
                        >
                          <item.icon
                            className={`w-5 h-5 mr-3 ${
                              isActive
                                ? "text-purple-600"
                                : item.isDestructive
                                ? "text-red-500"
                                : "text-gray-400"
                            }`}
                          />
                          <span>{item.title}</span>
                        </NavLink>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>

            {/* Main Content - Outlet */}
            <div className="flex-1">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
