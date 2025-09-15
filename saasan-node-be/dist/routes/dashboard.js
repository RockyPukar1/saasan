"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const DashboardController_1 = require("../controllers/DashboardController");
const router = express_1.default.Router();
router.get("/stats", DashboardController_1.DashboardController.getStats);
router.get("/major-cases", DashboardController_1.DashboardController.getMajorCases);
router.get("/live-services", DashboardController_1.DashboardController.getLiveServices);
exports.default = router;
