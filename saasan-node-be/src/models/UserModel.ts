import bcrypt from "bcryptjs";

import { User } from "../../../shared/types";
import db from "../config/database";
import { generateUUID } from "../lib/utils";

export class UserModel {
  static async create(userData: Partial<User>): Promise<User> {
    const id = generateUUID();

    const [user] = await db("users")
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

  static async findById(id: string): Promise<User | null> {
    const user = await db("users").where({ id }).first();
    return user || null;
  }

  static async findByEmail(email: string): Promise<User | null> {
    const user = await db("users").where({ email }).first();
    return user || null;
  }

  static async findByPhone(phone: string): Promise<User | null> {
    const user = await db("users").where({ phone }).first();
    return user || null;
  }

  static async update(id: string, updates: Partial<User>): Promise<User> {
    const [user] = await db("users")
      .where({ id })
      .update({ ...updates, updated_at: new Date() })
      .returning("*");
    return user;
  }

  static async validatePassword(
    user: User,
    password: string
  ): Promise<boolean> {
    return bcrypt.compare(password, user.password_hash);
  }

  static async updateLastActive(id: string): Promise<void> {
    await db("users").where({ id }).update({ last_active_at: new Date() });
  }
}
