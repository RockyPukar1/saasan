import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import routes from "./routes";
import { errorHandler } from "./middleware/error-handler";
import { ResponseHelper } from "./lib/helpers/ResponseHelper";

dotenv.config();
const app = express();

// CORS configuration for mobile access
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:8081",
      "http://192.168.1.74:3000",
      "http://192.168.1.74:8081",
      "exp://192.168.1.74:8081",
      "exp://localhost:8081",
    ],
    credentials: true,
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
