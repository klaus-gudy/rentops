import { LeaseStatus } from "src/common/enums/lease-statu.enum";
import { OrganizationMember } from "src/organization/entities/organization-member.entity";
import { Unit } from "src/unit/entities/unit.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('leases')
export class Lease {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  referenceNumber: string;

  @Column()
  organizationId: string;

  /* -------------------- UNIT -------------------- */

  @Column()
  unitId: string;

  @ManyToOne(() => Unit, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'unitId' })
  unit: Unit;

  /* -------------------- TENANT -------------------- */

  @Column()
  tenantId: string;

  @ManyToOne(() => OrganizationMember, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'tenantId' })
  tenant: OrganizationMember;

  /* -------------------- DATES -------------------- */

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({ type: 'decimal' })
  rentAmount: number;

  @Column({
    type: 'enum',
    enum: LeaseStatus,
    default: LeaseStatus.PENDING,
  })
  status: LeaseStatus;

  @Column({ nullable: true })
  terminatedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
