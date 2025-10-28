// services/postService.ts

import { PaymentMethodModel } from "../models/paymentModel.js";
import { IPaymentItemDoc } from "../types";

export const createPaymentMethod = async (
  data: Partial<IPaymentItemDoc>,
): Promise<IPaymentItemDoc> => {
  try {
    const paymentMethod = new PaymentMethodModel(data);
    return await paymentMethod.save();
  } catch (error: any) {
    console.error("Error in PaymentMethods:", error.message);
    throw new Error("Failed to create post");
  }
};

export const updatePaymentMethod = async (
  data: Partial<IPaymentItemDoc>,
): Promise<IPaymentItemDoc | null> => {
  try {
    return await PaymentMethodModel.findByIdAndUpdate(
      data._id,
      { $set: data },
      { new: true, runValidators: true },
    );
  } catch (error: any) {
    console.error("Error in PaymentMethods:", error.message);
    throw new Error("Failed to create post");
  }
};

export const getPaymentMethodById = async (id: string): Promise<IPaymentItemDoc | null> => {
  try {
    return await PaymentMethodModel.findById(id);
  } catch (error: any) {
    console.error("Error in getPostById:", error.message);
    throw new Error("Failed to fetch post");
  }
};

export const deletePaymentMethodById = async (id: string): Promise<IPaymentItemDoc | null> => {
  try {
    return await PaymentMethodModel.findByIdAndDelete(id);
  } catch (error: any) {
    console.error("Error in getPostById:", error.message);
    throw new Error("Failed to fetch post");
  }
};
export const getAllPaymentMethods = async (): Promise<IPaymentItemDoc[]> => {
  try {
    return await PaymentMethodModel.find({});
  } catch (error: any) {
    console.error("Error in getAllPosts:", error.message);
    throw new Error("Failed to fetch posts");
  }
};
