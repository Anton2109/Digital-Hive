import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Некорректный email' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Минимум 6 символов' })
  @MaxLength(20, { message: 'Максимум 20 символов' })
  username: string;

  @IsString()
  @MinLength(8, { message: 'Пароль слишком короткий (минимум 8 символов)' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message: 'Пароль должен содержать цифры, заглавные и строчные буквы',
  })
  password: string;
}
