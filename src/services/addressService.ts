// services/addressService.ts

import { AddressModel } from "../models/addressModel.js";
import { IAddressItemDoc } from "../types";

export const createAddress = async (data: Partial<IAddressItemDoc>): Promise<IAddressItemDoc> => {
  try {
    const address = new AddressModel(data);
    return await address.save();
  } catch (error: any) {
    console.error("Error in Addresses:", error.message);
    throw new Error("Failed to create address");
  }
};

export const getAddressById = async (id: string): Promise<IAddressItemDoc | null> => {
  try {
    return await AddressModel.findById(id);
  } catch (error: any) {
    console.error("Error in getAddressesById AA:", error.message);
    throw new Error("Failed to fetch address");
  }
};

export const getAddressDefaultService = async (): Promise<IAddressItemDoc | null> => {
  try {
    return await AddressModel.findOne({ isDefault: true });
  } catch (error: any) {
    console.error("Error in getAddressDefaultService:", error.message);
    throw new Error("Failed to fetch default address");
  }
};
export const updateAddressById = async (data: IAddressItemDoc): Promise<IAddressItemDoc | null> => {
  try {
    console.log("data update by patch", data);
    return await AddressModel.findByIdAndUpdate(
      data._id,
      { $set: data },
      { new: true, runValidators: true },
    );
  } catch (error: any) {
    console.error("Error in updateAddressById:", error.message);
    throw new Error("Failed to fetch address");
  }
};

export const setDefaultAddress = async (data: IAddressItemDoc): Promise<IAddressItemDoc | null> => {
  try {
    const { email, _id: id } = data; // id của address cần set default
    console.log("data update", data);
    // 1️⃣ Bỏ mặc định tất cả địa chỉ khác của user
    await AddressModel.updateMany({ email }, { $set: { isDefault: false } });

    // 2️⃣ Đặt mặc định cho địa chỉ được chọn
    const updated = await AddressModel.findByIdAndUpdate(
      id,
      { $set: { isDefault: true } },
      { new: true },
    );

    if (!updated) {
      throw new Error("Address not found");
    }
    return updated;
  } catch (error: any) {
    console.error("Error in setDefaultAddress:", error.message);
    throw new Error("Failed to fetch address");
  }
};

export const getAllAddresses = async (): Promise<IAddressItemDoc[]> => {
  try {
    return await AddressModel.find();
  } catch (error: any) {
    console.error("Error in getAllAddressess:", error.message);
    throw new Error("Failed to fetch addresss");
  }
};

export const deleteAddressById = async (id: string): Promise<IAddressItemDoc | null> => {
  try {
    return await AddressModel.findByIdAndDelete(id);
  } catch (error: any) {
    console.error("Error in getPostById:", error.message);
    throw new Error("Failed to fetch address");
  }
};
