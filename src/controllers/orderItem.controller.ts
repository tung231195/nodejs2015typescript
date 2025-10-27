import { Request, Response } from "express";
import * as orderItemService from "../services/orderItem.service.js";

export const addItem = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id; // đã login
    const order = await orderItemService.addOrderItem(userId, req.body);
    res.json(order);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const syncCartItems = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id; // đã login
    const order = await orderItemService.syncCartItems(userId);

    res.json(order);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const syncItems = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id; // đã login
    const order = await orderItemService.syncItems(userId, req.body);

    res.json(order);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const updateItem = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const { productId, quantity } = req.body;
    const order = await orderItemService.updateOrderItem(userId, productId, quantity);
    res.json(order);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const removeItem = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const { productId } = req.params;
    const order = await orderItemService.removeOrderItem(userId, productId);
    res.json(order);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const order = await orderItemService.getUserCart(userId);
    res.json(order);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
