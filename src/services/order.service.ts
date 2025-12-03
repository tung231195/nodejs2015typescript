import { CartModel } from "../models/cartModel.js";
import { OrderModel } from "../models/orderModel.js";
import { IOrderDoc } from "../types";
//import { createClient } from "redis";
import { publisher } from "../redisClient.js";
export const createOrder = async (orderData: Partial<IOrderDoc>): Promise<IOrderDoc> => {
  const cart = await CartModel.findOne({ user: orderData.user });
  if (!cart || cart.items.length === 0) throw new Error("Cart is empty");

  const itemsPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxPrice = 0;
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const order = new OrderModel({
    user: orderData.user,
    items: cart.items,
    shippingAddress: orderData.shippingAddress,
    paymentMethod: orderData.paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  });

  await order.save();
  await CartModel.deleteOne({ user: orderData.user }); // clear cart sau khi checkout
  // const publisher = createClient();
  // await publisher.connect();
  await publisher.publish(
    "events",
    JSON.stringify({
      type: "order.create.notify",
      data: {
        message: "add order success",
        user: order.user,
        reference: order.reference,
      },
    }),
  );
  return order;
};

// Tạo đơn hàng mới
// export const createOrder = async (orderData: Partial<IOrderDoc>) => {
//   const order = new OrderModel(orderData);
//   return await order.save();
// };

// Lấy tất cả đơn hàng của 1 user
export const getOrdersByUser = async (userId: string) => {
  return await OrderModel.find({ user: userId }).populate("items.product", "name price");
};
// Lấy All don hang
export const getAllOrders = async () => {
  return await OrderModel.find({}).populate("items.product", "name price").populate("user");
};

export const getOrderviews = async () => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const startOfYesterday = new Date();
    startOfYesterday.setHours(0, 0, 0, 0);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);

    const endOfYesterday = new Date();
    endOfYesterday.setHours(23, 59, 59, 999);
    endOfYesterday.setDate(endOfYesterday.getDate() - 1);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);

    const startOfLastMonth = new Date();
    startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1);
    startOfLastMonth.setDate(1);
    startOfLastMonth.setHours(0, 0, 0, 0);

    const endOfLastMonth = new Date(startOfLastMonth);
    endOfLastMonth.setMonth(endOfLastMonth.getMonth() + 1);
    endOfLastMonth.setDate(0);
    endOfLastMonth.setHours(23, 59, 59, 999);

    const orderStatics = await OrderModel.aggregate([
      {
        $facet: {
          today: [
            { $match: { createdAt: { $gte: startOfToday, $lte: endOfToday } } },
            { $group: { _id: null, total: { $sum: "$totalPrice" } } },
          ],
          yesterday: [
            { $match: { createdAt: { $gte: startOfYesterday, $lte: endOfYesterday } } },
            { $group: { _id: null, total: { $sum: "$totalPrice" } } },
          ],
          month: [
            { $match: { createdAt: { $gte: startOfMonth, $lte: endOfMonth } } },
            { $group: { _id: null, total: { $sum: "$totalPrice" } } },
          ],
          last_month: [
            { $match: { createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } } },
            { $group: { _id: null, total: { $sum: "$totalPrice" } } },
          ],
          allday: [{ $group: { _id: null, total: { $sum: "$totalPrice" } } }],
          total_orders: [{ $group: { _id: null, total: { $sum: 1 } } }],
          pending: [
            { $match: { status: "pending" } },
            { $group: { _id: null, total: { $sum: 1 } } },
          ],
          processing: [
            { $match: { status: "processing" } },
            { $group: { _id: null, total: { $sum: 1 } } },
          ],
          delivered: [
            { $match: { status: "delivered" } },
            { $group: { _id: null, total: { $sum: 1 } } },
          ],
        },
      },
      {
        $project: {
          today: { $ifNull: [{ $arrayElemAt: ["$today.total", 0] }, 0] },
          yesterday: { $ifNull: [{ $arrayElemAt: ["$yesterday.total", 0] }, 0] },
          month: { $ifNull: [{ $arrayElemAt: ["$month.total", 0] }, 0] },
          last_month: { $ifNull: [{ $arrayElemAt: ["$last_month.total", 0] }, 0] },
          allday: { $ifNull: [{ $arrayElemAt: ["$allday.total", 0] }, 0] },
          total_orders: { $ifNull: [{ $arrayElemAt: ["$total_orders.total", 0] }, 0] },
          pending: { $ifNull: [{ $arrayElemAt: ["$pending.total", 0] }, 0] },
          processing: { $ifNull: [{ $arrayElemAt: ["$processing.total", 0] }, 0] },
          delivered: { $ifNull: [{ $arrayElemAt: ["$delivered.total", 0] }, 0] },
        },
      },
    ]);

    return orderStatics[0] ?? [];
  } catch (error: any) {
    console.error("Error in getOrderviews:", error.message);
    throw new Error("Failed to fetch products");
  }
};

// Lấy chi tiết đơn hàng theo ID
export const getOrderById = async (orderId: string) => {
  return await OrderModel.findById(orderId).populate("items.product", "name price");
};

// Update trạng thái đơn hàng (thanh toán / giao hàng)
export const updateOrderStatus = async (orderId: string, updates: Partial<IOrderDoc>) => {
  const order = await OrderModel.findById(orderId);
  if (!order) throw new Error("Order not found");
  if (updates.status) order.status = updates.status;

  return await order.save();
};

// Xóa đơn hàng
export const deleteOrderById = async (orderId: string) => {
  return await OrderModel.findByIdAndDelete(orderId);
};
