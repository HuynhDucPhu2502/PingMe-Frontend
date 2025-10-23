import { DataTable, type Column } from "../components/DataTable";
import { PageHeader } from "../components/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Ban, CheckCircle } from "lucide-react";
import { getUserInitials } from "@/utils/authFieldHandler";

// Mock data
interface User {
  id: number;
  email: string;
  name: string;
  avatarUrl?: string;
  status: "active" | "banned";
  createdAt: string;
}

const mockUsers: User[] = [
  {
    id: 1,
    email: "user1@example.com",
    name: "Nguyễn Văn A",
    avatarUrl: undefined,
    status: "active" as const,
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    email: "user2@example.com",
    name: "Trần Thị B",
    avatarUrl: undefined,
    status: "active" as const,
    createdAt: "2024-02-20",
  },
  {
    id: 3,
    email: "user3@example.com",
    name: "Lê Văn C",
    avatarUrl: undefined,
    status: "banned" as const,
    createdAt: "2024-03-10",
  },
  {
    id: 4,
    email: "user4@example.com",
    name: "Phạm Thị D",
    avatarUrl: undefined,
    status: "active" as const,
    createdAt: "2024-03-25",
  },
];

export default function AccountManagementPage() {
  const columns: Column<User>[] = [
    {
      key: "user",
      header: "Người dùng",
      render: (user) => (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={user.avatarUrl || "/placeholder.svg"} />
            <AvatarFallback>{getUserInitials(user.name)}</AvatarFallback>
          </Avatar>
          <span className="font-medium text-gray-900">{user.name}</span>
        </div>
      ),
    },
    {
      key: "email",
      header: "Email",
      render: (user) => <span className="text-gray-600">{user.email}</span>,
    },
    {
      key: "status",
      header: "Trạng thái",
      render: (user) =>
        user.status === "active" ? (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Hoạt động
          </Badge>
        ) : (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Bị khóa
          </Badge>
        ),
    },
    {
      key: "createdAt",
      header: "Ngày tạo",
      render: (user) => (
        <span className="text-gray-600">
          {new Date(user.createdAt).toLocaleDateString("vi-VN")}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Hành động",
      className: "text-right",
      render: (user) =>
        user.status === "active" ? (
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent border-red-200"
          >
            <Ban className="w-4 h-4 mr-1" />
            Khóa
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="text-green-600 hover:text-green-700 hover:bg-green-50 bg-transparent border-green-200"
          >
            <CheckCircle className="w-4 h-4 mr-1" />
            Mở khóa
          </Button>
        ),
    },
  ];

  return (
    <div className="flex-1 overflow-auto">
      <PageHeader
        title="Quản lý tài khoản"
        description="Quản lý người dùng và trạng thái tài khoản"
      />

      {/* Content */}
      <div className="p-8">
        <DataTable
          data={mockUsers}
          columns={columns}
          searchPlaceholder="Tìm kiếm theo tên hoặc email..."
          searchKeys={["name", "email"]}
          emptyMessage="Không tìm thấy người dùng nào"
        />
      </div>
    </div>
  );
}
