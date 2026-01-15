import { IsOptional, IsString, IsEnum, IsNumber, IsBoolean } from 'class-validator';
import { UnitStatus } from 'src/common/enums/unit-status.enum';

export class UpdateUnitDto {
  @IsOptional()
  @IsString()
  unitNumber?: string;

  @IsOptional()
  @IsNumber()
  floor?: number;

  @IsOptional()
  @IsNumber()
  size?: number;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsNumber()
  rentAmount?: number;

  @IsOptional()
  @IsEnum(UnitStatus)
  status?: UnitStatus;

}
