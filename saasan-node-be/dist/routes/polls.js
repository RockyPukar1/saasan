"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const PollController_1 = require("../controllers/PollController");
const PollingController_1 = require("../controllers/PollingController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Public routes
router.get("/", PollController_1.PollController.getAll);
router.get("/:id", PollController_1.PollController.getById);
router.get("/:id/stats", PollController_1.PollController.getStats);
router.get("/analytics", PollingController_1.PollingController.getAnalytics);
router.get("/categories", PollingController_1.PollingController.getCategories);
router.get("/politician/:politicianId/comparison", PollingController_1.PollingController.getPoliticianComparison);
router.get("/party/:partyId/comparison", PollingController_1.PollingController.getPartyComparison);
// Protected routes (require authentication)
router.post("/", auth_1.authenticateToken, PollController_1.PollController.create);
router.put("/:id", auth_1.authenticateToken, PollController_1.PollController.update);
router.delete("/:id", auth_1.authenticateToken, PollController_1.PollController.delete);
router.post("/:id/options", auth_1.authenticateToken, PollController_1.PollController.addOption);
router.post("/:id/vote/:optionId", auth_1.authenticateToken, PollController_1.PollController.vote);
exports.default = router;
