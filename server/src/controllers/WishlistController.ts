import { Controller, Post, Get, Delete, Param, Body } from "routing-controllers";
import { AppDataSource } from "../config/database";
import { Wishlist } from "../entities/Wishlist";

@Controller("/wishlists")
export class WishlistController {
  @Post("/add")
  async addWishlist(@Body() body: any) {
    try {
      const repo = AppDataSource.getRepository(Wishlist);
      const existing = await repo.findOne({
        where: { user_id: body.user_id, office_id: body.office_id }
      });
      if (existing) return { message: "Already in wishlist", data: existing };

      const wishlist = repo.create({
        user_id: body.user_id,
        office_id: body.office_id,
        office_title: body.office_title,
        office_slug: body.office_slug,
        office_image: body.office_image,
        office_price: body.office_price,
        office_location: body.office_location,
      });
      const saved = await repo.save(wishlist);
      return { message: "Added to wishlist", data: saved };
    } catch (error) {
      return { error: "Failed to add wishlist" };
    }
  }

  @Get("/user/:userId")
  async getUserWishlists(@Param("userId") userId: number) {
    try {
      const repo = AppDataSource.getRepository(Wishlist);
      const wishlists = await repo.find({
        where: { user_id: userId },
        order: { created_at: "DESC" },
      });
      return wishlists;
    } catch (error) {
      return { error: "Failed to fetch wishlists" };
    }
  }

  @Delete("/:id")
  async removeWishlist(@Param("id") id: number) {
    try {
      const repo = AppDataSource.getRepository(Wishlist);
      await repo.delete(id);
      return { message: "Removed from wishlist" };
    } catch (error) {
      return { error: "Failed to remove wishlist" };
    }
  }
}