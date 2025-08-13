import { Shield, User } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

const navigationItems = [
  { title: "Thông tin", icon: User, href: "info" },
  { title: "Phiên đăng nhập", icon: Shield, href: "sessions" },
];

export default function ProfilePage() {
  return (
    <>
      <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 p-4">
        {/* Navigation */}
        <div
          className={`hidden w-64 transform rounded-lg bg-white/80 backdrop-blur-sm shadow-xl border border-purple-100 lg:block`}
          style={{ height: "fit-content", maxHeight: "80vh" }}
        >
          <nav className="p-4">
            <ul className="space-y-2">
              {navigationItems.map((item) => (
                <li key={item.title}>
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      `flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                        isActive
                          ? "bg-purple-100 text-purple-700 border border-purple-200"
                          : "text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                      } `
                    }
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.title}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-6">
          <Outlet />
        </div>
      </div>
    </>
  );
}
