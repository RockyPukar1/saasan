import express from "express";
import { AuthController } from "../controllers/AuthController";
const router = express.Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/refresh-token", AuthController.refreshToken);
router.get("/profile", AuthController.getProfile);

export default router;
