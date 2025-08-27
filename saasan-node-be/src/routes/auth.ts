import express from "express";
import { AuthController } from "../controllers/AuthController";
import { authenticateToken } from "../middleware/auth";
const router = express.Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/refresh-token", AuthController.refreshToken);
router.get("/profile", authenticateToken, AuthController.getProfile);

export default router;
