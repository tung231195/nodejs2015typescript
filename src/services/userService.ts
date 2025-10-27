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
