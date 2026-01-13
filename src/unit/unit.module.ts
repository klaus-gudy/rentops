import { Module } from '@nestjs/common';
import { UnitService } from './unit.service';
import { UnitController } from './unit.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Unit } from './entities/unit.entity';
import { Property } from 'src/property/entities/property.entity';
import { OrganizationModule } from 'src/organization/organization.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Unit, Property]),
    OrganizationModule,
  ],
  providers: [UnitService],
  controllers: [UnitController]
})
export class UnitModule {}
