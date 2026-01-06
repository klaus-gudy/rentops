import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { Repository } from 'typeorm';
import { OrganizationMember } from './entities/organization-member.entity';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UserRole } from 'src/common/enums/user-role.enum';
import { User } from 'src/users/entities/user.entity';
import { InviteMemberDto } from './dto/invite-member.dto';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepo: Repository<Organization>,

    @InjectRepository(OrganizationMember)
    private readonly memberRepo: Repository<OrganizationMember>,
  ) { }

  async createOrganizationForOwner(user: User, dto: CreateOrganizationDto): Promise<Organization> {
    const slug = dto.name.toLowerCase().replace(/\s+/g, '-');
    const existing = await this.organizationRepo.findOne({
      where: { slug },
    });

    if (existing) {
      throw new Error('Organization already exists');
    }
    const organization = this.organizationRepo.create({ name: dto.name, slug, isActive: true });
    await this.organizationRepo.save(organization);

    const ownerMember = this.memberRepo.create({
      organizationId: organization.id,
      userId: user.id,
      role: UserRole.LANDLORD_OWNER,
      isActive: true,
    });
    await this.memberRepo.save(ownerMember);
    return organization;
  }

  async inviteTenant(
    orgId: string,
    inviter: User,
    dto: InviteMemberDto,
  ) {
    // Only TENANT allowed for now
    if (dto.role !== UserRole.TENANT) {
      throw new BadRequestException('Only tenants can be invited');
    }

    // Ensure inviter is OWNER
    const inviterMembership = await this.memberRepo.findOne({
      where: {
        organizationId: orgId,
        userId: inviter.id,
        role: UserRole.LANDLORD_OWNER,
        isActive: true,
      },
    });

    if (!inviterMembership) {
      throw new ForbiddenException('Only owners can invite tenants');
    }

    // Prevent duplicate invitations
    const existingInvite = await this.memberRepo.findOne({
      where: {
        organizationId: orgId,
        invitedEmail: dto.email,
      },
    });

    if (existingInvite) {
      throw new ConflictException('User already invited or exists');
    }

    const member = this.memberRepo.create({
      organizationId: orgId,
      invitedEmail: dto.email,
      role: UserRole.TENANT,
      isActive: false,
    });

    await this.memberRepo.save(member);
    // TODO: send email with invite token

    return {
      message: 'Tenant invited successfully',
    };
  }

  async activateInvitation(email: string, user: User) {
    const invitation = await this.memberRepo.findOne({
      where: {
        invitedEmail: email,
        isActive: false,
      },
    });

    if (!invitation) {
      throw new BadRequestException('Invalid or expired invitation');
    }

    invitation.userId = user.id;
    // invitation.invitedEmail = null;
    invitation.isActive = true;

    await this.memberRepo.save(invitation);

    return invitation;
  }

  async listOrganizationMembers(organizationId: string) {
    return this.memberRepo.find({
      where: { organizationId },
      relations: ['user'],
      order: { createdAt: 'ASC' },
    });
  }

  async softRemoveMember(
    organizationId: string,
    memberId: string,
  ) {
    const member = await this.memberRepo.findOne({
      where: {
        id: memberId,
        organizationId,
        isActive: true,
      },
    });

    if (!member) {
      throw new NotFoundException(
        'Organization member not found',
      );
    }

    if (member.role === UserRole.LANDLORD_OWNER) {
      throw new BadRequestException(
        'Owner cannot be removed from organization',
      );
    }

    member.isActive = false;
    await this.memberRepo.save(member);

    return {
      message: 'Member removed from organization',
    };
  }
}
