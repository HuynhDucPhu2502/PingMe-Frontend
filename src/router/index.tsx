import AuthPage from "@/pages/client-route-pages/auth-page";
import ChatPage from "@/pages/client-route-pages/chat-page";
import ContactsPage from "@/pages/client-route-pages/chat-page/contact-page";
import MessagesPage from "@/pages/client-route-pages/chat-page/messages-page";
import HomePage from "@/pages/client-route-pages/home-page";
import RootPage from "@/pages/client-route-pages/RootPage";
import ProfilePage from "@/pages/client-route-pages/user-page";
import ChangePasswordPage from "@/pages/client-route-pages/user-page/change-password-page";
import DeviceManagementPage from "@/pages/client-route-pages/user-page/device-management-page";
import UserInfoPage from "@/pages/client-route-pages/user-page/user-info-page";
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

      {
        path: "chat",
        element: <ChatPage />,
        children: [
          { index: true, element: <Navigate to="/chat/messages" /> },
          { path: "messages", element: <MessagesPage /> },
          { path: "contacts", element: <ContactsPage /> },
        ],
      },
    ],
  },
]);
