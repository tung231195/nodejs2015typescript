import { Router } from "express";
import {
  createUser,
  getUsers,
  updateUserStatus,
  updateUser,
  getUserById,
} from "../controllers/user.controller.js";

const router = Router();
router.post("/", createUser);
router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.put("/:id/status", updateUserStatus);

export default router;
