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
