import bcrypt from "bcryptjs";

import { User } from "../types";
import db from "../config/database";
import { generateUUID } from "../lib/utils";

export class UserModel {
  static async create(userData: Partial<User>): Promise<User> {
    const id = generateUUID();
    const hashedPassword = await bcrypt.hash(userData.passwordHash!, 12);

    const [user] = await db("users")
      .insert({
        ...userData,
        id,
        passwordHash: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
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
      .update({ ...updates, updatedAt: new Date() })
      .returning("*");
    return user;
  }

  static async validatePassword(
    user: User,
    password: string
  ): Promise<boolean> {
    return bcrypt.compare(password, user.passwordHash);
  }

  static async updateLastActive(id: string): Promise<void> {
    await db("users").where({ id }).update({ lastActiveAt: new Date() });
  }
}
