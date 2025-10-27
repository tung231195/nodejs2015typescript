import mongoose from "mongoose";
import { IOrderItemDoc } from "../types";
import { OrderModel } from "../models/orderModel";
import { CartModel } from "../models/cartModel";
import { saveBase64Image } from "../upload";

/**
 * Thêm sản phẩm vào order (chưa checkout)
 */
export const addOrderItem = async (userId: string, item: IOrderItemDoc) => {
  let order = await CartModel.findOne({ user: userId, isPaid: false });

  if (!order) {
    order = new CartModel({
      user: new mongoose.Types.ObjectId(userId),
      items: [item],
    });
  } else {
    // kiểm tra nếu sản phẩm đã có thì cộng thêm số lượng
    const existItem = order.items.find((i) => i.product.toString() === item.product.toString());
    if (existItem) {
      existItem.quantity += item.quantity;
    } else {
      order.items.push(item);
    }
  }

  return await order.save();
};

/** fetch item */
export const syncCartItems = async (userId: string) => {
  const res = await CartModel.findOne({ user: userId }).populate("items.product");

  const result =
    res &&
    res.items.map((item: any) => ({
      ...item.toObject(),
      product: item.product?._id || item.product, // nếu đã populate, lấy _id
    }));
  console.log("fetitemaaa", result, userId);
  return result;
};
/** sycn item */
/** 🔄 Đồng bộ giỏ hàng với backend */
export const syncItems = async (userId: string, items: IOrderItemDoc[]) => {
  console.log("items sync", items);

  const newItems = await Promise.all(
    items.map(async (item: any) => {
      if (item.image?.startsWith("data:")) {
        const filename = `${userId}_${Date.now()}`;
        console.log("Đang lưu ảnh:", filename);
        const filePath = await saveBase64Image(item.image, filename);
        console.log("Đã lưu file:", filePath);
        item.image = filePath;
      }

      return item;
    }),
  );
  // 1️⃣ Cập nhật hoặc tạo mới giỏ hàng của user
  const cart = await CartModel.findOneAndUpdate(
    { user: userId },
    { $set: { items: newItems } },
    { upsert: true, new: true, runValidators: true },
  );

  // 2️⃣ Populate sau khi có doc (findOneAndUpdate không tự populate)
  if (cart) {
    await cart.populate("items.product", "product name price image quantity");
  }
  console.log("✅  new cart 123:", newItems);
  const result = newItems.map((item: any) => ({
    ...item,
    product: item.product?._id || item.product, // nếu đã populate, lấy _id
  }));

  console.log("✅ synced cart:", newItems, result);

  // 3️⃣ Trả về mảng item đã populate
  return result ?? [];
};

/**
 * Cập nhật số lượng 1 sản phẩm trong order
 */
export const updateOrderItem = async (userId: string, productId: string, quantity: number) => {
  const order = await OrderModel.findOne({ user: userId, isPaid: false });
  if (!order) throw new Error("Order not found");

  const item = order.items.find((i) => i.product.toString() === productId);
  if (!item) throw new Error("Item not found in order");

  item.quantity = quantity;

  return await order.save();
};

/**
 * Xóa 1 sản phẩm khỏi order
 */
export const removeOrderItem = async (userId: string, productId: string) => {
  const order = await OrderModel.findOne({ user: userId, isPaid: false });
  if (!order) throw new Error("Order not found");

  order.items = order.items.filter((i) => i.product.toString() !== productId);

  return await order.save();
};

/**
 * Lấy order hiện tại (giỏ hàng)
 */
export const getUserCart = async (userId: string) => {
  console.log("aaaaaaaaaa", userId);
  return await OrderModel.findOne({ user: userId, isPaid: false }).populate("items.product");
};
