import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
//import { createPaypalOrder } from "../controllers/paypal.controller.ts.paypal";

const router = Router();

//router.post("/", authMiddleware, createPaypalOrder);
export default router;
