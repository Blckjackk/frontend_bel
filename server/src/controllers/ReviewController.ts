import { Controller, Post, Get, Param, Body } from "routing-controllers";
import { AppDataSource } from "../config/database";
import { Review } from "../entities/Review";

@Controller("/reviews")
export class ReviewController {
  @Post("/create")
  async createReview(@Body() body: any) {
    try {
      const reviewRepo = AppDataSource.getRepository(Review);

      // Cek apakah sudah pernah review booking ini
      const existing = await reviewRepo.findOne({
        where: { booking_id: body.booking_id }
      });
      if (existing) return { error: "Already reviewed" };

      const review = reviewRepo.create({
        user_id: body.user_id,
        office_id: body.office_id,
        booking_id: body.booking_id,
        rating: body.rating,
        comment: body.comment,
      });
      const saved = await reviewRepo.save(review);
      return saved;
    } catch (error) {
      return { error: "Failed to create review" };
    }
  }

  @Get("/booking/:bookingId")
  async getReviewByBooking(@Param("bookingId") bookingId: number) {
    try {
      const reviewRepo = AppDataSource.getRepository(Review);
      const review = await reviewRepo.findOne({ where: { booking_id: bookingId } });
      return review || null;
    } catch (error) {
      return { error: "Failed to fetch review" };
    }
  }

  @Get("/office/:officeId")
  async getOfficeReviews(@Param("officeId") officeId: number) {
    try {
      const reviewRepo = AppDataSource.getRepository(Review);
      const reviews = await reviewRepo.find({
        where: { office_id: officeId },
        order: { created_at: "DESC" },
      });
      return reviews;
    } catch (error) {
      return { error: "Failed to fetch reviews" };
    }
  }
}