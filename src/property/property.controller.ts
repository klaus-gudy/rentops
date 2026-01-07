import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth-guard';
import { OrgContextGuard } from 'src/common/guards/org-context.guard';
import { OrgRoleGuard } from 'src/common/guards/org-role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';

@Controller('property')
@UseGuards(JwtAuthGuard, OrgContextGuard, OrgRoleGuard)
export class PropertyController {
    constructor(private readonly propertyService: PropertyService) { }

    @Post()
    @Roles(UserRole.LANDLORD_OWNER)
    async createProperty(
        @Req() req: Request & { organizationId: string },
        @Body() dto: CreatePropertyDto,
    ) {
        console.log('ORG ID:', req.organizationId);
        return this.propertyService.create(
            req.organizationId,
            dto,
        );
    }
}
