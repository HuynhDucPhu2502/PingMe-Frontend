import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye } from "lucide-react";
import { getUserInitials } from "@/utils/authFieldHandler";
import type { UserSummaryResponse } from "@/types/userSummary";

interface AccountManagementTableProps {
  users: UserSummaryResponse[];
  onViewDetails: (id: number) => void;
}

export const AccountManagementTable = ({
  users,
  onViewDetails,
}: AccountManagementTableProps) => {
  return (
    <div className="rounded-lg border border-purple-100 overflow-hidden bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-50 hover:to-pink-50">
            <TableHead className="font-semibold text-purple-900">
              Người dùng
            </TableHead>
            <TableHead className="font-semibold text-purple-900">
              Email
            </TableHead>
            <TableHead className="font-semibold text-purple-900 text-right">
              Hành động
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={3}
                className="text-center py-8 text-muted-foreground"
              >
                Không có người dùng nào
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow
                key={user.id}
                className="hover:bg-purple-50/50 transition-colors"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.avatarUrl || "/placeholder.svg"} />
                      <AvatarFallback>
                        {getUserInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{user.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {user.email}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetails(user.id)}
                      className="h-8 w-8 p-0 hover:bg-purple-100 hover:text-purple-700"
                      title="Xem chi tiết"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
