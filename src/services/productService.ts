// services/productService.ts

import { ProductModel } from "../models/productModel.js";
import { IProductDoc } from "../types";

export const createProduct = async (data: Partial<IProductDoc>): Promise<IProductDoc> => {
  try {
    const product = new ProductModel(data);
    return await product.save();
  } catch (error: any) {
    console.error("Error in createproduct:", error.message);
    throw new Error("Failed to create product");
  }
};

export const getProductById = async (id: string): Promise<IProductDoc | null> => {
  try {
    return await ProductModel.findById(id).populate("category");
  } catch (error: any) {
    console.error("Error in getproductById:", error.message);
    throw new Error("Failed to fetch product");
  }
};

export const getAllProducts = async (): Promise<IProductDoc[]> => {
  try {
    return await ProductModel.find().populate("category");
  } catch (error: any) {
    console.error("Error in getAllProducts:", error.message);
    throw new Error("Failed to fetch products");
  }
};
export const updateProduct = async (data: Partial<IProductDoc>): Promise<IProductDoc | null> => {
  try {
    return await ProductModel.findByIdAndUpdate(
      data._id,
      { $set: data },
      { new: true, runValidators: true },
    );
  } catch (error: any) {
    console.error("Error in Products:", error.message);
    throw new Error("Failed to create post");
  }
};
export const deleteProductById = async (id: string): Promise<IProductDoc | null> => {
  try {
    return await ProductModel.findByIdAndDelete(id);
  } catch (error: any) {
    console.error("Error in getPostById:", error.message);
    throw new Error("Failed to fetch post");
  }
};
