import { Button } from "@/components/ui/button.tsx";
import { CheckCircle } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-purple-600 to-purple-700">
      <div className="max-w-4xl mx-auto text-center px-4">
        <h2 className="text-4xl font-bold text-white mb-6">
          Sẵn sàng bắt đầu trò chuyện?
        </h2>
        <p className="text-xl text-purple-100 mb-8">
          Tham gia cùng hàng triệu người dùng đang sử dụng PingMe để kết nối với
          những người họ yêu thương.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            variant="secondary"
            className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg"
          >
            Tạo tài khoản miễn phí
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 text-lg bg-transparent"
          >
            Tải ứng dụng
          </Button>
        </div>

        <div className="mt-8 flex items-center justify-center space-x-6 text-purple-200">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            <span>Miễn phí sử dụng</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            <span>Không quảng cáo</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            <span>Bảo mật tuyệt đối</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
