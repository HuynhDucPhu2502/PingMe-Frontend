import type { BlogCategory } from "@/types/blog/blog.ts";

export const GRADIENT_COLORS = [
  "from-purple-500 to-pink-500",
  "from-blue-500 to-cyan-500",
  "from-green-500 to-emerald-500",
  "from-orange-500 to-red-500",
  "from-indigo-500 to-purple-500",
  "from-pink-500 to-rose-500",
  "from-teal-500 to-green-500",
  "from-yellow-500 to-orange-500",
  "from-cyan-500 to-blue-500",
  "from-rose-500 to-pink-500",
];

export const getGradientForBlog = (id: number): string => {
  return GRADIENT_COLORS[id % GRADIENT_COLORS.length];
};

export const CATEGORY_LABELS: Record<BlogCategory, string> = {
  TECHNOLOGY: "Công nghệ",
  LIFESTYLE: "Phong cách sống",
  EDUCATION: "Giáo dục",
  BUSINESS: "Kinh doanh",
  TRAVEL: "Du lịch",
  FOOD: "Ẩm thực",
  ENTERTAINMENT: "Giải trí",
  OTHER: "Khác",
};
