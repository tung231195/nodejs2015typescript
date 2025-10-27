// services/postService.ts

import { AttributeModel } from "../models/attributeModel.js";
import { IAttributeDoc } from "../types/index.js";

export const createAttribute = async (data: Partial<IAttributeDoc>): Promise<IAttributeDoc> => {
  try {
    const attribute = new AttributeModel(data);
    return await attribute.save();
  } catch (error: any) {
    console.error("Error in Attributes:", error.message);
    throw new Error("Failed to create post");
  }
};

export const updateAttribute = async (
  data: Partial<IAttributeDoc>,
): Promise<IAttributeDoc | null> => {
  try {
    return await AttributeModel.findByIdAndUpdate(
      data._id,
      { $set: data },
      { new: true, runValidators: true },
    );
  } catch (error: any) {
    console.error("Error in Attributes:", error.message);
    throw new Error("Failed to create post");
  }
};

export const getAttributeById = async (id: string): Promise<IAttributeDoc | null> => {
  try {
    return await AttributeModel.findById(id);
  } catch (error: any) {
    console.error("Error in getPostById:", error.message);
    throw new Error("Failed to fetch post");
  }
};

export const deleteAttributeById = async (id: string): Promise<IAttributeDoc | null> => {
  try {
    return await AttributeModel.findByIdAndDelete(id);
  } catch (error: any) {
    console.error("Error in getPostById:", error.message);
    throw new Error("Failed to fetch post");
  }
};
export const getAllAttributes = async (): Promise<IAttributeDoc[]> => {
  try {
    return await AttributeModel.find({});
  } catch (error: any) {
    console.error("Error in getAllPosts:", error.message);
    throw new Error("Failed to fetch posts");
  }
};
