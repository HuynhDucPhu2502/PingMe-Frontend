import AuthPage from "@/pages/main-routes-page/auth-page";
import ChatPage from "@/pages/chat-routes-page";
import ContactsPage from "@/pages/chat-routes-page/contact-page";
import MessagesPage from "@/pages/chat-routes-page/messages-page";
import HomePage from "@/pages/main-routes-page/home-page";
import RootPage from "@/pages/main-routes-page/RootPage";
import ProfilePage from "@/pages/main-routes-page/user-page";
import ChangePasswordPage from "@/pages/main-routes-page/user-page/change-password-page";
import DeviceManagementPage from "@/pages/main-routes-page/user-page/device-management-page";
import UserInfoPage from "@/pages/main-routes-page/user-page/user-info-page";
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
          { path: "device-management", element: <DeviceManagementPage /> },
        ],
      },
    ],
  },
  {
    path: "chat",
    element: <ChatPage />,
    children: [
      { index: true, element: <Navigate to="/chat/messages" /> },
      { path: "messages", element: <MessagesPage /> },
      { path: "contacts", element: <ContactsPage /> },
    ],
  },
]);
