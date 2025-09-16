"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const error_handler_1 = require("./middleware/error-handler");
const ResponseHelper_1 = require("./lib/helpers/ResponseHelper");
dotenv_1.default.config();
const app = (0, express_1.default)();
// CORS configuration for mobile and web access
app.use((0, cors_1.default)({
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
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.use("/api/v1", routes_1.default);
// Global error handler
app.use(error_handler_1.errorHandler);
// 404 handler
app.use((req, res) => {
    res.status(404).json(ResponseHelper_1.ResponseHelper.error("Route not found"));
});
exports.default = app;
