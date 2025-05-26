import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({ description: 'JWT токен доступа' })
  accessToken: string;

  @ApiProperty({ description: 'Refresh токен' })
  refreshToken: string;

  @ApiProperty({ description: 'ID пользователя' })
  userId: number;

  @ApiProperty({ description: 'Email пользователя' })
  email: string;

  @ApiProperty({ description: 'Имя пользователя' })
  username: string;
} 