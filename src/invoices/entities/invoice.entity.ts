import { InvoiceStatus } from "src/common/enums/invoice-status.enum";
import { Lease } from "src/lease/entities/lease.entity";
import { OrganizationMember } from "src/organization/entities/organization-member.entity";
import { Unit } from "src/unit/entities/unit.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('invoices')
export class Invoice {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    organizationId: string;

    @Column()
    leaseId: string;

    @Column()
    unitId: string;

    @Column()
    tenantId: string;

    @Column({ type: 'decimal' })
    amount: number;

    @Column({ type: 'decimal', default: 0 })
    amountPaid: number;

    @Column({ type: 'date' })
    dueDate: Date;

    @Column({
        type: 'enum',
        enum: InvoiceStatus,
        default: InvoiceStatus.PENDING,
    })
    status: InvoiceStatus;

    @ManyToOne(() => Lease)
    lease: Lease;

    @ManyToOne(() => Unit)
    unit: Unit;

    @ManyToOne(() => OrganizationMember)
    tenant: OrganizationMember;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
