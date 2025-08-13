import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, Lock, X, Shield } from "lucide-react";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/errorMessageHandler";
import { getPasswordStrength } from "@/utils/authFieldHandler";
import { updateCurrentUserPassword } from "@/services/authApi";

interface UpdatePasswordFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function UpdatePasswordForm({
  onSuccess,
  onCancel,
}: UpdatePasswordFormProps) {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      toast.error("Mật khẩu mới phải khác mật khẩu hiện tại");
      return;
    }

    setIsLoading(true);

    try {
      await updateCurrentUserPassword({
        oldPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      onSuccess();

      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(getErrorMessage(error, "Đổi mật khẩu thất bại"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-1  bg-white/80 border-gray-300 shadow-2xl backdrop-blur-sm w-4/5 mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
              <Lock className="w-5 h-5 mr-2 text-purple-600" />
              Đổi mật khẩu
            </CardTitle>
            <CardDescription className="text-gray-600 mt-1">
              Thay đổi mật khẩu để bảo mật tài khoản của bạn
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Password */}
          <div className="space-y-2">
            <Label
              htmlFor="currentPassword"
              className="text-sm font-medium text-gray-700"
            >
              Mật khẩu hiện tại <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showPasswords.current ? "text" : "password"}
                value={formData.currentPassword}
                onChange={(e) =>
                  handleInputChange("currentPassword", e.target.value)
                }
                placeholder="Nhập mật khẩu hiện tại"
                className="pr-10 border-gray-200 focus:border-purple-300 focus:ring-purple-200"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("current")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.current ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <Label
              htmlFor="newPassword"
              className="text-sm font-medium text-gray-700"
            >
              Mật khẩu mới <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPasswords.new ? "text" : "password"}
                value={formData.newPassword}
                onChange={(e) =>
                  handleInputChange("newPassword", e.target.value)
                }
                placeholder="Nhập mật khẩu mới"
                className="pr-10 border-gray-200 focus:border-purple-300 focus:ring-purple-200"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("new")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.new ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {formData.newPassword && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        passwordStrength.strength === 1
                          ? "bg-red-500 w-1/4"
                          : passwordStrength.strength === 2
                          ? "bg-yellow-500 w-2/4"
                          : passwordStrength.strength === 3
                          ? "bg-blue-500 w-3/4"
                          : passwordStrength.strength === 4
                          ? "bg-green-500 w-full"
                          : "w-0"
                      }`}
                    />
                  </div>
                  <span
                    className={`text-xs font-medium ${passwordStrength.color}`}
                  >
                    {passwordStrength.text}
                  </span>
                </div>
                <div className="text-xs text-gray-500 space-y-1">
                  <p>Mật khẩu mạnh nên có:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li
                      className={
                        formData.newPassword.length >= 8
                          ? "text-green-600"
                          : "text-gray-400"
                      }
                    >
                      Ít nhất 8 ký tự
                    </li>
                    <li
                      className={
                        /[A-Z]/.test(formData.newPassword)
                          ? "text-green-600"
                          : "text-gray-400"
                      }
                    >
                      Chữ hoa
                    </li>
                    <li
                      className={
                        /[a-z]/.test(formData.newPassword)
                          ? "text-green-600"
                          : "text-gray-400"
                      }
                    >
                      Chữ thường
                    </li>
                    <li
                      className={
                        /\d/.test(formData.newPassword)
                          ? "text-green-600"
                          : "text-gray-400"
                      }
                    >
                      Số
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-gray-700"
            >
              Xác nhận mật khẩu mới <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showPasswords.confirm ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
                placeholder="Nhập lại mật khẩu mới"
                className="pr-10 border-gray-200 focus:border-purple-300 focus:ring-purple-200"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirm")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.confirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {formData.confirmPassword &&
              formData.newPassword !== formData.confirmPassword && (
                <p className="text-xs text-red-500 flex items-center">
                  <X className="w-3 h-3 mr-1" />
                  Mật khẩu xác nhận không khớp
                </p>
              )}
            {formData.confirmPassword &&
              formData.newPassword === formData.confirmPassword && (
                <p className="text-xs text-green-500 flex items-center">
                  <Shield className="w-3 h-3 mr-1" />
                  Mật khẩu xác nhận khớp
                </p>
              )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="submit"
              disabled={
                isLoading || formData.newPassword !== formData.confirmPassword
              }
              className="bg-purple-600 hover:bg-purple-700 text-white flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang cập nhật...
                </>
              ) : (
                "Đổi mật khẩu"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
              className="border-gray-200 text-gray-600 hover:bg-gray-50 bg-transparent flex-1"
            >
              Hủy
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
