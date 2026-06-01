import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";
import { Booking } from "./Booking";

@Entity("reviews")
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  office_id: number;

  @Column()
  booking_id: number;

  @Column()
  rating: number;

  @Column({ type: "text", nullable: true })
  comment: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => Booking)
  @JoinColumn({ name: "booking_id" })
  booking: Booking;
}