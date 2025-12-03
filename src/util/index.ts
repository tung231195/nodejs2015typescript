import fs from "fs";

export const generateOrderReference = (): string => {
  // Lấy ngày theo định dạng YYYYMMDD
  const date = new Date();
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  // Sinh chuỗi ngẫu nhiên 4–6 ký tự
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();

  // Ghép lại thành reference code
  return `ORD-${year}${month}${day}-${randomPart}`;
};

export const isDocker = (): boolean => {
  // 1️⃣ Kiểm tra biến môi trường bạn set trong Docker Compose
  if (process.env.IS_DOCKER === "true") return true;

  // 2️⃣ Kiểm tra file đặc trưng của Docker
  try {
    const cgroup = fs.readFileSync("/proc/1/cgroup", "utf8");
    return cgroup.includes("docker") || cgroup.includes("kubepods");
  } catch {
    return false;
  }
};
