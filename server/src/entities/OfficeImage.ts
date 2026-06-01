import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Office } from "./Office";

@Entity("office_images")
export class OfficeImage {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  office_id!: number;

  @Column({ length: 255 })
  image_path!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @ManyToOne(() => Office, (office) => office.images, { onDelete: "CASCADE" })
  @JoinColumn({ name: "office_id" })
  office!: Office;
}
