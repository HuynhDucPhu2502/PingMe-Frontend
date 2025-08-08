import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle, Play } from "lucide-react";
const HeroSection = () => {
  return (
    <section className="bg-gradient-to-br from-purple-50 via-white to-purple-100 py-20 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full mb-8">
          <MessageCircle className="w-10 h-10 text-purple-600" />
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Kết nối mọi người
          <span className="block text-purple-600">với PingMe</span>
        </h1>

        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Trò chuyện, gọi video và chia sẻ khoảnh khắc với bạn bè, gia đình một
          cách bảo mật và dễ dàng. Trải nghiệm chat hiện đại nhất hiện nay.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button
            size="lg"
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 text-lg"
          >
            Bắt đầu ngay
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-purple-200 text-purple-600 hover:bg-purple-50 px-8 py-4 text-lg bg-transparent"
          >
            <Play className="mr-2 w-5 h-5" />
            Xem demo
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
