import { Request, Response } from "express";
import { ValidationHelper } from "../lib/helpers/ValidationHelper";
import { ResponseHelper } from "../lib/helpers/ResponseHelper";
import { UserModel } from "../models/UserModel";
import { AuthHelper } from "../lib/helpers/AuthHelper";
import { UserRole } from "../types";

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    const { error, value } = ValidationHelper.userRegistration.validate(
      req.body,
      { abortEarly: false }
    );

    if (error) {
      res
        .status(400)
        .json(ResponseHelper.error("Validate failed", 400, error.details));
      return;
    }

    // Check if user exists
    const existingUser = await UserModel.findByEmail(value.email);
    if (existingUser) {
      res.status(409).json(ResponseHelper.error("User already exists"));
      return;
    }

    // Hash the password
    const hashedPassword = await AuthHelper.hashPassword(value.password);

    // Create user
    const user = await UserModel.create({
      email: value.email,
      password_hash: hashedPassword,
      full_name: value.fullName,
      phone: value.phone || null,
      district: value.district || null,
      municipality: value.municipality || null,
      ward_number: value.wardNumber || null,
      role: UserRole.CITIZEN,
      last_active_at: new Date(),
    });

    // Generate token
    const token = AuthHelper.generateToken(user);
    const refreshToken = AuthHelper.generateRefreshToken(user.id);

    // Remove password from response
    const { password_hash: _, ...userResponse } = user;

    res.status(201).json(
      ResponseHelper.success(
        {
          user: userResponse,
          token,
          refreshToken,
        },
        "User registered successfully"
      )
    );
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res
          .status(400)
          .json(ResponseHelper.error("Email and password required"));
        return;
      }

      // Find user
      const user = await UserModel.findByEmail(email);
      if (!user) {
        res.status(401).json(ResponseHelper.error("Invalid credentials"));
        return;
      }

      // Validate password
      const isValid = await AuthHelper.comparePassword(
        password,
        user.password_hash
      );
      if (!isValid) {
        res.status(401).json(ResponseHelper.error("Invalid credentials"));
        return;
      }

      // Update last active
      await UserModel.updateLastActive(user.id);

      // Generate tokens
      const token = AuthHelper.generateToken(user);
      const refreshToken = AuthHelper.generateRefreshToken(user.id);

      // Remove password from response
      const { password_hash, ...userResponse } = user;

      res.json(
        ResponseHelper.success(
          {
            user: userResponse,
            token,
            refreshToken,
          },
          "Login successful"
        )
      );
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json(ResponseHelper.error("Login failed"));
    }
  }

  static async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(401).json(ResponseHelper.error("Refresh token required"));
        return;
      }

      const decoded = AuthHelper.verifyToken(refreshToken);
      const user = await UserModel.findById(decoded.userId);

      if (!user) {
        res.status(401).json(ResponseHelper.error("Invalid status token"));
        return;
      }

      const newToken = AuthHelper.generateToken(user);

      res.json(ResponseHelper.success({ token: newToken }));
    } catch (error) {
      console.error("Refresh token error:", error);
      res.status(401).json(ResponseHelper.error("Invalid refresh token"));
    }
  }

  static async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const user = await UserModel.findById(req.user.userId);

      if (!user) {
        res.status(404).json(ResponseHelper.error("User not found"));
        return;
      }

      const { password_hash, ...userResponse } = user;

      res.json(ResponseHelper.success(userResponse));
    } catch (error) {
      console.error("Get profile error:", error);
      res.status(500).json(ResponseHelper.error("Failed to fetch profile"));
    }
  }
  // const user = await UserModel.findById(req.user.userId);

  // if (!user)
}
