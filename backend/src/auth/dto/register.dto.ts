import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email!: string;          // ← ! add

  @IsString()
  @MinLength(6)
  password!: string;       // ← ! add

  @IsString()
  name!: string;           // ← ! add

  @IsOptional()
  @IsString()
  phone?: string;          // ← already optional, ! lagbe na
}