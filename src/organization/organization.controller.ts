import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { OrganizationService } from './organization.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth-guard';
import { InviteMemberDto } from './dto/invite-member.dto';

@Controller('organization')
@UseGuards(JwtAuthGuard)
export class OrganizationController {
    constructor(private readonly organizationService: OrganizationService) { }

    @Get()
    async listOrganizations() {
        return {
            message: 'Organization endpoints will be added here',
        };
    }

    @Post(':orgId/invite')
    async inviteTenant(
        @Param('orgId') orgId: string,
        @Body() dto: InviteMemberDto,
        @Req() req: Request & { user?: any },
    ) {
        return this.organizationService.inviteTenant(
            orgId,
            req.user,
            dto,
        );
    }
}
