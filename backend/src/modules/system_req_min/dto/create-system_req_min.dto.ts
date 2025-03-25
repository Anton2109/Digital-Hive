import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateSystemReqMinDto {
  @IsNotEmpty()
  @IsString()
  windows: string;

  @IsNotEmpty()
  @IsString()
  processor: string;

  @IsNotEmpty()
  @IsString()
  RAM: string;

  @IsNotEmpty()
  @IsString()
  graphicsCard: string;

  @IsNotEmpty()
  @IsString()
  DirectX: string;

  @IsNotEmpty()
  @IsString()
  DiskSpace: string;

  @IsNotEmpty()
  @IsNumber()
  game_id: number;
}
