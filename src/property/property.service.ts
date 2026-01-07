import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from './entities/property.entity';
import { CreatePropertyDto } from './dto/create-property.dto';

@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepo: Repository<Property>,
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
}
