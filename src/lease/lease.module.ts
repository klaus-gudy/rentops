import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaseService } from './lease.service';
import { LeaseController } from './lease.controller';
import { Lease } from './entities/lease.entity';
import { Unit } from 'src/unit/entities/unit.entity'; // Assuming this exists
import { OrganizationMember } from 'src/organization/entities/organization-member.entity'; // Assuming this exists

@Module({
  imports: [
    TypeOrmModule.forFeature([Lease, Unit, OrganizationMember]),
  ],
  providers: [LeaseService],
  controllers: [LeaseController]
})
export class LeaseModule {}
