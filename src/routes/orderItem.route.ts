import { Router } from "express";
import * as orderItemController from "../controllers/orderItem.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.use(authMiddleware); // yêu cầu đăng nhập

router.get("/", orderItemController.getCart);
router.get("/sync", orderItemController.syncCartItems);
router.post("/", orderItemController.addItem);
router.post("/sync", orderItemController.syncItems);
router.put("/", orderItemController.updateItem);
router.delete("/:productId", orderItemController.removeItem);

export default router;
