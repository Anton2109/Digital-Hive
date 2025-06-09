import { IsString, IsNotEmpty, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class SystemRequirementsDto {
  @IsString()
  @IsOptional()
  windows?: string;

  @IsString()
  @IsOptional()
  processor?: string;

  @IsString()
  @IsOptional()
  RAM?: string;

  @IsString()
  @IsOptional()
  graphicsCard?: string;

  @IsString()
  @IsOptional()
  DirectX?: string;

  @IsString()
  @IsOptional()
  DiskSpace?: string;
}

class GameInfoDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  release_date?: string;

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