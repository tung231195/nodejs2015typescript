// services/userService.ts

import { UserModel } from "../models/userModel.js";
import { IUserDoc } from "../types";

export const createUser = async (data: Partial<IUserDoc>): Promise<IUserDoc> => {
  try {
    const user = new UserModel(data);
    return await user.save();
  } catch (error: any) {
    console.error("Error in createUser:", error.message);
    throw new Error("Failed to create user");
  }
};

export const getUserById = async (id: string): Promise<IUserDoc | null> => {
  try {
    return await UserModel.findById(id);
  } catch (error: any) {
    console.error("Error in getUserById:", error.message);
    throw new Error("Failed to fetch user");
  }
};

export const getAllUsers = async (): Promise<IUserDoc[]> => {
  try {
    return await UserModel.find();
  } catch (error: any) {
    console.error("Error in getAllUsers:", error.message);
    throw new Error("Failed to fetch users");
  }
};

export const updateUser = async (id: string, data: Partial<IUserDoc>): Promise<IUserDoc | null> => {
  try {
    const user = await UserModel.findByIdAndUpdate(id, data, {
      new: true, // 👈 trả về bản ghi mới sau khi cập nhật
      runValidators: true, // 👈 đảm bảo Mongoose validate theo schema
    });
    if (!user) return null;
    return user;
  } catch (error: any) {
    console.error("Error in getUserById:", error.message);
    throw new Error("Failed to fetch user");
  }
};

export const updateUserStatus = async (
  id: string,
  data: Partial<IUserDoc>,
): Promise<IUserDoc | null> => {
  try {
    const user = await UserModel.findById(id);
    if (!user) return null;
    user.status = data.status;
    return user?.save();
  } catch (error: any) {
    console.error("Error in getUserById:", error.message);
    throw new Error("Failed to fetch user");
  }
};
