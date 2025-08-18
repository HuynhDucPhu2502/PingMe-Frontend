export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4">
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
