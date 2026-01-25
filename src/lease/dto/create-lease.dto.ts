import { IsDateString, IsNumber, IsUUID } from "class-validator";

export class CreateLeaseDto {

  @IsUUID()
  unitId: string;

  @IsUUID()
  tenantId: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsNumber()
  rentAmount: number;
}
