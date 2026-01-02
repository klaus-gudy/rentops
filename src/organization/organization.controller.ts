import { Body, Controller, Post, Req } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';

@Controller('organization')
export class OrganizationController {
    constructor(private readonly organizationService: OrganizationService) {}

    @Post()
    async createOrganization(
        @Req() req: any,
        @Body() dto: CreateOrganizationDto
    ) {
        const userId = "1"; // replace with req.user.id when auth is set up
        return this.organizationService.createOrganization(userId, dto);
    }
}
