import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";
import { Office } from "./Office";

@Entity("testimonials")
export class Testimonial {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  user_id!: number;

  @Column()
  office_id!: number;

  @Column("int")
  rating!: number;

  @Column("text")
  message!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @ManyToOne(() => Office, { onDelete: "CASCADE" })
  @JoinColumn({ name: "office_id" })
  office!: Office;
}
