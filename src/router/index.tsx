import AuthPage from "@/pages/client/auth-page";
import ChatMessageTest from "@/pages/client/ChatMessageTest";
import HomePage from "@/pages/client/home-page";
import RootPage from "@/pages/client/RootPage";
import ProfilePage from "@/pages/client/user-page";
import InfoPage from "@/pages/client/user-page/info-page";
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
          { index: true, element: <Navigate to="/profile/detail" /> },
          { path: "detail", element: <InfoPage /> },
        ],
      },

      { path: "chat", element: <ChatMessageTest /> },
    ],
  },
]);
