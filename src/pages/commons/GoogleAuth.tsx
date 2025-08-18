import { useState } from "react";
import { useGoogleLogin, type TokenResponse } from "@react-oauth/google";
import { Button } from "@/components/ui/button";
import GoogleSVG from "@/components/commons/GoogleSVG";

export default function GoogleAuth() {
  const [loading, setLoading] = useState(false);

  const login = useGoogleLogin({
    flow: "implicit", // popup (mặc định). Nếu muốn redirect: flow: "auth-code"
    onSuccess: async (tokenResponse: TokenResponse) => {
      setLoading(false);
      // Với flow implicit: tokenResponse chứa access_token; để lấy id_token thì:
      // Dùng "jwt_decode" hoặc chuyển sang "ux_mode: redirect" của GIS.
      // Nếu bạn đang dùng mới (GIS One Tap), có thể dùng callback nhận "credential" (id_token).
      console.log("Google token:", tokenResponse);
      // TODO: gửi token về BE để verify nếu cần
    },

    onError: () => {
      setLoading(false);
      console.error("Google login failed");
    },

    onNonOAuthError: () => {
      setLoading(false);
    },

    scope: "openid email profile",
  });

  const handleClick = () => {
    setLoading(true);
    login();
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleClick}
      disabled={loading}
      className="w-full h-12 border-gray-200 hover:bg-gray-50 font-medium rounded-lg transition-colors bg-transparent"
    >
      <GoogleSVG />
      {loading ? "Đang đăng nhập..." : "Đăng nhập với Google"}
    </Button>
  );
}
