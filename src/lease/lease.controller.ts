import { Controller, Post, Body, Req, UseGuards, Patch, Param } from '@nestjs/common';
import { LeaseService } from './lease.service';
import { CreateLeaseDto } from './dto/create-lease.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth-guard';
import { OrgContextGuard } from 'src/common/guards/org-context.guard';
import { OrgRoleGuard } from 'src/common/guards/org-role.guard';

@Controller('lease')
@UseGuards(JwtAuthGuard, OrgContextGuard)
export class LeaseController {
    constructor(private readonly leaseService: LeaseService) { }

    @Post()
    createLease(@Req() req: Request & { organizationId: string }, @Body() dto: CreateLeaseDto) {
        return this.leaseService.createLease(req.organizationId, dto);
    }

    @Patch(':id/terminate')
    terminate(@Req() req, @Param('id') id: string) {
        return this.leaseService.terminateLease(req.user.organizationId, id);
    }
}
