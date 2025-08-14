"use client";

import { getCurrentUserDetail } from "@/services/authApi";
import type { UserDetailResponse } from "@/types/user";
import { getErrorMessage } from "@/utils/errorMessageHandler";
import { useCallback, useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Mail,
  Calendar,
  MapPin,
  Shield,
  Edit3,
  Camera,
  Lock,
  Loader2,
} from "lucide-react";
import UpdatePasswordForm from "./UpdatePasswordForm";
import UpdateProfileForm from "./UpdateProfileForm";
import { getGenderDisplay, getUserInitials } from "@/utils/authFieldHandler";

const DetailPage = () => {
  // Status
  const [isLoading, setIsLoading] = useState(false);
  const [avatarVersion] = useState(Date.now());

  // Form visibility
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  // Refs for scrolling
  const profileFormRef = useRef<HTMLDivElement>(null);
  const passwordFormRef = useRef<HTMLDivElement>(null);

  // Data
  const [userDetail, setUserDetail] = useState<UserDetailResponse>({
    email: "",
    name: "",
    gender: "MALE",
    address: "",
    dob: "",
    avatarUrl: "",
  });

  // ======================================
  // Handle Fetching User Details
  // ====================================
  const fetchUserDetails = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getCurrentUserDetail();
      setUserDetail(res.data.data);
    } catch (err) {
      toast.error(
        getErrorMessage(
          err,
          "Không thể lấy thông tin chi tiết người dùng thất bại"
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  // ======================================
  // Handle Button Clicks
  // ====================================
  const handleUpdateProfile = () => {
    setShowProfileForm(true);
    setTimeout(() => {
      profileFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const handleUpdatePassword = () => {
    setShowPasswordForm(true);
    setTimeout(() => {
      passwordFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const handleUpdateAvatar = () => {
    console.log("Update Avatar clicked");
    toast.info("Tính năng cập nhật avatar sẽ sớm được hoàn thiện");
  };

  // ======================================
  // Handle Form Success
  // ====================================
  const handleProfileUpdateSuccess = () => {
    setShowProfileForm(false);
    fetchUserDetails();
    toast.success("Cập nhật thông tin thành công!");
  };

  const handlePasswordUpdateSuccess = () => {
    setShowPasswordForm(false);
    toast.success("Đổi mật khẩu thành công! ");
  };

  // ======================================
  // Format Date
  // ====================================
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Chưa cập nhật";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2 text-purple-600">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="text-lg font-medium">Đang tải thông tin...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Thông tin cá nhân
          </h1>
          <p className="text-gray-600 mt-1">
            Quản lý thông tin tài khoản của bạn
          </p>
        </div>
      </div>

      {/* Main Content - Single Card */}
      <Card className="border-1  bg-white/80 border-gray-300 shadow-2xl backdrop-blur-sm w-4/5 mx-auto">
        {/* Avatar Section */}
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-purple-100">
                <AvatarImage
                  src={
                    userDetail.avatarUrl
                      ? `${userDetail.avatarUrl}?v=${avatarVersion}`
                      : undefined
                  }
                  alt={userDetail.name || "User Avatar"}
                />
                <AvatarFallback className="bg-purple-100 text-purple-600 text-2xl font-semibold">
                  {getUserInitials(userDetail.name)}
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-purple-600 hover:bg-purple-700 p-0"
                onClick={handleUpdateAvatar}
              >
                <Camera className="w-5 h-5" />
              </Button>
            </div>
          </div>
          <CardTitle className="text-2xl text-gray-900 mb-2">
            {userDetail.name || "Chưa cập nhật"}
          </CardTitle>
          <CardDescription className="flex items-center justify-center space-x-2 text-base">
            <Mail className="w-4 h-4" />
            <span>{userDetail.email}</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleUpdateProfile}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Cập nhật thông tin
            </Button>
            <Button
              onClick={handleUpdatePassword}
              variant="outline"
              className="border-purple-200 text-purple-600 hover:bg-purple-50 bg-transparent px-6 py-3"
            >
              <Lock className="w-4 h-4 mr-2" />
              Đổi mật khẩu
            </Button>
          </div>

          <Separator />

          {/* User Information */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <User className="w-5 h-5 text-purple-600" />
              <h3 className="text-xl font-semibold text-gray-900">
                Thông tin chi tiết
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-600">
                  Họ và tên
                </label>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <User className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900 font-medium">
                    {userDetail.name || "Chưa cập nhật"}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-600">
                  Email
                </label>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900 font-medium">
                    {userDetail.email}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-600">
                  Giới tính
                </label>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Shield className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900 font-medium">
                    {getGenderDisplay(userDetail.gender)}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-600">
                  Ngày sinh
                </label>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900 font-medium">
                    {formatDate(userDetail.dob)}
                  </span>
                </div>
              </div>

              <div className="space-y-3 md:col-span-2">
                <label className="text-sm font-medium text-gray-600">
                  Địa chỉ
                </label>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900 font-medium">
                    {userDetail.address || "Chưa cập nhật"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Update Profile Form */}
      {showProfileForm && (
        <div ref={profileFormRef}>
          <UpdateProfileForm
            userDetail={userDetail}
            onSuccess={handleProfileUpdateSuccess}
            onCancel={() => setShowProfileForm(false)}
          />
        </div>
      )}

      {/* Update Password Form */}
      {showPasswordForm && (
        <div ref={passwordFormRef}>
          <UpdatePasswordForm
            onSuccess={handlePasswordUpdateSuccess}
            onCancel={() => setShowPasswordForm(false)}
          />
        </div>
      )}
    </div>
  );
};

export default DetailPage;
