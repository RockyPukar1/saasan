"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const knex_1 = __importDefault(require("knex"));
const config = {
    client: "postgresql",
    connection: {
        host: process.env.DB_HOST || "localhost",
        port: parseInt(process.env.DBPORT || "5432"),
        user: process.env.DB_USER || "postgres",
        password: process.env.DB_PASSWORD || "postgres",
        database: process.env.DB_NAME || "saasan",
    },
};
const db = (0, knex_1.default)(config);
exports.default = db;
