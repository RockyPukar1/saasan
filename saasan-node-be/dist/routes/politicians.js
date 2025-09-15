"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const PoliticianController_1 = require("../controllers/PoliticianController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Get all politicians with optional level filtering
router.get("/", PoliticianController_1.PoliticianController.getAll);
// Get government levels with counts
router.get("/levels", PoliticianController_1.PoliticianController.getGovernmentLevels);
// Get politicians by specific level (using lowercase)
router.get("/level/:level", PoliticianController_1.PoliticianController.getByLevel);
// Get individual politician
router.get("/:id", PoliticianController_1.PoliticianController.getById);
// Get politician promises
router.get("/:id/promises", PoliticianController_1.PoliticianController.getPromises);
// Rate politician (requires authentication)
router.post("/:id/rate", auth_1.authenticateToken, PoliticianController_1.PoliticianController.ratePolitician);
// Admin routes (require authentication)
router.post("/", auth_1.authenticateToken, PoliticianController_1.PoliticianController.create);
router.put("/:id", auth_1.authenticateToken, PoliticianController_1.PoliticianController.update);
router.delete("/:id", auth_1.authenticateToken, PoliticianController_1.PoliticianController.delete);
router.post("/bulk-upload", auth_1.authenticateToken, PoliticianController_1.PoliticianController.bulkUpload);
exports.default = router;
