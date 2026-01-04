import {  Controller, Get } from '@nestjs/common';
import { OrganizationService } from './organization.service';

@Controller('organization')
export class OrganizationController {
    constructor(private readonly organizationService: OrganizationService) { }

    @Get()
    async listOrganizations() {
        return {
            message: 'Organization endpoints will be added here',
        };
    }
}
