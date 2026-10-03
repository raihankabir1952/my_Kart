import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) { }

  async create(data: Partial<User>): Promise<User> {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    const user = this.usersRepo.create(data);

    return this.usersRepo.save(user);
  }

  findByEmail(email: string): Promise<User | null> {
    return this.usersRepo.findOne({
      where: { email },
    });
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepo.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  findAll(): Promise<User[]> {
    return this.usersRepo.find();
  }

  async updateProfile(
    id: string,
    data: {
      name?: string;
      email?: string;
      phone?: string;
    },
  ): Promise<User> {
    const user = await this.findById(id);

    if (data.email && data.email !== user.email) {
      const existingUser = await this.findByEmail(data.email);

      if (existingUser && existingUser.id !== user.id) {
        throw new ConflictException(
          'Email is already in use',
        );
      }

      user.email = data.email;
    }

    if (data.name !== undefined) {
      user.name = data.name;
    }

    if (data.phone !== undefined) {
      user.phone = data.phone;
    }

    return this.usersRepo.save(user);
  }



  async save(user: User): Promise<User> {
    return this.usersRepo.save(user);
  }

async findByResetTokenHash(
  tokenHash: string,
): Promise<User | null> {
  return this.usersRepo.findOne({
    where: {
      resetPasswordTokenHash: tokenHash,
    },
  });
}

}
