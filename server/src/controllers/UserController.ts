import { Controller, Get, Patch, Param, Body } from "routing-controllers";
import { AppDataSource } from "../config/database";
import { User } from "../entities/User";

@Controller("/users")
export class UserController {
  @Get("/")
  async getAllUsers() {
    try {
      const userRepo = AppDataSource.getRepository(User);
      const users = await userRepo.find({
        select: ["id", "name", "email", "role", "created_at"],
        order: { created_at: "DESC" },
      });
      return users;
    } catch {
      return { error: "Failed to fetch users" };
    }
  }

  @Patch("/:id/role")
  async updateUserRole(@Param("id") id: number, @Body() body: { role: string }) {
    try {
      const validRoles = ["admin", "customer", "provider"];
      if (!validRoles.includes(body.role)) {
        return { error: "Invalid role" };
      }
      const userRepo = AppDataSource.getRepository(User);
      const user = await userRepo.findOne({ where: { id } });
      if (!user) return { error: "User not found" };

      user.role = body.role;
      await userRepo.save(user);
      return { id: user.id, name: user.name, email: user.email, role: user.role };
    } catch {
      return { error: "Failed to update user role" };
    }
  }
}
