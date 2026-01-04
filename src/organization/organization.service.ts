import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { Repository } from 'typeorm';
import { OrganizationMember } from './entities/organization-member.entity';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UserRole } from 'src/common/enums/user-role.enum';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class OrganizationService {
    constructor(
    @InjectRepository(Organization)
    private readonly organizationRepo: Repository<Organization>,

    @InjectRepository(OrganizationMember)
    private readonly memberRepo: Repository<OrganizationMember>,
  ) {}

    async createOrganizationForOwner( user: User, dto: CreateOrganizationDto): Promise<Organization> {
      const slug = dto.name.toLowerCase().replace(/\s+/g, '-');
      const existing = await this.organizationRepo.findOne({
        where: { slug },
      });

      if (existing) {
        throw new Error('Organization already exists');
      }
    const organization = this.organizationRepo.create({ name: dto.name, slug, isActive: true });
    await  this.organizationRepo.save(organization);

    const ownerMember = this.memberRepo.create({
      organizationId: organization.id,
      userId: user.id,
      role: UserRole.LANDLORD_OWNER,
      isActive: true,
    });
    await this.memberRepo.save(ownerMember);
    return organization;
  }
}
