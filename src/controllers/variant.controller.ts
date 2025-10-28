import { Request, Response } from "express";
import { ProductModel } from "../models/productModel.js";

export const VariantController = {
  // 🔹 Lấy danh sách variant của 1 product
  async getAll(req: Request, res: Response) {
    const { productId } = req.params;
    const product = await ProductModel.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product.variants);
  },

  // 🔹 Lấy 1 variant cụ thể
  async getOne(req: Request, res: Response) {
    const { productId, variantId } = req.params;
    const product = await ProductModel.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (!product.variants) return res.status(404).json({ message: "Variant not found" });

    const variant = product.variants.id(variantId);
    if (!variant) return res.status(404).json({ message: "Variant not found" });

    res.json(variant);
  },

  // 🔹 Tạo variant mới trong product
  async create(req: Request, res: Response) {
    const { productId } = req.params;
    const product = await ProductModel.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (!product.variants) return res.status(404).json({ message: "Variant not found" });

    product.variants.push(req.body);
    await product.save();

    res.status(201).json(product.variants[product.variants.length - 1]);
  },

  // 🔹 Cập nhật variant cụ thể
  async update(req: Request, res: Response) {
    const { productId, variantId } = req.params;
    const product = await ProductModel.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (!product.variants) return res.status(404).json({ message: "Variant not found" });

    const variant = product.variants.id(variantId);
    if (!variant) return res.status(404).json({ message: "Variant not found" });

    Object.assign(variant, req.body);
    await product.save();

    res.json(variant);
  },

  // 🔹 Xoá variant cụ thể
  async delete(req: Request, res: Response) {
    const { productId, variantId } = req.params;
    const product = await ProductModel.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (!product.variants) return res.status(404).json({ message: "Variant not found" });

    const variant = product.variants.id(variantId);
    if (!variant) return res.status(404).json({ message: "Variant not found" });

    variant.deleteOne();
    await product.save();

    res.json({ message: "Variant deleted successfully" });
  },
};
