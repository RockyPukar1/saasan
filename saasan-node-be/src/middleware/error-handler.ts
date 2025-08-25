import { NextFunction, Request, Response } from "express";
import { ResponseHelper } from "../lib/helpers/ResponseHelper";

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Global error:", error);

  if (error.type === "entity.parse.failed") {
    res.status(400).json(ResponseHelper.error("Invalid JSON payload"));
    return;
  }

  res.status(500).json(ResponseHelper.error("Internal server error"));
};
