import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity("wishlists")
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  office_id: number;

  @Column()
  office_title: string;

  @Column()
  office_slug: string;

  @Column()
  office_image: string;

  @Column()
  office_price: number;

  @Column()
  office_location: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;
}