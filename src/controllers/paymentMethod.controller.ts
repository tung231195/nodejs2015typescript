// controllers/paymentMethodController.ts
import { Request, Response } from "express";
import * as paymentMethodService from "../services/paymentMethod.js";

export const createPaymentMethod = async (req: Request, res: Response) => {
  try {
    const paymentMethod = await paymentMethodService.createPaymentMethod(req.body);
    res.status(201).json(paymentMethod);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePaymentMethod = async (req: Request, res: Response) => {
  try {
    const payload = { ...req.body, _id: req.params.id };
    const paymentMethod = await paymentMethodService.updatePaymentMethod(payload);
    res.status(201).json(paymentMethod);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getPaymentMethodById = async (req: Request, res: Response) => {
  try {
    const paymentMethod = await paymentMethodService.getPaymentMethodById(req.params.id);
    if (!paymentMethod) return res.status(404).json({ message: "paymentMethod not found" });
    res.json(paymentMethod);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllPaymentMethods = async (_req: Request, res: Response) => {
  try {
    const paymentMethods = await paymentMethodService.getAllPaymentMethods();
    res.json(paymentMethods);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePaymentMethod = async (req: Request, res: Response) => {
  try {
    const paymentMethod = await paymentMethodService.deletePaymentMethodById(req.params.id);
    if (!paymentMethod) return res.status(404).json({ message: "paymentMethod not found" });
    res.json(paymentMethod);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
