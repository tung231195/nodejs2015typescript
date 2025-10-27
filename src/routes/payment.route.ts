import { Router } from "express";
import {
  createPaymentMethod,
  getAllPaymentMethods,
  getPaymentMethodById,
  updatePaymentMethod,
  deletePaymentMethod,
} from "../controllers/paymentMethod.controller";

const router = Router();
router.post("/", createPaymentMethod);
router.get("/:id", getPaymentMethodById);
router.put("/:id", updatePaymentMethod);
router.delete("/:id", deletePaymentMethod);
router.get("/", getAllPaymentMethods);
export default router;
