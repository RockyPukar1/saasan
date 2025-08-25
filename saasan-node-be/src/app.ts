import express from "express";
import dotenv from "dotenv";

import routes from "./routes";
import { errorHandler } from "./middleware/error-handler";
import { ResponseHelper } from "./lib/helpers/ResponseHelper";

dotenv.config();
const app = express();

// Routes
app.use("/api/v1", routes);

// Global error handler
app.use(errorHandler);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json(ResponseHelper.error("Route not found"));
});

export default app;
