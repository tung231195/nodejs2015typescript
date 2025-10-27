import { CartModel } from "../models/cartModel";
import { OrderModel } from "../models/orderModel";
import { IOrderDoc } from "../types";

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

// Lấy chi tiết đơn hàng theo ID
export const getOrderById = async (orderId: string) => {
  return await OrderModel.findById(orderId).populate("items.product", "name price");
};

// Update trạng thái đơn hàng (thanh toán / giao hàng)
export const updateOrderStatus = async (orderId: string, updates: Partial<IOrderDoc>) => {
  const order = await OrderModel.findById(orderId);
  if (!order) throw new Error("Order not found");

  if (updates.isPaid) {
    order.isPaid = true;
    order.paidAt = new Date();
  }
  if (updates.isDelivered) {
    order.isDelivered = true;
    order.deliveredAt = new Date();
  }

  return await order.save();
};

// Xóa đơn hàng
export const deleteOrderById = async (orderId: string) => {
  return await OrderModel.findByIdAndDelete(orderId);
};
