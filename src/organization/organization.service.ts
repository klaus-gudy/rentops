import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { Repository } from 'typeorm';
import { OrganizationMember } from './entities/organization-member.entity';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UserRole } from 'src/common/enums/user-role.enum';

@Injectable()
export class OrganizationService {
    constructor(
    @InjectRepository(Organization)
    private readonly organizationRepo: Repository<Organization>,

    @InjectRepository(OrganizationMember)
    private readonly memberRepo: Repository<OrganizationMember>,
  ) {}

    async createOrganization( userId: string, dto: CreateOrganizationDto): Promise<Organization> {
    const organization = this.organizationRepo.create({ name: dto.name });
    await  this.organizationRepo.save(organization);

    const ownerMember = this.memberRepo.create({
      organizationId: organization.id,
      userId,
      role: UserRole.LANDLORD_OWNER,
    });
    await this.memberRepo.save(ownerMember);
    return organization;
  }
}
