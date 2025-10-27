import { Router } from "express";
import * as paypalController from "../controllers/paypal.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware); // yêu cầu đăng nhập

router.post("/", paypalController.vnPay);

export default router;
