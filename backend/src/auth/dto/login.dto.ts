import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email!: string;          // ← ! add

  @IsString()
  password!: string;       // ← ! add
}