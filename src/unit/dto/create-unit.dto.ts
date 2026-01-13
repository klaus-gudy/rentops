import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateUnitDto {
  @IsString()
  unitNumber: string;

  @IsNumber()
  rentAmount: number;

  @IsOptional()
  floor?: number;

  @IsOptional()
  size?: number;

  @IsOptional()
  type?: string;
}
