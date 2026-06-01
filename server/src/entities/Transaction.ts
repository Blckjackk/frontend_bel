import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Booking } from "./Booking";

@Entity("transactions")
export class Transaction {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  booking_id!: number;

  @Column({ length: 100 })
  payment_method!: string;

  @Column({ length: 255 })
  payment_proof!: string;

  @Column("bigint")
  amount!: number;

  @Column({ type: "enum", enum: ["pending", "verified", "rejected"], default: "pending" })
  status!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @ManyToOne(() => Booking, { onDelete: "CASCADE" })
  @JoinColumn({ name: "booking_id" })
  booking!: Booking;
}
