import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class CreateGameDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly img: string;

  @IsInt()
  @IsNotEmpty()
  readonly price: number;
}
