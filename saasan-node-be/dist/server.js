"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const database_1 = __importDefault(require("./config/database"));
const PORT = process.env.PORT || 5000;
async function startServer() {
    try {
        // Test database connection
        await database_1.default.raw("SELECT 1+1 as result");
        console.log("✅ Database connected successfully");
        // start server
        app_1.default.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
        });
    }
    catch (error) {
        console.log("❌ Failed to start server:", error);
        process.exit(1);
    }
}
startServer();
