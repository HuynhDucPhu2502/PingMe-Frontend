export const formatRelativeTime = (date: Date | string): string => {
  const now = new Date();
  const targetDate = typeof date === "string" ? new Date(date) : date;

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

// Format ngày: DD/MM/YYYY
export const formatFullDate = (date: Date | string): string => {
  const targetDate = typeof date === "string" ? new Date(date) : date;

  const day = targetDate.getDate().toString().padStart(2, "0");
  const month = (targetDate.getMonth() + 1).toString().padStart(2, "0");
  const year = targetDate.getFullYear();

  return `${day}/${month}/${year}`;
};

// Format ngày giờ: DD/MM/YYYY HH:mm
export const formatDateTime = (date: Date | string): string => {
  const targetDate = typeof date === "string" ? new Date(date) : date;

  const day = targetDate.getDate().toString().padStart(2, "0");
  const month = (targetDate.getMonth() + 1).toString().padStart(2, "0");
  const year = targetDate.getFullYear();
  const hours = targetDate.getHours().toString().padStart(2, "0");
  const minutes = targetDate.getMinutes().toString().padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};
