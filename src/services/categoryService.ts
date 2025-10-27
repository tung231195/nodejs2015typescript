// services/postService.ts

import { CategoryModel } from "../models/categoryModel.js";
import { ICategoryDoc } from "../types/index.js";

export const createCategory = async (data: Partial<ICategoryDoc>): Promise<ICategoryDoc> => {
  try {
    const category = new CategoryModel(data);
    return await category.save();
  } catch (error: any) {
    console.error("Error in Categories:", error.message);
    throw new Error("Failed to create post");
  }
};

export const getCategoryById = async (id: string): Promise<ICategoryDoc | null> => {
  try {
    return await CategoryModel.findById(id);
  } catch (error: any) {
    console.error("Error in getCategoriesById:", error.message);
    throw new Error("Failed to fetch post");
  }
};

export const updateCategoryById = async (data: ICategoryDoc): Promise<ICategoryDoc | null> => {
  try {
    return await CategoryModel.findByIdAndUpdate(
      data._id,
      { $set: data },
      { new: true, runValidators: true },
    );
  } catch (error: any) {
    console.error("Error in getCategoriesById:", error.message);
    throw new Error("Failed to fetch post");
  }
};

export const getAllCategories = async (): Promise<ICategoryDoc[]> => {
  try {
    return await CategoryModel.find();
  } catch (error: any) {
    console.error("Error in getAllCategoriess:", error.message);
    throw new Error("Failed to fetch posts");
  }
};

export const deleteCategoryById = async (id: string): Promise<ICategoryDoc | null> => {
  try {
    return await CategoryModel.findByIdAndDelete(id);
  } catch (error: any) {
    console.error("Error in getPostById:", error.message);
    throw new Error("Failed to fetch post");
  }
};
