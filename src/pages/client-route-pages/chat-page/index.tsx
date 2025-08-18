import { MessageCircle, Users } from "lucide-react";
import { Navigate, NavLink, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "@/features/hooks";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navigationItems = [
  {
    title: "Tin nhắn",
    icon: MessageCircle,
    href: "messages",
    description: "Trò chuyện với bạn bè",
  },
  {
    title: "Danh bạ",
    icon: Users,
    href: "contacts",
    description: "Quản lý danh bạ",
  },
];

export default function ChatPage() {
  const { isLogin, userSession } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!isLogin || !userSession)
    return <Navigate to="/auth?mode=login" replace />;

  // Get current active item
  const currentPath = location.pathname.split("/").pop();

  return (
    <TooltipProvider>
      <div className="h-screen bg-gray-100 flex">
        {/* Navigation Content */}
        <div className="w-16 bg-purple-600 flex flex-col items-center py-4 space-y-2">
          {navigationItems.map((item) => {
            const isActive = currentPath === item.href;
            return (
              <Tooltip key={item.title}>
                <TooltipTrigger asChild>
                  <NavLink
                    to={item.href}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${
                      isActive
                        ? "bg-purple-100 text-purple-600 shadow-lg"
                        : "text-purple-200 hover:bg-purple-500 hover:text-white"
                    }`}
                  >
                    <item.icon className="w-6 h-6" />
                  </NavLink>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="bg-white text-gray-900 border border-gray-200 shadow-lg"
                >
                  <div>
                    <div className="font-medium">{item.title}</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {item.description}
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <Outlet />
        </div>
      </div>
    </TooltipProvider>
  );
}
