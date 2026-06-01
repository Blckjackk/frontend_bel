import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Unique } from "typeorm";
import { User } from "./User";
import { Office } from "./Office";

@Entity("favorites")
@Unique(["user_id", "office_id"])
export class Favorite {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  user_id!: number;

  @Column()
  office_id!: number;

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
