import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateGameInfoDto {
  @IsNotEmpty()
  @IsNumber()
  gameId: number;

  @IsNotEmpty()
  @IsString()
  img: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
