"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  MapPin,
  CalendarIcon,
} from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";
import GoogleSVG from "@/components/common/GoogleSVG";
import { Link } from "react-router-dom";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    gender: "",
    address: "",
  });
  const [dob, setDob] = useState<Date>();
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      console.log("Register attempt:", { ...formData, dob });
    }, 1000);
  };

  const handleGoogleRegister = () => {
    console.log("Google register clicked");
    // Implement Google OAuth here
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 via-white to-purple-100 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-4xl">
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-semibold text-center text-gray-900">
              Đăng ký
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Điền thông tin để tạo tài khoản PingMe
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleRegister} className="space-y-6">
              {/* Grid 2 columns for form fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name Input */}
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium text-gray-700"
                  >
                    Họ và tên <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Nhập họ và tên"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className="pl-10 h-12 border-gray-200 focus:border-purple-300 focus:ring-purple-200"
                      required
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Nhập email của bạn"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className="pl-10 h-12 border-gray-200 focus:border-purple-300 focus:ring-purple-200"
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700"
                  >
                    Mật khẩu <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Nhập mật khẩu"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      className="pl-10 pr-10 h-12 border-gray-200 focus:border-purple-300 focus:ring-purple-200"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Gender Select */}
                <div className="space-y-2">
                  <Label
                    htmlFor="gender"
                    className="text-sm font-medium text-gray-700"
                  >
                    Giới tính <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) =>
                      handleInputChange("gender", value)
                    }
                    required
                  >
                    <SelectTrigger className="h-12 border-gray-200 focus:border-purple-300 focus:ring-purple-200">
                      <SelectValue placeholder="Chọn giới tính" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE">Nam</SelectItem>
                      <SelectItem value="FEMALE">Nữ</SelectItem>
                      <SelectItem value="OTHER">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Date of Birth */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Ngày sinh (tùy chọn)
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full h-12 justify-start text-left font-normal border-gray-200 focus:border-purple-300 focus:ring-purple-200",
                          !dob && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dob
                          ? format(dob, "dd/MM/yyyy", { locale: vi })
                          : "Chọn ngày sinh"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dob}
                        onSelect={setDob}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        locale={vi}
                        captionLayout="dropdown"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Address Input - Full width */}
                <div className="space-y-2 md:col-span-2">
                  <Label
                    htmlFor="address"
                    className="text-sm font-medium text-gray-700"
                  >
                    Địa chỉ (tùy chọn)
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="address"
                      type="text"
                      placeholder="Nhập địa chỉ của bạn"
                      value={formData.address}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                      className="pl-10 h-12 border-gray-200 focus:border-purple-300 focus:ring-purple-200"
                    />
                  </div>
                </div>
              </div>

              {/* Register Button */}
              <Button
                type="submit"
                className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Đang tạo tài khoản...</span>
                  </div>
                ) : (
                  "Tạo tài khoản"
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Hoặc</span>
              </div>
            </div>

            {/* Google Register */}
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleRegister}
              className="w-full h-12 border-gray-200 hover:bg-gray-50 font-medium rounded-lg transition-colors bg-transparent"
            >
              <GoogleSVG />
              Đăng ký với Google
            </Button>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 pt-6">
            <div className="text-center text-sm text-gray-600">
              Đã có tài khoản?{" "}
              <Link
                to="/auth?mode=login"
                className="text-purple-600 hover:text-purple-700 font-medium hover:underline"
              >
                Đăng nhập ngay
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
