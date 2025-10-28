import { Router } from "express";
import {
  createAddress,
  getAllAddresses,
  getAddressById,
  updateAddressById,
  deleteAddressById,
  getAddressDefault,
  updateDefaultAllAddress,
} from "../controllers/address.controller.js";

const router = Router();
router.post("/", createAddress);
router.get("/default", getAddressDefault);
router.get("/:id", getAddressById);
router.put("/update/all", updateDefaultAllAddress);
router.put("/:id", updateAddressById);
router.patch("/:id", updateAddressById);
router.delete("/:id", deleteAddressById);
router.get("/", getAllAddresses);
export default router;
