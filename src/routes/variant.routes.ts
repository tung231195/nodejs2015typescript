import { Router } from "express";
import { VariantController } from "../controllers/variant.controller.js";

const router = Router({ mergeParams: true });

// GET /api/products/:productId/variants
router.get("/", VariantController.getAll);

// GET /api/products/:productId/variants/:variantId
router.get("/:variantId", VariantController.getOne);

// POST /api/products/:productId/variants
router.post("/", VariantController.create);

// PUT /api/products/:productId/variants/:variantId
router.put("/:variantId", VariantController.update);

// DELETE /api/products/:productId/variants/:variantId
router.delete("/:variantId", VariantController.delete);

export default router;
