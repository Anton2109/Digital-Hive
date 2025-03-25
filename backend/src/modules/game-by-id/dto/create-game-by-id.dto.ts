import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';

export class CreateGameByIdDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  img: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @IsNotEmpty()
  @IsNumber()
  windows: number;

  @IsNotEmpty()
  @IsString()
  processor: string;

  @IsNotEmpty()
  @IsNumber()
  RAM: number;

  @IsNotEmpty()
  @IsString()
  graphicsCard: string;

  @IsNotEmpty()
  @IsNumber()
  DirectX: number;

  @IsNotEmpty()
  @IsString()
  DiskSpace: string;
}
