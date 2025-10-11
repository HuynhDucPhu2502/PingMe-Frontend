import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, Menu, X } from "lucide-react";
import { useAppSelector } from "@/features/hooks";
import UserMenu from "./UserMenu";
import { Link } from "react-router-dom";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { isLogin } = useAppSelector((state) => state.auth);

  const navigationItems = [
    { name: "Trang chủ", href: "/" },
    { name: "Blogs", href: "/blogs" },
    { name: "Trò chuyện", href: "/chat/messages" },
    { name: "Danh bạ", href: "/chat/contacts" },
  ];

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-purple-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={"/"}>
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full">
                <MessageCircle className="w-6 h-6 text-purple-600" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">PingMe</h1>
                <p className="text-xs text-gray-500 -mt-1">Chat & Connect</p>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item) => {
              if (
                !isLogin &&
                (item.href.includes("/chat") || item.href.includes("/contacts"))
              ) {
                return null;
              }
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-gray-600 hover:text-purple-600 font-medium transition-colors"
                >
                  {item.name}
                </Link>
              );
            })}

            {isLogin ? (
              <UserMenu />
            ) : (
              <div className="flex items-center space-x-4">
                <Link to={"/auth?mode=login"}>
                  <Button
                    variant="ghost"
                    className="text-gray-600 hover:text-purple-600"
                  >
                    Đăng nhập
                  </Button>
                </Link>
                <Link to={"/auth?mode=register"}>
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                    Đăng ký
                  </Button>
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button and UserMenu */}
          <div className="md:hidden flex items-center space-x-2">
            {isLogin && <UserMenu />}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-purple-100">
              {navigationItems.map((item) => {
                if (
                  !isLogin &&
                  (item.href.includes("/chat") ||
                    item.href.includes("/contacts"))
                ) {
                  return null;
                }
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                );
              })}

              {!isLogin && (
                <div className="space-y-3 px-3 pt-4 border-t border-purple-100 mt-4 ">
                  <Link
                    to={"/auth?mode=login"}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button
                      variant="outline"
                      className="w-full my-1 justify-center border-purple-600 text-purple-600 hover:bg-purple-50 bg-transparent"
                    >
                      Đăng nhập
                    </Button>
                  </Link>
                  <Link
                    to={"/auth?mode=register"}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button className="w-full my-1 justify-center bg-purple-600 hover:bg-purple-700 text-white">
                      Đăng ký
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
