// controllers/postController.ts
import { Request, Response } from "express";
import * as productService from "../services/productService.js";
export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json(product);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) return res.status(404).json({ message: "product not found" });
    res.json(product);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getRelateProducts = async (req: Request, res: Response) => {
  try {
    console.log("get reltae", req.body, req.query);
    const product = await productService.getRelateProducts(req.query.category as string);
    if (!product) return res.status(404).json({ message: "product not found" });
    res.json(product);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllProducts = async (_req: Request, res: Response) => {
  try {
    const products = await productService.getAllProducts();
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllProductsByCategory = async (_req: Request, res: Response) => {
  try {
    const products = await productService.getAllProductsByCategory(_req.params.category_id);
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getSaleProducts = async (_req: Request, res: Response) => {
  try {
    const products = await productService.getSaleProducts();
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await productService.deleteProductById(req.params.id);
    if (!product) return res.status(404).json({ message: "product not found" });
    res.json(product);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const payload = { ...req.body, _id: req.params.id };
    const product = await productService.updateProduct(payload);
    res.status(201).json(product);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
