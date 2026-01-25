import { LeaseStatus } from "src/common/enums/lease-statu.enum";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('leases')
export class Lease {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  referenceNumber: string;

  @Column()
  organizationId: string;

  @Column()
  unitId: string;

  @Column()
  tenantId: string;

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
