"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const LocationController_1 = require("../controllers/LocationController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Public routes
router.get("/districts", LocationController_1.LocationController.getDistricts);
router.get("/districts/:districtId/municipalities", LocationController_1.LocationController.getMunicipalities);
router.get("/districts/:districtId/municipalities/:municipalityId/wards", LocationController_1.LocationController.getWards);
// Admin routes (require authentication)
router.post("/districts", auth_1.authenticateToken, LocationController_1.LocationController.createDistrict);
router.post("/municipalities", auth_1.authenticateToken, LocationController_1.LocationController.createMunicipality);
router.post("/wards", auth_1.authenticateToken, LocationController_1.LocationController.createWard);
// Bulk upload routes
router.post("/districts/bulk-upload", auth_1.authenticateToken, LocationController_1.LocationController.bulkUploadDistricts);
router.post("/municipalities/bulk-upload", auth_1.authenticateToken, LocationController_1.LocationController.bulkUploadMunicipalities);
router.post("/wards/bulk-upload", auth_1.authenticateToken, LocationController_1.LocationController.bulkUploadWards);
exports.default = router;
