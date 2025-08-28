import type { LucideIcon } from "lucide-react";

interface sidebarItems {
  id: string;
  title: string;
  icon: LucideIcon;
  description: string;
}

interface SidebarNavigationProps {
  sidebarItems: sidebarItems[];
  friendsStateTotalElements: number;
  receivedRequestsStateTotalElements: number;
  sentRequestsStateTotalElements: number;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

const SidebarNavigation = ({
  sidebarItems,
  friendsStateTotalElements,
  receivedRequestsStateTotalElements,
  sentRequestsStateTotalElements,
  activeCategory,
  setActiveCategory,
}: SidebarNavigationProps) => {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-2">
        {sidebarItems.map((item) => {
          let count = 0;
          switch (item.id) {
            case "friends":
              count = friendsStateTotalElements;
              break;
            case "received-requests":
              count = receivedRequestsStateTotalElements;
              break;
            case "sent-requests":
              count = sentRequestsStateTotalElements;
              break;
          }

          const IconComponent = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setActiveCategory(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeCategory === item.id
                  ? "bg-purple-100 text-purple-700 font-medium"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <IconComponent className="w-5 h-5" />
              <div className="flex-1 min-w-0">
                <div className="font-medium">{item.title}</div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {item.description}
                </div>
              </div>
              {count > 0 && (
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    activeCategory === item.id
                      ? "bg-purple-200 text-purple-800"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SidebarNavigation;
