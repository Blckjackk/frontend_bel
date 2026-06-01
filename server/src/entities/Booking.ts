import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { User } from "./User";
import { Office } from "./Office";
import { Transaction } from "./Transaction";

@Entity("bookings")
export class Booking {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true, length: 100 })
  booking_trx_id!: string;

  @Column()
  user_id!: number;

  @Column()
  office_id!: number;

  @Column("bigint")
  price!: number;

  @Column({
    type: "enum",
    enum: ["pending", "paid", "confirmed", "cancelled", "completed"],
    default: "pending"
  })
  status!: string;

  @Column("bigint")
  total_amount!: number;

  @Column({ length: 50 })
  duration!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user!: User;

  @ManyToOne(() => Office)
  @JoinColumn({ name: "office_id" })
  office!: Office;

  @OneToMany(() => Transaction, (transaction) => transaction.booking, { cascade: true })
  transactions!: Transaction[];
}