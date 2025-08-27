import { Request, Response } from "express";
import { ResponseHelper } from "../lib/helpers/ResponseHelper";

interface District {
  id: string;
  name: string;
  municipalities: Municipality[];
}

interface Municipality {
  id: string;
  name: string;
  wards: number[];
}

// This is sample data - you should replace this with your database data
const DISTRICTS: District[] = [
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

export class LocationController {
  static async getDistricts(req: Request, res: Response): Promise<void> {
    try {
      // In production, this would be a database query
      const districts = DISTRICTS.map((d) => ({
        id: d.id,
        name: d.name,
      }));

      res.json(ResponseHelper.success(districts));
    } catch (error) {
      console.error("Get districts error:", error);
      res.status(500).json(ResponseHelper.error("Failed to fetch districts"));
    }
  }

  static async getMunicipalities(req: Request, res: Response): Promise<void> {
    try {
      const { districtId } = req.params;
      const district = DISTRICTS.find((d) => d.id === districtId);

      if (!district) {
        res.status(404).json(ResponseHelper.error("District not found"));
        return;
      }

      res.json(
        ResponseHelper.success(
          district.municipalities.map((m) => ({
            id: m.id,
            name: m.name,
          }))
        )
      );
    } catch (error) {
      console.error("Get municipalities error:", error);
      res
        .status(500)
        .json(ResponseHelper.error("Failed to fetch municipalities"));
    }
  }

  static async getWards(req: Request, res: Response): Promise<void> {
    try {
      const { districtId, municipalityId } = req.params;
      const district = DISTRICTS.find((d) => d.id === districtId);
      const municipality = district?.municipalities.find(
        (m) => m.id === municipalityId
      );

      if (!municipality) {
        res.status(404).json(ResponseHelper.error("Municipality not found"));
        return;
      }

      res.json(ResponseHelper.success(municipality.wards));
    } catch (error) {
      console.error("Get wards error:", error);
      res.status(500).json(ResponseHelper.error("Failed to fetch wards"));
    }
  }
}
