/**
 * Chuyển đổi định dạng LocalDateTime từ Spring Boot sang Date của JavaScript
 *
 * Spring Boot trả về LocalDateTime dưới dạng mảng: [year, month, day, hour, minute, second, nanosecond]
 * Hàm này xử lý nhiều định dạng input:
 * - Mảng số từ Spring Boot LocalDateTime
 * - Chuỗi ISO (ví dụ: "2025-01-15T10:30:00")
 * - Date object
 * - null/undefined
 *
 */
function convertToDate(
  date: Date | string | number[] | null | undefined
): Date | null {
  // Nếu đã là Date object, trả về luôn
  if (date instanceof Date) {
    return date;
  }

  // Nếu null hoặc undefined, trả về null
  if (!date) {
    return null;
  }

  // Nếu là chuỗi (định dạng ISO), parse thành Date
  if (typeof date === "string") {
    const parsedDate = new Date(date);
    return isNaN(parsedDate.getTime()) ? null : parsedDate;
  }

  // Nếu là mảng (định dạng LocalDateTime từ Spring Boot)
  if (Array.isArray(date)) {
    try {
      const [year, month, day, hour, minute, second, nanosecond] = date;

      // Kiểm tra mảng có đủ phần tử bắt buộc không
      if (
        year === undefined ||
        month === undefined ||
        day === undefined ||
        hour === undefined ||
        minute === undefined ||
        second === undefined
      ) {
        console.error("Định dạng mảng LocalDateTime không hợp lệ:", date);
        return null;
      }

      // Lưu ý: JavaScript đếm tháng từ 0-11, Spring Boot đếm từ 1-12
      const jsDate = new Date(year, month - 1, day, hour, minute, second);

      // Thêm milliseconds từ nanoseconds nếu có
      if (nanosecond !== undefined) {
        const milliseconds = Math.floor(nanosecond / 1_000_000);
        jsDate.setMilliseconds(milliseconds);
      }

      return isNaN(jsDate.getTime()) ? null : jsDate;
    } catch (error) {
      console.error("Lỗi khi chuyển đổi mảng LocalDateTime:", error);
      return null;
    }
  }

  console.error("Định dạng ngày không xác định:", date);
  return null;
}

/**
 * Format thời gian tương đối (ví dụ: "5 phút trước", "2 giờ trước", "3 ngày trước")
 * Nếu quá 3 ngày, hiển thị định dạng DD/MM/YYYY
 */
export const formatRelativeTime = (
  date: Date | string | number[] | null | undefined
): string => {
  const targetDate = convertToDate(date);

  // Xử lý trường hợp null hoặc không hợp lệ
  if (!targetDate) {
    return "Không xác định";
  }

  const now = new Date();
  const diffMs = now.getTime() - targetDate.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // Dưới 1 giờ
  if (diffHours < 1) {
    if (diffMinutes < 1) return "Vừa xong";
    return `${diffMinutes} phút trước`;
  }

  // Dưới 24 giờ
  if (diffHours < 24) {
    return `${diffHours} giờ trước`;
  }

  // Từ 1 đến 3 ngày
  if (diffDays <= 3) {
    return `${diffDays} ngày trước`;
  }

  // Trên 3 ngày - format DD/MM/YYYY
  const day = targetDate.getDate().toString().padStart(2, "0");
  const month = (targetDate.getMonth() + 1).toString().padStart(2, "0");
  const year = targetDate.getFullYear();

  return `${day}/${month}/${year}`;
};

/**
 * Format ngày đầy đủ: DD/MM/YYYY
 */
export const formatFullDate = (
  date: Date | string | number[] | null | undefined
): string => {
  const targetDate = convertToDate(date);

  // Xử lý trường hợp null hoặc không hợp lệ
  if (!targetDate) {
    return "Không xác định";
  }

  const day = targetDate.getDate().toString().padStart(2, "0");
  const month = (targetDate.getMonth() + 1).toString().padStart(2, "0");
  const year = targetDate.getFullYear();

  return `${day}/${month}/${year}`;
};

/**
 * Format ngày giờ đầy đủ: DD/MM/YYYY HH:mm
 */
export const formatDateTime = (
  date: Date | string | number[] | null | undefined
): string => {
  const targetDate = convertToDate(date);

  // Xử lý trường hợp null hoặc không hợp lệ
  if (!targetDate) {
    return "Không xác định";
  }

  const day = targetDate.getDate().toString().padStart(2, "0");
  const month = (targetDate.getMonth() + 1).toString().padStart(2, "0");
  const year = targetDate.getFullYear();
  const hours = targetDate.getHours().toString().padStart(2, "0");
  const minutes = targetDate.getMinutes().toString().padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};
