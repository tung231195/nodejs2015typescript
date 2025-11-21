// services/productService.ts

import { ProductModel } from "../models/productModel.js";
import { IProductDoc } from "../types";
import { saveBase64Image } from "../upload/index.js";

export const createProduct = async (data: Partial<IProductDoc>): Promise<IProductDoc> => {
  try {
    // 🔹 Nếu có ảnh base64 thì xử lý
    if (data.images && data.images.length > 0) {
      const newImages = (
        await Promise.all(
          data.images.map(async (image) => {
            if (image?.startsWith("data:")) {
              const filename = `product_${Date.now()}`;
              const filePath = await saveBase64Image(image, filename);
              return filePath;
            }
            return image;
          }),
        )
      ).filter((img): img is string => Boolean(img)); // ✅ lọc bỏ null hoặc undefined
      // 🔹 Gán lại mảng ảnh đã xử lý
      data.images = newImages;
    } else {
      data.images = [];
    }
    // 🔹 Tạo sản phẩm mới
    const product = new ProductModel(data);
    return await product.save();
  } catch (error: any) {
    console.error("Error in createProduct:", error.message);
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

export const getProductBySlug = async (slug: string): Promise<IProductDoc | null> => {
  try {
    return await ProductModel.findOne({ slug: slug }).populate("category");
  } catch (error: any) {
    console.error("Error in getproductBySlug:", error.message);
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

export const getAllProductsByCategory = async (category_id: string): Promise<IProductDoc[]> => {
  try {
    return await ProductModel.find({ category: category_id }).populate("category");
  } catch (error: any) {
    console.error("Error in getAllProducts By categoryId:", error.message);
    throw new Error("Failed to fetch products");
  }
};

export const getSaleProducts = async (): Promise<IProductDoc[]> => {
  try {
    return await ProductModel.find({ "discount.value": { $gt: 0 } }).populate("category");
  } catch (error: any) {
    console.error("Error in getAllProducts:", error.message);
    throw new Error("Failed to fetch products");
  }
};

export const getRelateProducts = async (category: string): Promise<IProductDoc[] | null> => {
  try {
    if (!category) throw new Error("The product not exist");
    return await ProductModel.find({ category: category }).populate("category");
  } catch (error: any) {
    console.error("Error in getAllProducts:", error.message);
    throw new Error("Failed to fetch products");
  }
};
export const updateProduct = async (data: Partial<IProductDoc>): Promise<IProductDoc | null> => {
  try {
    if (data.images && data.images.length > 0) {
      const newImages = (
        await Promise.all(
          data.images.map(async (image) => {
            if (image?.startsWith("data:")) {
              const filename = `product_${Date.now()}`;
              const filePath = await saveBase64Image(image, filename);
              return filePath;
            }
            return image;
          }),
        )
      ).filter((img): img is string => Boolean(img)); // ✅ lọc bỏ null hoặc undefined
      // 🔹 Gán lại mảng ảnh đã xử lý
      data.images = newImages;
    } else {
      data.images = [];
    }
    return await ProductModel.findByIdAndUpdate(
      data._id,
      { $set: data },
      { new: true, runValidators: true },
    ).populate("category");
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
