import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Lease } from './entities/lease.entity';
import { Unit } from 'src/unit/entities/unit.entity'; // Assuming this exists
import { LeaseStatus } from 'src/common/enums/lease-statu.enum';
import { CreateLeaseDto } from './dto/create-lease.dto';
import { UnitStatus } from 'src/common/enums/unit-status.enum';
import { OrganizationMember } from 'src/organization/entities/organization-member.entity';
import { UserRole } from 'src/common/enums/user-role.enum';

@Injectable()
export class LeaseService {
    constructor(
        @InjectRepository(Lease)
        private readonly leaseRepo: Repository<Lease>,

        @InjectRepository(Unit)
        private readonly unitRepo: Repository<Unit>,

        @InjectRepository(OrganizationMember)
        private readonly memberRepo: Repository<OrganizationMember>,
    ) { }

    async createLease(orgId: string, dto: CreateLeaseDto) {
        const { unitId, startDate, endDate, tenantId } = dto;

        // 0️⃣ Ensure unit exists and belongs to the organization
        const unit = await this.unitRepo.findOne({
            where: { id: unitId, organizationId: orgId },
        });
        if (!unit) {
            throw new BadRequestException('Unit does not exist or does not belong to this organization');
        }

        // 0️⃣ Ensure a tenant is assigned and is a valid member with TENANT role
        if (!tenantId) {
            throw new BadRequestException('A tenant must be assigned to the lease');
        }
        const member = await this.memberRepo.findOne({
            where: {
                id: tenantId,
                organizationId: orgId,
                isActive: true,
                role: UserRole.TENANT,
            },
        });
        if (!member) {
            throw new BadRequestException('Assigned user is not a tenant in this organization');
        }

        // 1️⃣ Prevent overlapping leases
        const overlapping = await this.leaseRepo.findOne({
            where: {
                unitId,
                organizationId: orgId,
                status: In([LeaseStatus.ACTIVE, LeaseStatus.PENDING]),
            },
        });

        if (overlapping) {
            throw new BadRequestException('Unit already has an active or upcoming lease');
        }

        if (unit.status === UnitStatus.OCCUPIED) {
            throw new BadRequestException('Unit is already occupied');
        }

        // 2️⃣ Determine lease status
        const now = new Date();
        const leaseStart = new Date(startDate);
        const status = leaseStart > now ? LeaseStatus.PENDING : LeaseStatus.ACTIVE;

        // 3️⃣ Create lease
        const lease = this.leaseRepo.create({
            ...dto,
            status,
            organizationId: orgId,
            referenceNumber: this.generateLeaseRef(orgId),
        });

        const savedLease = await this.leaseRepo.save(lease);

        // 4️⃣ Auto update unit status
        if (status === LeaseStatus.ACTIVE) {
            await this.unitRepo.update(unitId, { status: UnitStatus.OCCUPIED });
        }

        return savedLease;
    }
    generateLeaseRef(orgId: string) {
        if (!orgId) {
            throw new BadRequestException('Organization ID is required to generate lease reference');
        }
        const year = new Date().getFullYear();
        return `LEASE-${year}-${orgId.slice(0, 6)}-${Date.now()}`;
    }

    async terminateLease(orgId: string, leaseId: string) {
        const lease = await this.leaseRepo.findOne({
            where: { id: leaseId, organizationId: orgId },
        });

        if (!lease || lease.status !== LeaseStatus.ACTIVE) {
            throw new BadRequestException('Only active leases can be terminated');
        }

        lease.status = LeaseStatus.TERMINATED;
        lease.terminatedAt = new Date();
        await this.leaseRepo.save(lease);

        // Free unit
        await this.unitRepo.update(lease.unitId, { status: UnitStatus.VACANT });

        return { message: 'Lease terminated' };
    }

    async getOrganizationLeaseHistory(orgId: string) {
        return this.leaseRepo.find({
            where: { organizationId: orgId },
            relations: {
                unit: true,
                tenant: {
                    user: true,
                },
            },
            order: {
                createdAt: 'DESC',
            },
        });
    }

    async getUnitLeaseHistory(
        orgId: string,
        unitId: string,
    ) {
        const leases = await this.leaseRepo.find({
            where: {
                organizationId: orgId,
                unitId,
            },
            relations: {
                tenant: {
                    user: true,
                },
            },
            order: {
                startDate: 'DESC',
            },
        });

        if (!leases.length) {
            throw new NotFoundException(
                'No lease history found for this unit',
            );
        }

        return leases;
    }

    async getTenantLeaseHistory(
        organizationId: string,
        tenantId: string,
    ) {
        const leases = await this.leaseRepo.find({
            where: {
                organizationId,
                tenantId,
            },
            relations: {
                unit: {
                    property: true,
                },
            },
            order: {
                startDate: 'DESC',
            },
        });

        if (!leases.length) {
            throw new NotFoundException(
                'No lease history found for this tenant',
            );
        }

        return leases;
    }


}

