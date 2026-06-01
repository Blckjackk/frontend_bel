import { JsonController, Post, Body } from "routing-controllers";
import { AppDataSource } from "../config/database";
import { User } from "../entities/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

@JsonController("/auth")
export class AuthController {

  @Post("/register")
  async register(@Body() body: { name: string; email: string; password: string; role?: string }) {
    const userRepo = AppDataSource.getRepository(User);

    const existing = await userRepo.findOne({ where: { email: body.email } });
    if (existing) {
      return { message: "Email already exists" };
    }

    const hashed = await bcrypt.hash(body.password, 10);
    const user = userRepo.create({
      name: body.name,
      email: body.email,
      password: hashed,
      role: body.role || "customer",
    });

    await userRepo.save(user);
    return { message: "Register success", user: { id: user.id, name: user.name, email: user.email, role: user.role } };
  }

  @Post("/login")
  async login(@Body() body: { email: string; password: string }) {
    const userRepo = AppDataSource.getRepository(User);

    const user = await userRepo.findOne({ where: { email: body.email } });
    if (!user) {
      return { message: "Invalid credentials" };
    }

    const valid = await bcrypt.compare(body.password, user.password);
    if (!valid) {
      return { message: "Invalid credentials" };
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );

    return {
      message: "Login success",
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    };
  }
}