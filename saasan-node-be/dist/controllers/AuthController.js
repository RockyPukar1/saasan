"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const ValidationHelper_1 = require("../lib/helpers/ValidationHelper");
const ResponseHelper_1 = require("../lib/helpers/ResponseHelper");
const UserModel_1 = require("../models/UserModel");
const AuthHelper_1 = require("../lib/helpers/AuthHelper");
const types_1 = require("../types");
class AuthController {
    static async register(req, res) {
        const { error, value } = ValidationHelper_1.ValidationHelper.userRegistration.validate(req.body, { abortEarly: false });
        if (error) {
            console.log(error);
            res
                .status(400)
                .json(ResponseHelper_1.ResponseHelper.error("Validate failed", 400, error.details));
            return;
        }
        // Check if user exists
        const existingUser = await UserModel_1.UserModel.findByEmail(value.email);
        if (existingUser) {
            res.status(409).json(ResponseHelper_1.ResponseHelper.error("User already exists"));
            return;
        }
        // Hash the password
        const hashedPassword = await AuthHelper_1.AuthHelper.hashPassword(value.password);
        // Create user
        const user = await UserModel_1.UserModel.create({
            email: value.email,
            password_hash: hashedPassword,
            full_name: value.fullName,
            phone: value.phone || null,
            district: value.district || null,
            municipality: value.municipality || null,
            ward_number: value.wardNumber || null,
            role: types_1.UserRole.CITIZEN,
            last_active_at: new Date(),
        });
        // Generate token
        const token = AuthHelper_1.AuthHelper.generateToken(user);
        const refreshToken = AuthHelper_1.AuthHelper.generateRefreshToken(user.id);
        // Remove password from response
        const { password_hash: _, ...userResponse } = user;
        res.status(201).json(ResponseHelper_1.ResponseHelper.success({
            user: userResponse,
            token,
            refreshToken,
        }, "User registered successfully"));
    }
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                res
                    .status(400)
                    .json(ResponseHelper_1.ResponseHelper.error("Email and password required"));
                return;
            }
            // Find user
            const user = await UserModel_1.UserModel.findByEmail(email);
            if (!user) {
                res.status(401).json(ResponseHelper_1.ResponseHelper.error("Invalid credentials"));
                return;
            }
            // Validate password
            const isValid = await AuthHelper_1.AuthHelper.comparePassword(password, user.password_hash);
            if (!isValid) {
                res.status(401).json(ResponseHelper_1.ResponseHelper.error("Invalid credentials"));
                return;
            }
            // Update last active
            await UserModel_1.UserModel.updateLastActive(user.id);
            // Generate tokens
            const token = AuthHelper_1.AuthHelper.generateToken(user);
            const refreshToken = AuthHelper_1.AuthHelper.generateRefreshToken(user.id);
            // Remove password from response
            const { password_hash, ...userResponse } = user;
            res.json(ResponseHelper_1.ResponseHelper.success({
                user: userResponse,
                token,
                refreshToken,
            }, "Login successful"));
        }
        catch (error) {
            console.error("Login error:", error);
            res.status(500).json(ResponseHelper_1.ResponseHelper.error("Login failed"));
        }
    }
    static async refreshToken(req, res) {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                res.status(401).json(ResponseHelper_1.ResponseHelper.error("Refresh token required"));
                return;
            }
            const decoded = AuthHelper_1.AuthHelper.verifyToken(refreshToken);
            const user = await UserModel_1.UserModel.findById(decoded.userId);
            if (!user) {
                res.status(401).json(ResponseHelper_1.ResponseHelper.error("Invalid status token"));
                return;
            }
            const newToken = AuthHelper_1.AuthHelper.generateToken(user);
            res.json(ResponseHelper_1.ResponseHelper.success({ token: newToken }));
        }
        catch (error) {
            console.error("Refresh token error:", error);
            res.status(401).json(ResponseHelper_1.ResponseHelper.error("Invalid refresh token"));
        }
    }
    static async getProfile(req, res) {
        try {
            const user = await UserModel_1.UserModel.findById(req.user.userId);
            if (!user) {
                res.status(404).json(ResponseHelper_1.ResponseHelper.error("User not found"));
                return;
            }
            const { password_hash, ...userResponse } = user;
            res.json(ResponseHelper_1.ResponseHelper.success(userResponse));
        }
        catch (error) {
            console.error("Get profile error:", error);
            res.status(500).json(ResponseHelper_1.ResponseHelper.error("Failed to fetch profile"));
        }
    }
}
exports.AuthController = AuthController;
