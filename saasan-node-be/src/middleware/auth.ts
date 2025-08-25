import { NextFunction, Request, Response } from "express";
import { ResponseHelper } from "../lib/helpers/ResponseHelper";
import { AuthHelper } from "../lib/helpers/AuthHelper";
import { UserModel } from "../models/UserModel";

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json(ResponseHelper.error("Access token required"));
      return;
    }

    const decoded = AuthHelper.verifyToken(token);
    const user = await UserModel.findById(decoded.userId);

    if (!user) {
      res.status(401).json(ResponseHelper.error("Invalid token"));
      return;
    }

    req.user = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    res.status(401).json(ResponseHelper.error("Invalid token"));
  }
};

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json(ResponseHelper.error("Insufficient permissions"));
      return;
    }

    next();
  };
};
