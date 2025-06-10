import { IsString, IsEmail, IsOptional, MinLength } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @MinLength(3)
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  currentPassword: string;

  @IsString()
  @IsOptional()
  @MinLength(6)
  newPassword?: string;
} 