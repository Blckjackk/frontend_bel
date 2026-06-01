import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, OneToMany, ManyToMany, JoinColumn, JoinTable } from "typeorm";
import { City } from "./City";
import { User } from "./User";
import { OfficeImage } from "./OfficeImage";
import { Feature } from "./Feature";

@Entity("offices")
export class Office {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  city_id!: number;

  @Column()
  provider_id!: number;

  @Column({ length: 255 })
  name!: string;

  @Column({ unique: true, length: 255 })
  slug!: string;

  @Column({ length: 255 })
  thumbnail!: string;

  @Column("text")
  about!: string;

  @Column("text")
  address!: string;

  @Column("bigint")
  price!: number;

  @Column({ length: 50 })
  duration_type!: string; // e.g., daily, monthly

  @Column({ default: true })
  is_open!: boolean;

  @Column({ default: false })
  is_full_booked!: boolean;

  @Column("float", { default: 0 })
  rating!: number;

  @Column("simple-json", { nullable: true })
  sales_contacts!: Array<{ name: string; role: string; photo: string; email: string; phone: string }> | null;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @DeleteDateColumn()
  deleted_at?: Date;

  @ManyToOne(() => City)
  @JoinColumn({ name: "city_id" })
  city!: City;

  @ManyToOne(() => User)
  @JoinColumn({ name: "provider_id" })
  provider!: User;

  @OneToMany(() => OfficeImage, (image) => image.office, { cascade: true })
  images!: OfficeImage[];

  @ManyToMany(() => Feature, { cascade: true })
  @JoinTable({
    name: "office_features",
    joinColumn: { name: "office_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "feature_id", referencedColumnName: "id" }
  })
  features!: Feature[];
}
