import { PageHeader } from "../components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, CheckCircle, TrendingUp } from "lucide-react";

const stats = [
  {
    title: "Tổng người dùng",
    value: "1,234",
    change: "+12%",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "Tổng bài viết",
    value: "456",
    change: "+8%",
    icon: FileText,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    title: "Bài viết đã duyệt",
    value: "389",
    change: "+15%",
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    title: "Tăng trưởng",
    value: "23%",
    change: "+5%",
    icon: TrendingUp,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
];

export default function StatisticsManagementPage() {
  return (
    <div className="flex-1 overflow-auto">
      <PageHeader
        title="Thống kê"
        description="Tổng quan về hoạt động của hệ thống"
      />

      {/* Content */}
      <div className="p-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.title}
                className="border-purple-100 hover:shadow-lg transition-shadow"
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <p className="text-xs text-green-600 mt-1">
                    {stat.change} so với tháng trước
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-purple-100">
            <CardHeader>
              <CardTitle className="text-purple-900">
                Hoạt động gần đây
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-gray-900">Người dùng mới</p>
                    <p className="text-sm text-gray-500">Hôm nay</p>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">
                    +24
                  </span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-gray-900">Bài viết mới</p>
                    <p className="text-sm text-gray-500">Hôm nay</p>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">
                    +12
                  </span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-gray-900">
                      Bài viết chờ duyệt
                    </p>
                    <p className="text-sm text-gray-500">Hiện tại</p>
                  </div>
                  <span className="text-lg font-semibold text-yellow-600">
                    8
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-100">
            <CardHeader>
              <CardTitle className="text-purple-900">
                Danh mục phổ biến
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Công nghệ</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-600 rounded-full"
                        style={{ width: "75%" }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      75%
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Lối sống</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-600 rounded-full"
                        style={{ width: "60%" }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      60%
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Kinh doanh</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-600 rounded-full"
                        style={{ width: "45%" }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      45%
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Du lịch</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-600 rounded-full"
                        style={{ width: "30%" }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      30%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
