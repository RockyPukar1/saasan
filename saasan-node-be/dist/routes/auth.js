"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthController_1 = require("../controllers/AuthController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post("/register", AuthController_1.AuthController.register);
router.post("/login", AuthController_1.AuthController.login);
router.post("/refresh-token", AuthController_1.AuthController.refreshToken);
router.get("/profile", auth_1.authenticateToken, AuthController_1.AuthController.getProfile);
exports.default = router;
