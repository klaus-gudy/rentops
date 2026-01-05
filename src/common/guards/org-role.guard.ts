import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { InjectRepository } from "@nestjs/typeorm";
import { OrganizationMember } from "src/organization/entities/organization-member.entity";
import { Repository } from "typeorm";
import { UserRole } from "../enums/user-role.enum";
import { ROLES_KEY } from "../decorators/roles.decorator";

@Injectable()
export class OrgRoleGuard implements CanActivate {
  constructor(
    @InjectRepository(OrganizationMember)
    private readonly memberRepo: Repository<OrganizationMember>,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const organizationId =
      request.params.organizationId ||
      request.headers['x-organization-id'];

    if (!organizationId) {
      throw new ForbiddenException('Organization context missing');
    }

    const allowedRoles =
      this.reflector.get<UserRole[]>(
        ROLES_KEY,
        context.getHandler(),
      ) || [];

    const membership = await this.memberRepo.findOne({
      where: {
        organizationId,
        userId: user.id,
        isActive: true,
      },
    });

    if (!membership) {
      throw new ForbiddenException('You are not a member of this organization');
    }

    if (allowedRoles.length && !allowedRoles.includes(membership.role)) {
      throw new ForbiddenException('You do not have permission for this action');
    }

    // attach membership for downstream use
    request.organizationMember = membership;

    return true;
  }
}