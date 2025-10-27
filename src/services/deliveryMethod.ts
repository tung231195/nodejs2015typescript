// services/postService.ts

import { DeliveryModel } from "../models/deliveryModel.js";
import { IDeliveryItemDoc } from "../types/index.js";

export const createDelivery = async (
  data: Partial<IDeliveryItemDoc>,
): Promise<IDeliveryItemDoc> => {
  try {
    const delivery = new DeliveryModel(data);
    return await delivery.save();
  } catch (error: any) {
    console.error("Error in Deliverys:", error.message);
    throw new Error("Failed to create post");
  }
};

export const updateDelivery = async (
  data: Partial<IDeliveryItemDoc>,
): Promise<IDeliveryItemDoc | null> => {
  try {
    return await DeliveryModel.findByIdAndUpdate(
      data._id,
      { $set: data },
      { new: true, runValidators: true },
    );
  } catch (error: any) {
    console.error("Error in Deliverys:", error.message);
    throw new Error("Failed to create post");
  }
};

export const getDeliveryById = async (id: string): Promise<IDeliveryItemDoc | null> => {
  try {
    return await DeliveryModel.findById(id);
  } catch (error: any) {
    console.error("Error in getPostById:", error.message);
    throw new Error("Failed to fetch post");
  }
};

export const deleteDeliveryById = async (id: string): Promise<IDeliveryItemDoc | null> => {
  try {
    return await DeliveryModel.findByIdAndDelete(id);
  } catch (error: any) {
    console.error("Error in getPostById:", error.message);
    throw new Error("Failed to fetch post");
  }
};
export const getAllDeliverys = async (): Promise<IDeliveryItemDoc[]> => {
  try {
    return await DeliveryModel.find({});
  } catch (error: any) {
    console.error("Error in getAllPosts:", error.message);
    throw new Error("Failed to fetch posts");
  }
};
