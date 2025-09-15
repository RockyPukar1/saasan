"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const ResponseHelper_1 = require("../lib/helpers/ResponseHelper");
const errorHandler = (error, req, res, next) => {
    console.error("Global error:", error);
    if (error.type === "entity.parse.failed") {
        res.status(400).json(ResponseHelper_1.ResponseHelper.error("Invalid JSON payload"));
        return;
    }
    res.status(500).json(ResponseHelper_1.ResponseHelper.error("Internal server error"));
};
exports.errorHandler = errorHandler;
