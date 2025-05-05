import { IsString, IsNotEmpty, IsNumber, IsOptional, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

class SystemRequirementsDto {
  @IsString()
  @IsNotEmpty()
  windows: string;

  @IsString()
  @IsNotEmpty()
  processor: string;

  @IsString()
  @IsNotEmpty()
  RAM: string;

  @IsString()
  @IsNotEmpty()
  graphicsCard: string;

  @IsString()
  @IsNotEmpty()
  DirectX: string;

  @IsString()
  @IsNotEmpty()
  DiskSpace: string;
}

class GameInfoDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  release_date: string;

  @IsString()
  @IsNotEmpty()
  developer: string;

  @IsString()
  @IsNotEmpty()
  publisher: string;

  @IsNumber()
  @IsOptional()
  rating?: number;

  @IsString()
  @IsNotEmpty()
  img: string;
}

export class CreateGameDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  img_path: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ValidateNested()
  @Type(() => SystemRequirementsDto)
  @IsOptional()
  minimumRequirements?: SystemRequirementsDto;

  @ValidateNested()
  @Type(() => SystemRequirementsDto)
  @IsOptional()
  recommendedRequirements?: SystemRequirementsDto;

  @ValidateNested()
  @Type(() => GameInfoDto)
  @IsOptional()
  gameInfo?: GameInfoDto;
} 