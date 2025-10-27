// controllers/addressController.ts
import { Request, Response } from "express";
import * as addressService from "../services/addressService.js";

export const createAddress = async (req: Request, res: Response) => {
  try {
    const address = await addressService.createAddress(req.body);
    res.status(201).json(address);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAddressById = async (req: Request, res: Response) => {
  try {
    const address = await addressService.getAddressById(req.params.id);
    if (!address) return res.status(404).json({ message: "address not found" });
    res.json(address);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAddressDefault = async (req: Request, res: Response) => {
  try {
    const address = await addressService.getAddressDefaultService();
    res.status(200).json(address);
  } catch (error: any) {
    console.error("Error in getAddressDefault:", error.message);
    res.status(500).json({ message: error.message });
  }
};
export const updateAddressById = async (req: Request, res: Response) => {
  try {
    const address = await addressService.updateAddressById(req.body);
    if (!address) return res.status(404).json({ message: "address not found" });
    res.json(address);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDefaultAllAddress = async (req: Request, res: Response) => {
  try {
    const address = await addressService.setDefaultAddress(req.body);
    if (!address) return res.status(404).json({ message: "address not found" });
    res.json(address);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllAddresses = async (_req: Request, res: Response) => {
  try {
    const addresss = await addressService.getAllAddresses();
    res.json(addresss);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAddressById = async (req: Request, res: Response) => {
  try {
    const addresss = await addressService.deleteAddressById(req.params.id);
    if (!addresss) return res.status(404).json({ message: "attribute not found" });
    res.json(addresss);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
