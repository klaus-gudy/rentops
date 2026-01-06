import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { OrganizationService } from './organization.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth-guard';
import { InviteMemberDto } from './dto/invite-member.dto';
import { OrgContextGuard } from 'src/common/guards/org-context.guard';
import { OrgRoleGuard } from 'src/common/guards/org-role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';
import { ChangeMemberRoleDto } from './dto/change-member-role.dto';

@Controller('organization')
@UseGuards(JwtAuthGuard, OrgContextGuard, OrgRoleGuard)
export class OrganizationController {
    constructor(private readonly organizationService: OrganizationService) { }

    @Get('members')
    @Roles(UserRole.LANDLORD_OWNER, UserRole.PROPERTY_MANAGER)
    async listMembers(
        @Req() req: Request & { organizationId: string },
    ) {
        return this.organizationService.listOrganizationMembers(
            req.organizationId,
        );
    }

    @Post('/invite')
    @Roles(UserRole.LANDLORD_OWNER)
    async inviteTenant(
        @Body() dto: InviteMemberDto,
        @Req() req: Request & { user?: any; organizationId: string },
    ) {
        return this.organizationService.inviteTenant(
            req.organizationId,
            req.user,
            dto,
        );
    }

    @Delete('members/:memberId')
    @Roles(UserRole.LANDLORD_OWNER)
    async removeMember(
        @Param('memberId') memberId: string,
        @Req() req: Request & { organizationId: string },
    ) {
        return this.organizationService.softRemoveMember(
            req.organizationId,
            memberId,
        );
    }

    @Patch('members/:memberId/role')
    @Roles(UserRole.LANDLORD_OWNER)
    async changeMemberRole(
        @Param('memberId') memberId: string,
        @Body() dto: ChangeMemberRoleDto,
        @Req() req: Request & { organizationId: string; user: any },
    ) {
        return this.organizationService.changeMemberRole(
            req.organizationId,
            req.user.id,
            memberId,
            dto,
        );
    }
}
