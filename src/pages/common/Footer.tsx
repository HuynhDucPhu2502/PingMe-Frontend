import { MessageCircle, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-t from-purple-50 to-white border-t border-purple-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Brand Section */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full">
                  <MessageCircle className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">PingMe</h3>
                  <p className="text-sm text-gray-500">Chat & Connect</p>
                </div>
              </div>
              <p className="text-gray-600 max-w-sm">
                Kết nối và trò chuyện với bạn bè, gia đình và đồng nghiệp một
                cách dễ dàng và bảo mật.
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-gray-600">
                  support@pingme.com
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-gray-600">+84 123 456 789</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-gray-600">Hà Nội, Việt Nam</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-4 border-t border-purple-100">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <div className="text-sm text-gray-600">
              © {currentYear} PingMe. Tất cả quyền được bảo lưu.
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <a
                href="/privacy"
                className="text-gray-600 hover:text-purple-600 transition-colors"
              >
                Chính sách bảo mật
              </a>
              <a
                href="/terms"
                className="text-gray-600 hover:text-purple-600 transition-colors"
              >
                Điều khoản sử dụng
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
