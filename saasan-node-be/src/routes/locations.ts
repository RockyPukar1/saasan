import express from "express";
import { LocationController } from "../controllers/LocationController";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

// Public routes
router.get("/provinces", LocationController.getProvinces);
router.get("/districts", LocationController.getDistricts);
router.get("/provinces/:provinceId/districts", LocationController.getDistricts);
router.get(
  "/districts/:districtId/municipalities",
  LocationController.getMunicipalities
);
router.get(
  "/districts/:districtId/municipalities/:municipalityId/wards",
  LocationController.getWards
);
router.get("/constituencies", LocationController.getAllConstituencies);
router.get(
  "/districts/:districtId/constituencies",
  LocationController.getConstituencies
);

// Admin routes (require authentication)
router.post("/provinces", authenticateToken, LocationController.createProvince);
router.post("/districts", authenticateToken, LocationController.createDistrict);
router.post(
  "/municipalities",
  authenticateToken,
  LocationController.createMunicipality
);
router.post("/wards", authenticateToken, LocationController.createWard);
router.post(
  "/constituencies",
  authenticateToken,
  LocationController.createConstituency
);

// Bulk upload routes
router.post(
  "/districts/bulk-upload",
  authenticateToken,
  LocationController.bulkUploadDistricts
);
router.post(
  "/municipalities/bulk-upload",
  authenticateToken,
  LocationController.bulkUploadMunicipalities
);
router.post(
  "/wards/bulk-upload",
  authenticateToken,
  LocationController.bulkUploadWards
);

export default router;
