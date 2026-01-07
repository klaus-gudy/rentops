import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { OrganizationMember } from './entities/organization-member.entity';
import { OrgRoleGuard } from 'src/common/guards/org-role.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Organization, OrganizationMember]),
  ],
  providers: [OrganizationService, OrgRoleGuard],
  controllers: [OrganizationController],
  exports: [OrganizationService, TypeOrmModule]
})
export class OrganizationModule {}
