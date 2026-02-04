import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  Unique,
  OneToMany,
} from 'typeorm';

import { UnitStatus } from 'src/common/enums/unit-status.enum';
import { Property } from 'src/property/entities/property.entity';
import { Lease } from 'src/lease/entities/lease.entity';

@Entity('units')
@Unique(['propertyId', 'unitNumber'])
@Index(['organizationId'])
export class Unit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  organizationId: string;

  @Column()
  propertyId: string;

  @ManyToOne(() => Property, (property) => property.units, {
    onDelete: 'CASCADE',
  })
  property: Property;

  @OneToMany(() => Lease, (lease) => lease.unit)
leases: Lease[];

  @Column()
  unitNumber: string;

  @Column('decimal')
  rentAmount: number;

  @Column({
    type: 'enum',
    enum: UnitStatus,
    default: UnitStatus.VACANT,
  })
  status: UnitStatus;

  @Column({ nullable: true })
  floor?: number;

  @Column({ nullable: true })
  size?: number; // sqm

  @Column({ nullable: true })
  type?: string; // studio, 1br, etc

  @Column({ default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
