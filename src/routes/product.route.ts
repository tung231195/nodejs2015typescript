import { Router } from "express";
import variantRoutes from "../routes/variant.routes.js";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  getSaleProducts,
  getAllProductsByCategory,
} from "../controllers/product.controller.js";
const router = Router();
router.post("/", createProduct);
router.get("/", getAllProducts);
router.get("/sale", getSaleProducts);
router.get("/:id", getProductById);
router.get("/category/:category_id", getAllProductsByCategory);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.use("/:productId/variants", variantRoutes);
export default router;
