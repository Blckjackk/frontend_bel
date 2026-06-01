import { JsonController, Post, Get, Delete, Param, Body } from "routing-controllers";
import { AppDataSource } from "../config/database";
import { Favorite } from "../entities/Favorite";

@JsonController("/favorites")
export class FavoriteController {
  @Post("/add")
  async addFavorite(@Body() body: { user_id: number; office_id: number }) {
    try {
      const repo = AppDataSource.getRepository(Favorite);
      const existing = await repo.findOne({
        where: { user_id: body.user_id, office_id: body.office_id }
      });
      if (existing) return { message: "Already in favorites", data: existing };

      const fav = repo.create({
        user_id: body.user_id,
        office_id: body.office_id
      });
      const saved = await repo.save(fav);
      return { message: "Added to favorites", data: saved };
    } catch (error) {
      console.error(error);
      return { error: "Failed to add favorite" };
    }
  }

  @Get("/user/:userId")
  async getUserFavorites(@Param("userId") userId: number) {
    try {
      const repo = AppDataSource.getRepository(Favorite);
      return await repo.find({
        where: { user_id: userId },
        relations: ["office"],
        order: { created_at: "DESC" }
      });
    } catch {
      return { error: "Failed to fetch favorites" };
    }
  }

  @Delete("/user/:userId/office/:officeId")
  async removeByOffice(@Param("userId") userId: number, @Param("officeId") officeId: number) {
    try {
      const repo = AppDataSource.getRepository(Favorite);
      const fav = await repo.findOne({ where: { user_id: userId, office_id: officeId } });
      if (fav) {
        await repo.remove(fav);
        return { message: "Removed from favorites" };
      }
      return { error: "Favorite not found" };
    } catch {
      return { error: "Failed to remove favorite" };
    }
  }

  @Delete("/:id")
  async removeFavorite(@Param("id") id: number) {
    try {
      const repo = AppDataSource.getRepository(Favorite);
      await repo.delete(id);
      return { message: "Removed from favorites" };
    } catch {
      return { error: "Failed to remove favorite" };
    }
  }
}
