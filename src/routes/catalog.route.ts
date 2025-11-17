import { Router } from "express";
import { getCategoryPriceRange, getCategoryProducts } from "../controllers/category.controller.js";

const router = Router();
router.get("/:slug", getCategoryProducts);
router.get("/:slug/price-range", getCategoryPriceRange);
export default router;
