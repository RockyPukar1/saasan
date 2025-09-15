"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const MajorCaseController_1 = require("../controllers/MajorCaseController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Apply auth middleware to all routes
router.use(auth_1.authenticateToken);
// Major Cases routes
router.get("/", MajorCaseController_1.MajorCaseController.getAll);
router.get("/:id", MajorCaseController_1.MajorCaseController.getById);
router.post("/", MajorCaseController_1.MajorCaseController.create);
router.put("/:id", MajorCaseController_1.MajorCaseController.update);
router.delete("/:id", MajorCaseController_1.MajorCaseController.delete);
router.put("/:id/status", MajorCaseController_1.MajorCaseController.updateStatus);
exports.default = router;
