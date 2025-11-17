import { Router } from "express";
import * as paypalController from "../controllers/paypal.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.use(authMiddleware); // yêu cầu đăng nhập

router.post("/vnpay", paypalController.vnPay);
router.post("/stripe", paypalController.paypalStripe);
router.post("/qrcode", paypalController.createQrPayment);
export default router;
