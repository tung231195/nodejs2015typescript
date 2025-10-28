import { Router } from "express";
import {
  createAttribute,
  getAllAttributes,
  getAttributeById,
  updateAttribute,
  deleteAttribute,
} from "../controllers/attribute.controller.js";

const router = Router();
router.post("/", createAttribute);
router.get("/:id", getAttributeById);
router.put("/:id", updateAttribute);
router.delete("/:id", deleteAttribute);
router.get("/", getAllAttributes);
export default router;
