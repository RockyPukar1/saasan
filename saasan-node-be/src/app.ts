import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import routes from "./routes";
import { errorHandler } from "./middleware/error-handler";
import { ResponseHelper } from "./lib/helpers/ResponseHelper";

dotenv.config();
const app = express();

// CORS configuration for mobile and web access
app.use(
  cors({
    origin: [
      "http://localhost:3000", // React Native web
      "http://localhost:5173", // React Dashboard
      "http://localhost:8081", // Expo dev server
      "http://localhost:8082", // Expo dev server (new port)
      "http://192.168.1.74:3000",
      "http://192.168.1.74:5173", // React Dashboard on network
      "http://192.168.1.74:8081",
      "http://192.168.1.74:8082", // Expo dev server (new port)
      "http://192.168.1.74:5000", // Backend API access
      "exp://192.168.1.74:8081",
      "exp://192.168.1.74:8082",
      "exp://localhost:8081",
      "exp://localhost:8082",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1", routes);

// Global error handler
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json(ResponseHelper.error("Route not found"));
});

export default app;
