import { Controller, Post, Get, Patch, Param, Body, Req } from "routing-controllers";
import { AppDataSource } from "../config/database";
import { Booking } from "../entities/Booking";
import { Transaction } from "../entities/Transaction";
import { Office } from "../entities/Office";

@Controller("/bookings")
export class BookingController {
  @Get("/all")
  async getAllBookings() {
    try {
      const bookingRepo = AppDataSource.getRepository(Booking);
      return await bookingRepo.find({
        relations: ["user", "office", "transactions"],
        order: { created_at: "DESC" },
      });
    } catch {
      return { error: "Failed to fetch bookings" };
    }
  }

  @Post("/create")
  async createBooking(@Body() body: any) {
    try {
      const bookingRepo = AppDataSource.getRepository(Booking);
      const officeRepo = AppDataSource.getRepository(Office);

      const office = await officeRepo.findOne({ where: { id: Number(body.office_id) } });
      if (!office) return { error: "Office not found" };

      if (office.is_full_booked) {
        return { error: "Maaf, kantor ini sudah penuh terpesan (fully booked)!" };
      }

      // Generate unique transaction ID
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
      const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
      const trxId = `BELVA-${dateStr}-${randomStr}`;

      const booking = bookingRepo.create({
        booking_trx_id: trxId,
        user_id: Number(body.user_id),
        office_id: Number(body.office_id),
        price: Number(body.price),
        total_amount: Number(body.price),
        duration: body.duration || "20 days",
        status: "pending",
      });

      return await bookingRepo.save(booking);
    } catch (error) {
      console.error(error);
      return { error: "Failed to create booking" };
    }
  }

  @Patch("/:id/payment")
  async uploadPaymentProof(@Param("id") id: number, @Body() body: { payment_proof: string; payment_method?: string }) {
    try {
      const bookingRepo = AppDataSource.getRepository(Booking);
      const txRepo = AppDataSource.getRepository(Transaction);

      const booking = await bookingRepo.findOne({ where: { id } });
      if (!booking) return { error: "Booking not found" };

      // Create a Transaction entry
      const transaction = txRepo.create({
        booking_id: booking.id,
        payment_method: body.payment_method || "Bank Transfer",
        payment_proof: body.payment_proof,
        amount: booking.total_amount,
        status: "pending"
      });

      await txRepo.save(transaction);

      // Update booking status to 'paid' (waiting verification)
      booking.status = "paid";
      await bookingRepo.save(booking);

      return await bookingRepo.findOne({
        where: { id: booking.id },
        relations: ["transactions"]
      });
    } catch (error) {
      console.error(error);
      return { error: "Failed to upload payment proof" };
    }
  }

  @Patch("/:id/verify")
  async verifyBookingPayment(@Param("id") id: number, @Body() body: { status: "confirmed" | "cancelled" }) {
    try {
      const bookingRepo = AppDataSource.getRepository(Booking);
      const officeRepo = AppDataSource.getRepository(Office);
      const txRepo = AppDataSource.getRepository(Transaction);

      const booking = await bookingRepo.findOne({ where: { id }, relations: ["transactions"] });
      if (!booking) return { error: "Booking not found" };

      booking.status = body.status;
      await bookingRepo.save(booking);

      // Update related transactions
      if (booking.transactions && booking.transactions.length > 0) {
        for (const tx of booking.transactions) {
          tx.status = body.status === "confirmed" ? "verified" : "rejected";
          await txRepo.save(tx);
        }
      }

      // If confirmed, set office fully booked
      if (body.status === "confirmed") {
        const office = await officeRepo.findOne({ where: { id: booking.office_id } });
        if (office) {
          office.is_full_booked = true;
          await officeRepo.save(office);
        }
      }

      return booking;
    } catch (error) {
      console.error(error);
      return { error: "Failed to verify booking status" };
    }
  }

  @Get("/user/:userId")
  async getUserBookings(@Param("userId") userId: number) {
    try {
      const bookingRepo = AppDataSource.getRepository(Booking);
      return await bookingRepo.find({
        where: { user_id: userId },
        relations: ["office", "office.city", "transactions"],
        order: { created_at: "DESC" },
      });
    } catch (error) {
      console.error(error);
      return { error: "Failed to fetch user bookings" };
    }
  }

  @Get("/:id")
  async getBooking(@Param("id") id: number) {
    try {
      const bookingRepo = AppDataSource.getRepository(Booking);
      const booking = await bookingRepo.findOne({
        where: { id },
        relations: ["user", "office", "office.city", "transactions"]
      });
      if (!booking) return { error: "Booking not found" };
      return booking;
    } catch (error) {
      return { error: "Failed to fetch booking detail" };
    }
  }
}