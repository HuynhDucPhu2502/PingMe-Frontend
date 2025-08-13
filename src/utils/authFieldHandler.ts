export const getPasswordStrength = (password: string) => {
  if (password.length === 0) return { strength: 0, text: "", color: "" };
  if (password.length < 6)
    return { strength: 1, text: "Yếu", color: "text-red-500" };
  if (password.length < 8)
    return { strength: 2, text: "Trung bình", color: "text-yellow-500" };
  if (password.length >= 8 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    return { strength: 4, text: "Rất mạnh", color: "text-green-500" };
  }
  return { strength: 3, text: "Mạnh", color: "text-blue-500" };
};

export const getGenderDisplay = (gender?: string) => {
  switch (gender) {
    case "MALE":
      return "Nam";
    case "FEMALE":
      return "Nữ";
    case "OTHER":
      return "Khác";
    default:
      return "Chưa cập nhật";
  }
};

export const getUserInitials = (name?: string) => {
  if (!name) return "U";
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
};
