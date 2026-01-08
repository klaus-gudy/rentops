import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from './entities/property.entity';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UserRole } from 'src/common/enums/user-role.enum';
import { OrganizationMember } from 'src/organization/entities/organization-member.entity';

@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepo: Repository<Property>,

    @InjectRepository(OrganizationMember)
    private readonly memberRepo: Repository<OrganizationMember>,
  ) { }

  async create(orgId: string, dto: CreatePropertyDto) {
    const property = this.propertyRepo.create({
      ...dto,
      organizationId: orgId,
    });

    return this.propertyRepo.save(property);
  }

  async findAll(orgId: string) {
    return this.propertyRepo.find({
      where: { organizationId: orgId, isDeleted: false },
    });
  }

  async findOne(orgId: string, id: string) {
    const property = await this.propertyRepo.findOne({
      where: { id, organizationId: orgId, isDeleted: false },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    return property;
  }

  async softDelete(orgId: string, id: string) {
    const property = await this.findOne(orgId, id);
    property.isDeleted = true;
    return this.propertyRepo.save(property);
  }

  async assignManager(
    organizationId: string,
    propertyId: string,
    managerId: string,
    assignedBy: string,
  ) {
    // 1️⃣ Validate property ownership
    const property = await this.propertyRepo.findOne({
      where: {
        id: propertyId,
        organizationId,
        isDeleted: false,
      },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    // 2️⃣ Validate manager is org member
    const member = await this.memberRepo.findOne({
      where: {
        organizationId,
        userId: managerId,
        role: UserRole.PROPERTY_MANAGER,
        isActive: true,
      },
    });

    if (!member) {
      throw new BadRequestException(
        'User is not an active property manager in this organization',
      );
    }

    // 3️⃣ Assign manager
    property.assignedManagerId = managerId;

    await this.propertyRepo.save(property);

    return {
      message: 'Property manager assigned successfully',
    };
  }
}
