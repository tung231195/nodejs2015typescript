import fs from "fs/promises";
import path from "path";

export async function saveBase64Image(base64: string, filename: string) {
  const matches = base64.match(/^data:(.+);base64,(.+)$/);
  if (!matches) return null;

  const ext = matches[1].split("/")[1];
  const buffer = Buffer.from(matches[2], "base64");

  const uploadDir = path.join(process.cwd(), "public", "uploads"); // lưu trong /public/uploads
  const filePath = path.join(uploadDir, `${filename}.${ext}`);

  // 🔹 Đảm bảo thư mục tồn tại
  await fs.mkdir(uploadDir, { recursive: true });

  // 🔹 Ghi file async
  await fs.writeFile(filePath, buffer);

  // 🔹 Trả về path tĩnh để frontend có thể load
  return `/uploads/${filename}.${ext}`;
}
