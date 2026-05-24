import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

// User er kon role thakbe - eta enum (predefined values only)
export enum UserRole {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
}

@Entity('users') // 'users' = database table er naam
export class User {
  @PrimaryGeneratedColumn('uuid') // unique ID, auto-generate hobe
  id: string;

  @Column({ unique: true }) // ekta email ekbar er beshi register korte parbe na
  email: string;

  @Column() // password (encrypted thakbe, plain na)
  password: string;

  @Column()
  name: string;

  @Column({ nullable: true }) // optional - na dileo cholbe
  phone: string;

  @Column({ nullable: true, type: 'text' })
  address: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CUSTOMER, // default e sob user 'customer'
  })
  role: UserRole;

  @CreateDateColumn() // jokhon create hoyeche
  createdAt: Date;

  @UpdateDateColumn() // last update kobe hoyeche
  updatedAt: Date;
}