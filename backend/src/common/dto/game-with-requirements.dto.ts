import { Type } from 'class-transformer';
import {
  ValidateNested,
  IsNotEmpty,
  IsString,
  IsNumber,
} from 'class-validator';
import { CreateSystemReqMinDto } from '../../modules/system_req_min/dto/create-system_req_min.dto';
import { CreateSystemReqMaxDto } from '../../modules/system_req_max/dto/create-system_req_max.dto';

export class GameWithRequirementsDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  img: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsString()
  description: string;

  @ValidateNested()
  @Type(() => CreateSystemReqMinDto)
  minimumRequirements: CreateSystemReqMinDto;

  @ValidateNested()
  @Type(() => CreateSystemReqMaxDto)
  recommendedRequirements: CreateSystemReqMaxDto;
}
