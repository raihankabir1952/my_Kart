import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  slug!: string; // URL-friendly name (jemon "iphone-15-pro")

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  comparePrice?: number; // original price (discount dekhanor jonno)

  @Column({ default: 0 })
  stock!: number;

  @Column({ default: 'general' })
  category!: string;

  @Column('text', { array: true, default: [] })
  images!: string[]; // multiple image URLs

  @Column({ default: true })
  isActive!: boolean; // soft delete er moto - false hole dekhabe na

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}