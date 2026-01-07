import { Module } from '@nestjs/common';
import { PropertyService } from './property.service';
import { PropertyController } from './property.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Property } from './entities/property.entity';
import { OrganizationModule } from 'src/organization/organization.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Property]),
    OrganizationModule,
  ],
  providers: [PropertyService],
  controllers: [PropertyController]
})
export class PropertyModule {}
