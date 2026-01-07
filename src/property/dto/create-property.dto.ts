import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePropertyDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  address?: string;
}