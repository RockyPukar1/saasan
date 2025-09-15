"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationController = void 0;
const ResponseHelper_1 = require("../lib/helpers/ResponseHelper");
const ValidationHelper_1 = require("../lib/helpers/ValidationHelper");
const database_1 = __importDefault(require("../config/database"));
const utils_1 = require("../lib/utils");
// This is sample data - you should replace this with your database data
const DISTRICTS = [
    {
        id: "1",
        name: "Kathmandu",
        municipalities: [
            {
                id: "1",
                name: "Kathmandu Metropolitan",
                wards: Array.from({ length: 32 }, (_, i) => i + 1),
            },
            {
                id: "2",
                name: "Kirtipur Municipality",
                wards: Array.from({ length: 10 }, (_, i) => i + 1),
            },
        ],
    },
    {
        id: "2",
        name: "Lalitpur",
        municipalities: [
            {
                id: "3",
                name: "Lalitpur Metropolitan",
                wards: Array.from({ length: 29 }, (_, i) => i + 1),
            },
            {
                id: "4",
                name: "Godawari Municipality",
                wards: Array.from({ length: 14 }, (_, i) => i + 1),
            },
        ],
    },
    // Add more districts as needed
];
class LocationController {
    static async getDistricts(req, res) {
        try {
            // In production, this would be a database query
            const districts = DISTRICTS.map((d) => ({
                id: d.id,
                name: d.name,
            }));
            res.json(ResponseHelper_1.ResponseHelper.success(districts));
        }
        catch (error) {
            console.error("Get districts error:", error);
            res.status(500).json(ResponseHelper_1.ResponseHelper.error("Failed to fetch districts"));
        }
    }
    static async getMunicipalities(req, res) {
        try {
            const { districtId } = req.params;
            const district = DISTRICTS.find((d) => d.id === districtId);
            if (!district) {
                res.status(404).json(ResponseHelper_1.ResponseHelper.error("District not found"));
                return;
            }
            res.json(ResponseHelper_1.ResponseHelper.success(district.municipalities.map((m) => ({
                id: m.id,
                name: m.name,
            }))));
        }
        catch (error) {
            console.error("Get municipalities error:", error);
            res
                .status(500)
                .json(ResponseHelper_1.ResponseHelper.error("Failed to fetch municipalities"));
        }
    }
    static async getWards(req, res) {
        try {
            const { districtId, municipalityId } = req.params;
            const district = DISTRICTS.find((d) => d.id === districtId);
            const municipality = district?.municipalities.find((m) => m.id === municipalityId);
            if (!municipality) {
                res.status(404).json(ResponseHelper_1.ResponseHelper.error("Municipality not found"));
                return;
            }
            res.json(ResponseHelper_1.ResponseHelper.success(municipality.wards));
        }
        catch (error) {
            console.error("Get wards error:", error);
            res.status(500).json(ResponseHelper_1.ResponseHelper.error("Failed to fetch wards"));
        }
    }
    // Admin CRUD operations for districts
    static async createDistrict(req, res) {
        try {
            const { error, value } = ValidationHelper_1.ValidationHelper.district.validate(req.body);
            if (error) {
                res
                    .status(400)
                    .json(ResponseHelper_1.ResponseHelper.error("Validation failed", 400, error.details));
                return;
            }
            const id = (0, utils_1.generateUUID)();
            const district = await (0, database_1.default)("districts")
                .insert({
                id,
                ...value,
                created_at: new Date(),
                updated_at: new Date(),
            })
                .returning("*");
            res
                .status(201)
                .json(ResponseHelper_1.ResponseHelper.success(district[0], "District created successfully"));
        }
        catch (error) {
            console.error("Create district error:", error);
            res.status(500).json(ResponseHelper_1.ResponseHelper.error("Failed to create district"));
        }
    }
    // Admin CRUD operations for municipalities
    static async createMunicipality(req, res) {
        try {
            const { error, value } = ValidationHelper_1.ValidationHelper.municipality.validate(req.body);
            if (error) {
                res
                    .status(400)
                    .json(ResponseHelper_1.ResponseHelper.error("Validation failed", 400, error.details));
                return;
            }
            const id = (0, utils_1.generateUUID)();
            const municipality = await (0, database_1.default)("municipalities")
                .insert({
                id,
                ...value,
                created_at: new Date(),
                updated_at: new Date(),
            })
                .returning("*");
            res
                .status(201)
                .json(ResponseHelper_1.ResponseHelper.success(municipality[0], "Municipality created successfully"));
        }
        catch (error) {
            console.error("Create municipality error:", error);
            res
                .status(500)
                .json(ResponseHelper_1.ResponseHelper.error("Failed to create municipality"));
        }
    }
    // Admin CRUD operations for wards
    static async createWard(req, res) {
        try {
            const { error, value } = ValidationHelper_1.ValidationHelper.ward.validate(req.body);
            if (error) {
                res
                    .status(400)
                    .json(ResponseHelper_1.ResponseHelper.error("Validation failed", 400, error.details));
                return;
            }
            const id = (0, utils_1.generateUUID)();
            const ward = await (0, database_1.default)("wards")
                .insert({
                id,
                ...value,
                created_at: new Date(),
                updated_at: new Date(),
            })
                .returning("*");
            res
                .status(201)
                .json(ResponseHelper_1.ResponseHelper.success(ward[0], "Ward created successfully"));
        }
        catch (error) {
            console.error("Create ward error:", error);
            res.status(500).json(ResponseHelper_1.ResponseHelper.error("Failed to create ward"));
        }
    }
    // Bulk upload operations
    static async bulkUploadDistricts(req, res) {
        try {
            // This would typically handle CSV file upload and parsing
            // For now, we'll return a mock response
            res.json(ResponseHelper_1.ResponseHelper.success({
                imported: 0,
                skipped: 0,
                errors: ["CSV upload functionality not implemented yet"],
            }, "Bulk upload completed"));
        }
        catch (error) {
            console.error("Bulk upload districts error:", error);
            res.status(500).json(ResponseHelper_1.ResponseHelper.error("Failed to upload districts"));
        }
    }
    static async bulkUploadMunicipalities(req, res) {
        try {
            // This would typically handle CSV file upload and parsing
            // For now, we'll return a mock response
            res.json(ResponseHelper_1.ResponseHelper.success({
                imported: 0,
                skipped: 0,
                errors: ["CSV upload functionality not implemented yet"],
            }, "Bulk upload completed"));
        }
        catch (error) {
            console.error("Bulk upload municipalities error:", error);
            res
                .status(500)
                .json(ResponseHelper_1.ResponseHelper.error("Failed to upload municipalities"));
        }
    }
    static async bulkUploadWards(req, res) {
        try {
            // This would typically handle CSV file upload and parsing
            // For now, we'll return a mock response
            res.json(ResponseHelper_1.ResponseHelper.success({
                imported: 0,
                skipped: 0,
                errors: ["CSV upload functionality not implemented yet"],
            }, "Bulk upload completed"));
        }
        catch (error) {
            console.error("Bulk upload wards error:", error);
            res.status(500).json(ResponseHelper_1.ResponseHelper.error("Failed to upload wards"));
        }
    }
}
exports.LocationController = LocationController;
