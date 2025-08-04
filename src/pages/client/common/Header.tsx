import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  MessageCircle,
  Menu,
  X,
  User,
  Settings,
  LogOut,
  Bell,
  Search,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  isLoggedIn?: boolean;
  userName?: string;
  userAvatar?: string;
}

export default function Header({
  isLoggedIn = false,
  userName = "Người dùng",
  userAvatar,
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { name: "Trang chủ", href: "/" },
    { name: "Tin nhắn", href: "/messages" },
    { name: "Bạn bè", href: "/friends" },
    { name: "Nhóm", href: "/groups" },
  ];

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-purple-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full">
              <MessageCircle className="w-6 h-6 text-purple-600" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900">PingMe</h1>
              <p className="text-xs text-gray-500 -mt-1">Chat & Connect</p>
            </div>
          </div>

          {/* Search Bar - Desktop */}
          {isLoggedIn && (
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm bạn bè, nhóm..."
                  className="pl-10 bg-purple-50/50 border-purple-200 focus:border-purple-300 focus:ring-purple-200"
                />
              </div>
            </div>
          )}

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {isLoggedIn ? (
              <>
                {navigationItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-gray-600 hover:text-purple-600 font-medium transition-colors"
                  >
                    {item.name}
                  </a>
                ))}

                {/* Notifications */}
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full"
                    >
                      {userAvatar ? (
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={userAvatar || "/placeholder.svg"}
                          alt={userName}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                          <User className="w-5 h-5 text-purple-600" />
                        </div>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {userName}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          user@pingme.com
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Hồ sơ</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Cài đặt</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Đăng xuất</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  className="text-gray-600 hover:text-purple-600"
                >
                  Đăng nhập
                </Button>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  Đăng ký
                </Button>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
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
              {/* Mobile Search */}
              {isLoggedIn && (
                <div className="px-3 py-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="Tìm kiếm..."
                      className="pl-10 bg-purple-50/50 border-purple-200"
                    />
                  </div>
                </div>
              )}

              {isLoggedIn ? (
                <>
                  {navigationItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-md"
                    >
                      {item.name}
                    </a>
                  ))}
                  <div className="border-t border-purple-100 pt-4 pb-3">
                    <div className="flex items-center px-3">
                      <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <User className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="ml-3">
                        <div className="text-base font-medium text-gray-800">
                          {userName}
                        </div>
                        <div className="text-sm font-medium text-gray-500">
                          user@pingme.com
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 space-y-1">
                      <a
                        href="#"
                        className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-md"
                      >
                        Hồ sơ
                      </a>
                      <a
                        href="#"
                        className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-md"
                      >
                        Cài đặt
                      </a>
                      <a
                        href="#"
                        className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-md"
                      >
                        Đăng xuất
                      </a>
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-2 px-3">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-600 hover:text-purple-600"
                  >
                    Đăng nhập
                  </Button>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                    Đăng ký
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
