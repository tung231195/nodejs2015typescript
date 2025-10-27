// controllers/deliveryController.ts
import { Request, Response } from "express";
import * as deliveryService from "../services/deliveryMethod";

export const createDelivery = async (req: Request, res: Response) => {
  try {
    const delivery = await deliveryService.createDelivery(req.body);
    res.status(201).json(delivery);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDelivery = async (req: Request, res: Response) => {
  try {
    const payload = { ...req.body, _id: req.params.id };
    const delivery = await deliveryService.updateDelivery(payload);
    res.status(201).json(delivery);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getDeliveryById = async (req: Request, res: Response) => {
  try {
    const delivery = await deliveryService.getDeliveryById(req.params.id);
    if (!delivery) return res.status(404).json({ message: "delivery not found" });
    res.json(delivery);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllDeliverys = async (_req: Request, res: Response) => {
  try {
    const deliverys = await deliveryService.getAllDeliverys();
    res.json(deliverys);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteDelivery = async (req: Request, res: Response) => {
  try {
    const delivery = await deliveryService.deleteDeliveryById(req.params.id);
    if (!delivery) return res.status(404).json({ message: "delivery not found" });
    res.json(delivery);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
