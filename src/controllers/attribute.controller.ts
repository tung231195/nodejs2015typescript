// controllers/attributeController.ts
import { Request, Response } from "express";
import * as attributeService from "../services/attributeService.js";

export const createAttribute = async (req: Request, res: Response) => {
  try {
    const attribute = await attributeService.createAttribute(req.body);
    res.status(201).json(attribute);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAttribute = async (req: Request, res: Response) => {
  try {
    const payload = { ...req.body, _id: req.params.id };
    const attribute = await attributeService.updateAttribute(payload);
    res.status(201).json(attribute);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAttributeById = async (req: Request, res: Response) => {
  try {
    const attribute = await attributeService.getAttributeById(req.params.id);
    if (!attribute) return res.status(404).json({ message: "attribute not found" });
    res.json(attribute);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllAttributes = async (_req: Request, res: Response) => {
  try {
    const attributes = await attributeService.getAllAttributes();
    res.json(attributes);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAttribute = async (req: Request, res: Response) => {
  try {
    const attribute = await attributeService.deleteAttributeById(req.params.id);
    if (!attribute) return res.status(404).json({ message: "attribute not found" });
    res.json(attribute);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
