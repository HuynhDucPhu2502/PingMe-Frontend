import { MessageCircle, Users } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip.tsx";
import UserMenu from "@/pages/commons/UserMenu";

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

export default function ChatNavigation() {
  const location = useLocation();
  const currentPath = location.pathname.split("/").pop();

  const handleLogoClick = () => {
    window.open("/", "_blank");
  };

  return (
    <TooltipProvider>
      <div className="w-16 bg-purple-600 flex flex-col items-center py-4">
        {/* Navigation Items */}
        <div className="flex-1 flex flex-col space-y-2">
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

        <div className="bg-purple-700/50 rounded-xl p-2 space-y-2 border border-purple-500/30">
          {/* Logo */}
          <div>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleLogoClick}
                  className="w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200 flex items-center justify-center"
                >
                  <img src="/logo.png" alt="PingMe Logo" className="w-8 h-8" />
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="bg-white text-gray-900 border border-gray-200 shadow-lg"
              >
                <div>
                  <div className="font-medium">PingMe</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    Về trang chủ
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* UserMenu */}
          <div>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <UserMenu openInNewTab={true} />
                </div>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="bg-white text-gray-900 border border-gray-200 shadow-lg"
              >
                <div>
                  <div className="font-medium">Tài khoản</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    Quản lý tài khoản
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
