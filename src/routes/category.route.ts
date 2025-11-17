import { Router } from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
  getCategoryProducts,
} from "../controllers/category.controller.js";

const router = Router();
router.post("/", createCategory);
router.get("/:id", getCategoryById);
router.put("/:id", updateCategoryById);
router.delete("/:id", deleteCategoryById);
router.get("/", getAllCategories);
export default router;
