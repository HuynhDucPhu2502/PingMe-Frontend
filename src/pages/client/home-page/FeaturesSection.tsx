import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FileText,
  MessageCircle,
  Shield,
  Smartphone,
  Users,
  Video,
} from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: MessageCircle,
      title: "Tin nhắn nhanh chóng",
      description:
        "Gửi và nhận tin nhắn tức thì với giao diện thân thiện và dễ sử dụng.",
    },
    {
      icon: Shield,
      title: "Bảo mật tuyệt đối",
      description:
        "Mã hóa end-to-end đảm bảo cuộc trò chuyện của bạn luôn được bảo vệ.",
    },
    {
      icon: Users,
      title: "Nhóm chat",
      description:
        "Tạo nhóm chat với bạn bè, gia đình hoặc đồng nghiệp một cách dễ dàng.",
    },
    {
      icon: Video,
      title: "Video call HD",
      description:
        "Gọi video chất lượng cao với âm thanh rõ nét, kết nối mọi lúc mọi nơi.",
    },
    {
      icon: FileText,
      title: "Chia sẻ file",
      description:
        "Gửi hình ảnh, video, tài liệu và nhiều loại file khác một cách nhanh chóng.",
    },
    {
      icon: Smartphone,
      title: "Đa nền tảng",
      description:
        "Sử dụng trên web, mobile và desktop. Đồng bộ dữ liệu mọi thiết bị.",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Tính năng nổi bật
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Khám phá những tính năng mạnh mẽ giúp bạn kết nối và trò chuyện hiệu
            quả hơn
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur-sm"
              >
                <CardHeader className="text-center pb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4 mx-auto">
                    <Icon className="w-8 h-8 text-purple-600" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 text-center leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
