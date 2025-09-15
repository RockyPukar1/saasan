"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.authenticateToken = void 0;
const ResponseHelper_1 = require("../lib/helpers/ResponseHelper");
const AuthHelper_1 = require("../lib/helpers/AuthHelper");
const UserModel_1 = require("../models/UserModel");
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(" ")[1];
        if (!token) {
            res.status(401).json(ResponseHelper_1.ResponseHelper.error("Access token required"));
            return;
        }
        const decoded = AuthHelper_1.AuthHelper.verifyToken(token);
        const user = await UserModel_1.UserModel.findById(decoded.userId);
        if (!user) {
            res.status(401).json(ResponseHelper_1.ResponseHelper.error("Invalid token"));
            return;
        }
        req.user = {
            userId: user.id,
            email: user.email,
            role: user.role,
        };
        next();
    }
    catch (error) {
        res.status(401).json(ResponseHelper_1.ResponseHelper.error("Invalid token"));
    }
};
exports.authenticateToken = authenticateToken;
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403).json(ResponseHelper_1.ResponseHelper.error("Insufficient permissions"));
            return;
        }
        next();
    };
};
exports.requireRole = requireRole;
