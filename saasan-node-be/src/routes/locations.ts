import express from "express";
import { LocationController } from "../controllers/LocationController";

const router = express.Router();

router.get("/districts", LocationController.getDistricts);
router.get(
  "/districts/:districtId/municipalities",
  LocationController.getMunicipalities
);
router.get(
  "/districts/:districtId/municipalities/:municipalityId/wards",
  LocationController.getWards
);

export default router;
