import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth-guard';
import { OrgContextGuard } from 'src/common/guards/org-context.guard';

@Controller('property')
@UseGuards(JwtAuthGuard, OrgContextGuard)
export class PropertyController {
    constructor(private readonly propertyService: PropertyService) { }

    @Post()
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
