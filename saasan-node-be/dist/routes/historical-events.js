"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const HistoricalEventController_1 = require("../controllers/HistoricalEventController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Apply auth middleware to all routes
router.use(auth_1.authenticateToken);
// Historical Events routes
router.get("/", HistoricalEventController_1.HistoricalEventController.getAll);
router.get("/:id", HistoricalEventController_1.HistoricalEventController.getById);
router.post("/", HistoricalEventController_1.HistoricalEventController.create);
router.put("/:id", HistoricalEventController_1.HistoricalEventController.update);
router.delete("/:id", HistoricalEventController_1.HistoricalEventController.delete);
router.post("/bulk-upload", HistoricalEventController_1.HistoricalEventController.bulkUpload);
exports.default = router;
