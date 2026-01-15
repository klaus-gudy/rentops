import {
  Controller,
  Post,
  Param,
  Body,
  Req,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { UnitService } from './unit.service';
import { UserRole } from 'src/common/enums/user-role.enum';
import { CreateUnitDto } from './dto/create-unit.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth-guard';
import { OrgRoleGuard } from 'src/common/guards/org-role.guard';
import { OrgContextGuard } from 'src/common/guards/org-context.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UpdateUnitDto } from './dto/update-unit.dto';

@Controller('property/:propertyId/units')
@UseGuards(JwtAuthGuard, OrgContextGuard, OrgRoleGuard)
export class UnitController {
  constructor(private readonly unitService: UnitService) {}

  @Post()
  @Roles(UserRole.LANDLORD_OWNER, UserRole.PROPERTY_MANAGER)
  async createUnit(
    @Param('propertyId') propertyId: string,
    @Body() dto: CreateUnitDto,
    @Req() req: Request & { organizationId: string },
  ) {
    return this.unitService.createUnit(
      req.organizationId,
      propertyId,
      dto,
    );
  }

  @Patch(':unitId')
  updateUnit(
    @Req() req,
    @Param('unitId') unitId: string,
    @Body() dto: UpdateUnitDto,
  ) {
    return this.unitService.updateUnit(
      req.user.organizationId,
      unitId,
      dto,
    );
  }
}
