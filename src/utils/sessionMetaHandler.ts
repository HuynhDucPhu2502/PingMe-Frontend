import { UAParser } from "ua-parser-js";
import type { SubmitSessionMetaRequest } from "@/types/authentication";

export const getSessionMetaRequest = (): SubmitSessionMetaRequest => {
  const parser = new UAParser();
  const result = parser.getResult();

  const deviceType = result.device.type || "desktop";
  const browser = `${result.browser.name} ${result.browser.version}`;
  const os = `${result.os.name} ${result.os.version}`;

  return { deviceType, browser, os };
};

export const normalizeDeviceType = (type?: string): string => {
  switch (type) {
    case "mobile":
      return "Điện thoại";
    case "tablet":
      return "Máy tính bảng";
    case "smarttv":
      return "Smart TV";
    case "console":
      return "Máy chơi game";
    case "wearable":
      return "Thiết bị đeo tay";
    case "embedded":
      return "Thiết bị nhúng";
    default:
      return "Laptop/Desktop";
  }
};
