import { Request, Response } from "express";
import * as orderService from "../services/order.service.js";

// POST /api/orders
export const createOrder = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(500).json({ message: "the user not exit " });
    const order = await orderService.createOrder({ ...req.body, user: req.user._id });
    res.status(201).json({ success: true, data: order });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// GET /api/orders/my
export const getUserOrders = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(404).json({ message: "the user not exit " });
    const orders = await orderService.getOrdersByUser(req.user._id);
    res.status(200).json({ success: true, data: orders });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// GET /api/orders/:id
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.status(200).json({ success: true, data: order });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/orders/:id
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const updated = await orderService.updateOrderStatus(req.params.id, req.body);
    res.status(200).json({ success: true, data: updated });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/orders/:id
export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const deleted = await orderService.deleteOrderById(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Order not found" });
    res.status(200).json({ success: true, message: "Order deleted" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};
