import { Outlet } from "react-router-dom";
import AdminNavigation from "./components/AdminNavigation";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminNavigation />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Outlet />
      </div>
    </div>
  );
}
