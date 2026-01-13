import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Unit } from './entities/unit.entity';

import { UnitStatus } from 'src/common/enums/unit-status.enum';
import { CreateUnitDto } from './dto/create-unit.dto';
import { Property } from 'src/property/entities/property.entity';

@Injectable()
export class UnitService {
  constructor(
    @InjectRepository(Unit)
    private readonly unitRepo: Repository<Unit>,

    @InjectRepository(Property)
    private readonly propertyRepo: Repository<Property>,
  ) {}

  async createUnit(
    organizationId: string,
    propertyId: string,
    dto: CreateUnitDto,
  ) {
    // 1️⃣ Validate property belongs to org
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

    // 2️⃣ Prevent duplicate unit numbers
    const existing = await this.unitRepo.findOne({
      where: {
        propertyId,
        unitNumber: dto.unitNumber,
      },
    });

    if (existing) {
      throw new BadRequestException(
        'Unit number already exists for this property',
      );
    }

    // 3️⃣ Create unit
    const unit = this.unitRepo.create({
      ...dto,
      propertyId,
      organizationId,
      status: UnitStatus.VACANT,
    });

    return this.unitRepo.save(unit);
  }
}
