import AuthPage from "@/pages/client/auth-page";
import ChatMessageTest from "@/pages/client/chat-page/ChatMessageTest";
import HomePage from "@/pages/client/home-page";
import RootPage from "@/pages/client/RootPage";
import ProfilePage from "@/pages/client/user-page";
import ChangePasswordPage from "@/pages/client/user-page/change-password-page";
import UserInfoPage from "@/pages/client/user-page/user-info-page";
import { createBrowserRouter, Navigate } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "",
    element: <RootPage />,
    children: [
      { index: true, element: <Navigate to="/home" /> },
      { path: "home", element: <HomePage /> },
      { path: "auth", element: <AuthPage /> },
      {
        path: "profile",
        element: <ProfilePage />,
        children: [
          { index: true, element: <Navigate to="/profile/user-info" /> },
          { path: "user-info", element: <UserInfoPage /> },
          { path: "change-password", element: <ChangePasswordPage /> },
        ],
      },

      { path: "chat", element: <ChatMessageTest /> },
    ],
  },
]);
