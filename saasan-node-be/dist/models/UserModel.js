"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_1 = __importDefault(require("../config/database"));
const utils_1 = require("../lib/utils");
class UserModel {
    static async create(userData) {
        const id = (0, utils_1.generateUUID)();
        const [user] = await (0, database_1.default)("users")
            .insert({
            ...userData,
            id,
            created_at: new Date(),
            updated_at: new Date(),
            last_active_at: new Date(),
        })
            .returning("*");
        return user;
    }
    static async findById(id) {
        const user = await (0, database_1.default)("users").where({ id }).first();
        return user || null;
    }
    static async findByEmail(email) {
        const user = await (0, database_1.default)("users").where({ email }).first();
        return user || null;
    }
    static async findByPhone(phone) {
        const user = await (0, database_1.default)("users").where({ phone }).first();
        return user || null;
    }
    static async update(id, updates) {
        const [user] = await (0, database_1.default)("users")
            .where({ id })
            .update({ ...updates, updated_at: new Date() })
            .returning("*");
        return user;
    }
    static async validatePassword(user, password) {
        return bcryptjs_1.default.compare(password, user.password_hash);
    }
    static async updateLastActive(id) {
        await (0, database_1.default)("users").where({ id }).update({ last_active_at: new Date() });
    }
}
exports.UserModel = UserModel;
