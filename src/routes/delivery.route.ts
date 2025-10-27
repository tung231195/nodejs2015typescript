import { Router } from "express";
import {
  createDelivery,
  getAllDeliverys,
  getDeliveryById,
  updateDelivery,
  deleteDelivery,
} from "../controllers/delivery.controller";

const router = Router();
router.post("/", createDelivery);
router.get("/:id", getDeliveryById);
router.put("/:id", updateDelivery);
router.delete("/:id", deleteDelivery);
router.get("/", getAllDeliverys);
export default router;
