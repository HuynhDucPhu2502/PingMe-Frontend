import AuthPage from "@/pages/client/auth-page";
import ChatMessageTest from "@/pages/client/ChatMessageTest";
import HomePage from "@/pages/client/home-page";
import RootPage from "@/pages/client/RootPage";
import { createBrowserRouter, Navigate } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "",
    element: <RootPage />,
    children: [
      { index: true, element: <Navigate to="/home" /> },
      { path: "home", element: <HomePage /> },
      { path: "auth", element: <AuthPage /> },
      { path: "chat", element: <ChatMessageTest /> },
    ],
  },
]);
