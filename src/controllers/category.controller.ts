// controllers/categoryController.ts
import { Request, Response } from "express";
import * as categoryService from "../services/categoryService.js";

export const createCategory = async (req: Request, res: Response) => {
  try {
    const category = await categoryService.createCategory(req.body);
    res.status(201).json(category);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    if (!category) return res.status(404).json({ message: "category not found" });
    res.json(category);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCategoryById = async (req: Request, res: Response) => {
  try {
    const category = await categoryService.updateCategoryById(req.body);
    if (!category) return res.status(404).json({ message: "category not found" });
    res.json(category);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllCategories = async (_req: Request, res: Response) => {
  try {
    const categorys = await categoryService.getAllCategories();
    res.json(categorys);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCategoryById = async (req: Request, res: Response) => {
  try {
    const attribute = await categoryService.deleteCategoryById(req.params.id);
    if (!attribute) return res.status(404).json({ message: "attribute not found" });
    res.json(attribute);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
