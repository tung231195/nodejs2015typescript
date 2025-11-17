// controllers/categoryController.ts
import { Request, Response } from "express";
import * as categoryService from "../services/categoryService.js";
import { ProductModel } from "../models/productModel.js";

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

export const getCategoryProducts = async (req: Request, res: Response) => {
  console.log("run to here");
  try {
    if (!req.params.slug) {
      return res.status(400).json({ message: "Slug is required" });
    }
    console.log("get params controller", req.params);
    const { slug } = req.params;
    const { minPrice, maxPrice, variants } = req.query;
    const min = minPrice ? Number(minPrice) : 0;
    const max = maxPrice ? Number(maxPrice) : Infinity;

    const category = await categoryService.getCategoryProducts({
      slug,
      minPrice: min,
      maxPrice: max,
      variantFilters: variants as { attributeId?: string; valueString?: string }[],
    });
    if (!category) return res.status(404).json({ message: "category not found" });
    res.json(category);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getCategoryPriceRange = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const result = await ProductModel.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      { $unwind: "$categoryInfo" },
      { $match: { "categoryInfo.slug": slug } },
      {
        $group: {
          _id: null,
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
    ]);

    if (result.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({
      minPrice: result[0].minPrice,
      maxPrice: result[0].maxPrice,
    });
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
