import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth-guard';
import { OrgContextGuard } from 'src/common/guards/org-context.guard';
import { OrgRoleGuard } from 'src/common/guards/org-role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';
import { AssignManagerDto } from './dto/assign-manager.dto';

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

    @Get()
    async listProperties(
        @Req() req: Request & { organizationId: string },
    ) {
        return this.propertyService.findAll(req.organizationId);
    }

    @Get(':id')
    async getProperty(
        @Param('id') id: string,
        @Req() req: Request & { organizationId: string },
    ) {
        return this.propertyService.findOne(
            req.organizationId,
            id,
        );
    }

    @Delete(':id')
    async softDelete(
        @Param('id') id: string,
        @Req() req: Request & { organizationId: string },
    ) {
        return this.propertyService.softDelete(
            req.organizationId,
            id,
        );
    }

    @Patch(':id/assign-manager')
    @Roles(UserRole.LANDLORD_OWNER)
    async assignManager(
        @Param('id') propertyId: string,
        @Body() dto: AssignManagerDto,
        @Req() req: Request & { organizationId: string; user: any },
    ) {
        return this.propertyService.assignManager(
            req.organizationId,
            propertyId,
            dto.managerId,
            req.user.id,
        );
    }
}
