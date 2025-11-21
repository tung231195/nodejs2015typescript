import { Router } from "express";
import { generateProducts } from "../controllers/fake.controller";

const router = Router();
router.get("/products", generateProducts);

export default router;
