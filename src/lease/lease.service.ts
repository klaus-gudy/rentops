import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Lease } from './entities/lease.entity';
import { Unit } from 'src/unit/entities/unit.entity'; // Assuming this exists
import { LeaseStatus } from 'src/common/enums/lease-statu.enum';
import { CreateLeaseDto } from './dto/create-lease.dto';
import { UnitStatus } from 'src/common/enums/unit-status.enum';

@Injectable()
export class LeaseService {
    constructor(
        @InjectRepository(Lease)
        private readonly leaseRepo: Repository<Lease>,

        @InjectRepository(Unit)
        private readonly unitRepo: Repository<Unit>,
    ) { }

    async createLease(orgId: string, dto: CreateLeaseDto) {
        const { unitId, startDate, endDate } = dto;

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


}

