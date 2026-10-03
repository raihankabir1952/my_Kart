import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('ratings')
@Unique(['userId', 'productId'])
export class Rating {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  productId: string;

  @Column({
    type: 'int',
  })
  rating: number;

  @ManyToOne(
    () => User,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'userId',
  })
  user: User;

  @ManyToOne(
    () => Product,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'productId',
  })
  product: Product;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
