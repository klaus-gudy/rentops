import { UserRole } from "src/common/enums/user-role.enum";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { Organization } from "./organization.entity";
import { User } from "src/users/entities/user.entity";

@Entity('organization_members')
@Unique(['organizationId', 'userId'])
export class OrganizationMember {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    userId: string;

    @Column()
    organizationId: string;

    @Column({ nullable: true })
    invitedEmail: string;

    @Column({ type: 'enum', enum: UserRole })
    role: UserRole;

    @Column({ default: true })
    isActive: boolean;

    @ManyToOne(() => Organization, (org) => org.organizationMembers)
    organization: Organization;

    @ManyToOne(() => User, { nullable: true })
    user: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}