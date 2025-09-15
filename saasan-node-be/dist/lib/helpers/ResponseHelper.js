"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseHelper = void 0;
class ResponseHelper {
    static success(data, message = "Success", meta) {
        return {
            success: true,
            message,
            data,
            meta,
            timestamp: new Date().toISOString(),
        };
    }
    static error(message, statusCode = 500, errors) {
        return {
            success: false,
            message,
            statusCode,
            errors,
            timestamp: new Date().toISOString(),
        };
    }
    static paginated(data, total, page, limit) {
        return this.success(data, "Data retrieved successfully", {
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasNext: page * limit < total,
                hasPrev: page > 1,
            },
        });
    }
}
exports.ResponseHelper = ResponseHelper;
